import React, { useEffect, useState, useMemo, useCallback } from 'react';
import * as API from '../../api'; 
import { 
  Trash2, Search, Download, 
  MessageCircle, Mail, Share2, CheckSquare, Square, X, 
  FileSpreadsheet, Copy, Users, TrendingUp, 
  AlertCircle, CheckCircle2, ArrowUpDown,
  Calendar, Layers, Clock, ExternalLink, Phone, Briefcase, FileText, ChevronDown
} from 'lucide-react';

/**
 * ============================================================================
 * CONFIGURATION & CONSTANTS
 * ============================================================================
 */

const CSV_HEADERS = [
  { header: 'ID', key: 'id' },
  { header: 'Full Name', key: 'name' },
  { header: 'Email Address', key: 'email' },
  { header: 'Phone Number', key: 'phone' },
  { header: 'Service Category', key: 'service' },
  { header: 'Specific Services', key: 'sub_services' },
  { header: 'Timeline', key: 'timeline' },
  { header: 'Lead Source', key: 'source' },
  { header: 'Status', key: 'status' },
  { header: 'Created Date', key: 'created_at' },
  { header: 'Message/Notes', key: 'message' },
];

const STATUS_CONFIG = {
  'new': { label: 'New Lead', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
  'forwarded': { label: 'Forwarded', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
  'done': { label: 'Done', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  'canceled': { label: 'Canceled', color: 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200' },
  'spam': { label: 'Spam', color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' },
};

/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 */

const generateCSVContent = (data) => {
  const headerRow = CSV_HEADERS.map(col => col.header).join(',');
  const rows = data.map(row => {
    return CSV_HEADERS.map(col => {
      let val = row[col.key];
      if (col.key === 'created_at' && val) {
        val = new Date(val).toLocaleDateString() + ' ' + new Date(val).toLocaleTimeString();
      }
      if (val === null || val === undefined) val = '';
      val = String(val).replace(/"/g, '""'); 
      return `"${val}"`;
    }).join(',');
  });
  return [headerRow, ...rows].join('\n');
};

const generateLeadText = (lead) => {
    const date = new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const status = lead.status ? lead.status.toUpperCase() : 'NEW';
    return `*LEAD ASSIGNMENT* [${status}] 🚀\n────────────────\n👤 *${lead.name}*\n${lead.company ? `🏢 ${lead.company}\n` : ''}📞 ${lead.phone}\n📧 ${lead.email}\n\n📌 *Requirement:* ${lead.service}\n🛠 *Specifics:* ${lead.sub_services || 'N/A'}\n⏳ *Timeline:* ${lead.timeline || 'Flexible'}\n\n📝 *Message:*\n${lead.message || 'No additional notes provided.'}\n\n────────────────\n📅 ${date} • Sent via Admin Portal`;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

const calculateStats = (data) => {
  const total = data.length;
  const chatbot = data.filter(d => d.source?.toLowerCase().includes('chat')).length;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newLeads = data.filter(d => new Date(d.created_at) > oneWeekAgo).length;
  return { total, chatbot, newLeads };
};

/**
 * ============================================================================
 * SUB-COMPONENTS
 * ============================================================================
 */

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800';
  const Icon = type === 'error' ? AlertCircle : CheckCircle2;

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-4 px-6 py-4 rounded-xl border shadow-xl shadow-slate-200/50 animate-in slide-in-from-right-10 fade-in duration-300 ${bgClass} min-w-[300px] max-w-[90vw]`}>
      <Icon size={24} className="shrink-0"/>
      <div className="flex-1 font-medium text-sm">{message}</div>
      <button type="button" onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-black/5"><X size={16}/></button>
    </div>
  );
};

const StatCard = ({ label, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex flex-col justify-center h-full">
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
      <h3 className="text-4xl font-black text-slate-800 tracking-tight leading-none">{value}</h3>
      {subtext && <span className="mt-3 self-start inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-50 text-slate-500 border border-slate-100">{subtext}</span>}
    </div>
    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${colorClass} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
      <Icon size={32} strokeWidth={2.5} />
    </div>
  </div>
);

const StatusDropdown = ({ currentStatus, onChange }) => {
    const activeConfig = STATUS_CONFIG[currentStatus?.toLowerCase()] || STATUS_CONFIG['new'];
    
    return (
        <div className="relative group/status">
            <button type="button" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all ${activeConfig.color}`}>
                {activeConfig.label}
                <ChevronDown size={12} className="opacity-50"/>
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 p-1 hidden group-hover/status:block z-50 animate-in fade-in zoom-in-95 duration-200">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button
                        type="button"
                        key={key}
                        onClick={(e) => { e.stopPropagation(); onChange(key); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase mb-0.5 last:mb-0 transition-colors ${
                            key === currentStatus 
                            ? 'bg-slate-100 text-slate-900' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                    >
                        {config.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const TableSkeleton = () => (
  <div className="animate-pulse w-full">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="flex items-center space-x-6 p-5 border-b border-slate-50 w-full">
        <div className="h-5 w-5 bg-slate-200 rounded"></div>
        <div className="h-10 w-10 bg-slate-200 rounded-full shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-3 bg-slate-100 rounded w-1/3"></div>
        </div>
        <div className="h-8 w-24 bg-slate-100 rounded-lg"></div>
        <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
      </div>
    ))}
  </div>
);

/**
 * ============================================================================
 * MAIN COMPONENT: LEADS MANAGER
 * ============================================================================
 */
export default function LeadsManager() {
  // --- STATE ---
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, chatbot: 0, newLeads: 0 });
  const [toasts, setToasts] = useState([]); 
  
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [selectedLeads, setSelectedLeads] = useState([]);

  // --- MODAL STATE ---
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [leadDetail, setLeadDetail] = useState(null);

  const [actionModal, setActionModal] = useState({ 
    open: false, 
    type: 'bulk', 
    data: null    
  });

  // --- ACTIONS ---
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.getLeads();
      setLeads(res.data || []);
      setStats(calculateStats(res.data || []));
    } catch (err) {
      addToast("Failed to load leads.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // --- EFFECTS ---
  useEffect(() => { 
    fetchLeads(); 
  }, [fetchLeads]);

  // --- FILTERING ---
  const processedLeads = useMemo(() => {
    let result = [...leads];
    if (filterType !== 'all') {
      result = result.filter(l => filterType === 'chatbot' ? l.source?.toLowerCase().includes('chat') : l.source?.toLowerCase().includes('web'));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.phone?.includes(q));
    }
    result.sort((a, b) => {
      let valA = a[sortConfig.key] || '';
      let valB = b[sortConfig.key] || '';
      if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [leads, filterType, searchQuery, sortConfig]);

  const handleSort = (key) => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Permanently delete this lead?")) return;
    try {
      await API.deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      setSelectedLeads(prev => prev.filter(sid => sid !== id));
      addToast("Lead deleted.");
      setStats(calculateStats(leads.filter(l => l.id !== id)));
    } catch (err) { addToast("Failed to delete.", "error"); }
  };

  const handleStatusUpdate = async (id, newStatus) => {
      try {
          // 1. Find the current lead to preserve all its existing data
          const currentLead = leads.find(l => l.id === id);
          if (!currentLead) {
             addToast("Lead not found locally.", "error");
             return;
          }

          // 2. Optimistic UI Update
          const updatedLeads = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
          setLeads(updatedLeads);
          
          if (leadDetail && leadDetail.id === id) {
              setLeadDetail({ ...leadDetail, status: newStatus });
          }

          // 3. Create FormData with ALL fields to satisfy PUT requirements
          const formData = new FormData();
          formData.append('name', currentLead.name);
          formData.append('email', currentLead.email || '');
          formData.append('phone', currentLead.phone || '');
          formData.append('company', currentLead.company || '');
          formData.append('service', currentLead.service || '');
          formData.append('sub_services', currentLead.sub_services || '');
          formData.append('timeline', currentLead.timeline || '');
          formData.append('message', currentLead.message || '');
          formData.append('source', currentLead.source || 'website');
          formData.append('status', newStatus);

          // 4. Send PUT request
          await API.updateItem('leads', id, formData); 
          
          addToast(`Status updated to ${newStatus.toUpperCase()}`);
      } catch (err) {
          console.error(err);
          addToast("Failed to update status", "error");
          fetchLeads(); // Revert changes on failure
      }
  };

  const toggleSelection = (id) => setSelectedLeads(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const selectAllVisible = () => {
    const allIds = processedLeads.map(l => l.id);
    const allSelected = allIds.every(id => selectedLeads.includes(id));
    setSelectedLeads(allSelected ? prev => prev.filter(id => !allIds.includes(id)) : Array.from(new Set([...selectedLeads, ...allIds])));
  };

  // --- SHARING LOGIC ---
  const downloadCSV = (leadsToExport) => {
    const csvContent = generateCSVContent(leadsToExport);
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `XpertAI_Leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareAction = (method) => {
    const isBulk = actionModal.type === 'bulk';
    
    if (isBulk) {
        // --- BULK LOGIC ---
        const leadsToExport = leads.filter(l => selectedLeads.includes(l.id));
        downloadCSV(leadsToExport);
        
        const count = leadsToExport.length;
        const generatedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timestamps = leadsToExport.map(l => new Date(l.created_at).getTime());
        const minDate = new Date(Math.min(...timestamps)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const maxDate = new Date(Math.max(...timestamps)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
        const sources = [...new Set(leadsToExport.map(l => l.source || 'Unknown'))];
        const sourceType = sources.length === 1 ? `${sources[0].charAt(0).toUpperCase() + sources[0].slice(1)} Leads` : `Mixed Source (${sources.length} types)`;

        const msg = method === 'whatsapp' 
            ? `*LEADS EXPORT SUMMARY* 🗂️\n────────────────\n📅 *Generated:* ${generatedDate}\n📊 *Count:* ${count} Leads\n\n🔍 *Data Overview:*\n• *Type:* ${sourceType}\n• *Period:* ${minDate} - ${maxDate}\n\n📎 *ACTION REQUIRED:*\nPlease find the CSV file attached below.\n────────────────\n_XpertAI Admin Panel_`
            : `LEADS EXPORT SUMMARY 🗂️\n\n📅 Generated: ${generatedDate}\n📊 Count: ${count} Leads\n\n🔍 Data Overview:\n• Type: ${sourceType}\n• Period: ${minDate} - ${maxDate}\n\n📎 ACTION REQUIRED:\nPlease find the CSV file attached below.\n\nXpertAI Admin Panel`;
        
        const url = method === 'whatsapp' ? `https://wa.me/?text=${encodeURIComponent(msg)}` : `mailto:?subject=${encodeURIComponent(`Bulk Leads Export (${count}) - ${generatedDate}`)}&body=${encodeURIComponent(msg)}`;
        setTimeout(() => { window.open(url, '_blank'); addToast("Opened app. Please attach the downloaded file."); }, 1000);

    } else {
        // --- SINGLE LOGIC ---
        const lead = actionModal.data;
        const fullText = generateLeadText(lead);
        if (method === 'copy') {
            copyToClipboard(fullText);
            addToast("Full lead details copied to clipboard!");
            return;
        }
        const url = method === 'whatsapp' ? `https://wa.me/?text=${encodeURIComponent(fullText)}` : `mailto:?subject=${encodeURIComponent(`Lead Assignment: ${lead.name}`)}&body=${encodeURIComponent(fullText)}`;
        window.open(url, '_blank');
        addToast("Sharing lead details...");
    }
    setActionModal({ ...actionModal, open: false });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-10 font-sans text-slate-600 pb-32">
      {toasts.map(t => <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />)}

      <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Leads Management
                <span className="text-sm bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold">{leads.length} Total</span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">View, track, and distribute incoming client inquiries.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
             <button type="button" onClick={fetchLeads} className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition shadow-sm flex items-center gap-2 justify-center">
                <ArrowUpDown size={16} className="text-slate-400"/> Refresh
             </button>
             <button type="button" onClick={() => { selectAllVisible(); if(leads.length>0) setActionModal({open:true, type:'bulk'}); }} className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition flex items-center gap-2 transform active:scale-95 justify-center">
                <Download size={18}/> Export All
             </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard label="TOTAL DATABASE" value={stats.total} icon={Users} colorClass="bg-blue-50 text-blue-600" />
          <StatCard label="CHATBOT SOURCE" value={stats.chatbot} icon={MessageCircle} colorClass="bg-purple-50 text-purple-600" />
          <StatCard label="NEW THIS WEEK" value={stats.newLeads} subtext="Needs Attention" icon={TrendingUp} colorClass="bg-emerald-50 text-emerald-600" />
        </div>

        {/* CONTROLS */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col gap-4 sticky top-4 z-30">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18}/>
            <input type="text" placeholder="Search by name, email, phone..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition text-sm font-bold text-slate-700"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 w-full overflow-x-auto pb-2 hide-scrollbar">
            {['all', 'chatbot', 'website'].map(type => (
              <button key={type} type="button" onClick={() => setFilterType(type)} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${filterType === type ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                {type === 'all' && <Layers size={14}/>}{type === 'chatbot' && <MessageCircle size={14}/>}{type === 'website' && <ExternalLink size={14}/>}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* BULK ACTION BAR */}
        {selectedLeads.length > 0 && (
            <div className="fixed bottom-8 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-40 bg-slate-900 text-white px-4 sm:px-6 py-3 rounded-full shadow-2xl shadow-slate-900/40 flex items-center justify-between sm:gap-6 animate-in slide-in-from-bottom-10 fade-in duration-300 border border-slate-700">
                <div className="flex items-center gap-3 pr-4 border-r border-slate-700">
                    <span className="font-bold bg-white/10 px-3 py-1 rounded-full text-sm">{selectedLeads.length}</span>
                    <span className="text-sm font-medium text-slate-300 hidden sm:inline">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setActionModal({open:true, type:'bulk'})} className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition font-bold text-sm">
                        <Share2 size={16} className="text-indigo-400"/> <span className="hidden sm:inline">Share / Export</span>
                    </button>
                    <button type="button" onClick={() => { if(window.confirm("Delete selected?")) { selectedLeads.forEach(id => handleDelete({stopPropagation:()=>{}}, id)); } }} className="flex items-center gap-2 hover:bg-red-500/20 px-3 py-2 rounded-lg transition font-bold text-sm text-red-400 hover:text-red-300">
                        <Trash2 size={16}/> <span className="hidden sm:inline">Delete</span>
                    </button>
                </div>
                <button type="button" onClick={() => setSelectedLeads([])} className="ml-2 hover:bg-white/10 p-1.5 rounded-full transition"><X size={16}/></button>
            </div>
        )}

        {/* DATA TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? <div className="p-12"><TableSkeleton/></div> : (
                <>
                    <div className="hidden sm:block overflow-x-auto max-h-[70vh] custom-scrollbar">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-10 backdrop-blur-sm">
                                <tr>
                                    <th className="p-5 w-16 text-center">
                                        <button type="button" onClick={selectAllVisible} className="text-slate-400 hover:text-indigo-600 transition">
                                            {selectedLeads.length > 0 && processedLeads.every(l => selectedLeads.includes(l.id)) ? <CheckSquare size={20}/> : <Square size={20}/>}
                                        </button>
                                    </th>
                                    <th className="p-5 font-bold text-slate-700 cursor-pointer hover:text-indigo-600 transition" onClick={() => handleSort('name')}>
                                        <div className="flex items-center gap-2">Lead Profile <ArrowUpDown size={14} className="opacity-40"/></div>
                                    </th>
                                    <th className="p-5 font-bold text-slate-700">Contact Info</th>
                                    <th className="p-5 font-bold text-slate-700 cursor-pointer hover:text-indigo-600 transition" onClick={() => handleSort('status')}>
                                         <div className="flex items-center gap-2">Status <ArrowUpDown size={14} className="opacity-40"/></div>
                                    </th>
                                    <th className="p-5 font-bold text-slate-700 cursor-pointer hover:text-indigo-600 transition" onClick={() => handleSort('source')}>
                                         <div className="flex items-center gap-2">Source <ArrowUpDown size={14} className="opacity-40"/></div>
                                    </th>
                                    <th className="p-5 font-bold text-slate-700 cursor-pointer hover:text-indigo-600 transition" onClick={() => handleSort('created_at')}>
                                         <div className="flex items-center gap-2">Date <ArrowUpDown size={14} className="opacity-40"/></div>
                                    </th>
                                    <th className="p-5 text-center font-bold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {processedLeads.length === 0 ? (
                                    <tr><td colSpan="7" className="p-20 text-center"><div className="flex flex-col items-center justify-center text-slate-400"><div className="bg-slate-50 p-6 rounded-full mb-4"><Search size={40} className="opacity-20"/></div><p className="text-xl font-bold text-slate-600">No leads found</p></div></td></tr>
                                ) : processedLeads.map((lead) => (
                                    <tr key={lead.id} onClick={() => { setLeadDetail(lead); setDetailModalOpen(true); }} className={`group hover:bg-slate-50/80 transition cursor-pointer ${selectedLeads.includes(lead.id) ? 'bg-indigo-50/40' : ''}`}>
                                        <td className="p-5 text-center" onClick={(e) => e.stopPropagation()}>
                                            <button type="button" onClick={() => toggleSelection(lead.id)} className={`transition ${selectedLeads.includes(lead.id) ? 'text-indigo-600 scale-110' : 'text-slate-300 group-hover:text-slate-400'}`}>
                                                {selectedLeads.includes(lead.id) ? <CheckSquare size={20}/> : <Square size={20}/>}
                                            </button>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-white text-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-100 shadow-sm">{lead.name?.substring(0,2).toUpperCase()}</div>
                                                <div><div className="font-bold text-slate-900 text-[15px]">{lead.name}</div><div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">{lead.company ? <><Briefcase size={12}/> {lead.company}</> : 'Individual'}</div></div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="space-y-1.5"><div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><Mail size={14} className="text-slate-400"/> {lead.email}</div><div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><Phone size={14} className="text-slate-400"/> {lead.phone}</div></div>
                                        </td>
                                        <td className="p-5" onClick={(e) => e.stopPropagation()}>
                                            <StatusDropdown currentStatus={lead.status || 'new'} onChange={(newStatus) => handleStatusUpdate(lead.id, newStatus)}/>
                                        </td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border uppercase tracking-wider ${lead.source === 'chatbot' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                {lead.source === 'chatbot' ? <MessageCircle size={12}/> : <ExternalLink size={12}/>} {lead.source}
                                            </span>
                                        </td>
                                        <td className="p-5 text-xs font-bold text-slate-500">{formatDate(lead.created_at)}<div className="text-[10px] font-medium text-slate-400 mt-0.5">{formatTime(lead.created_at)}</div></td>
                                        <td className="p-5" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                                                <button type="button" onClick={(e) => { e.stopPropagation(); setActionModal({open:true, type:'single', data:lead}); }} className="p-2 hover:bg-indigo-50 rounded-xl text-slate-400 hover:text-indigo-600 transition" title="Quick Share"><Share2 size={18}/></button>
                                                <button type="button" onClick={(e) => handleDelete(e, lead.id)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition" title="Delete"><Trash2 size={18}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="sm:hidden space-y-4 p-4">
                        {processedLeads.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-slate-50 p-4 rounded-full mb-4 inline-block"><Search size={40} className="opacity-20"/></div>
                                <p className="text-lg font-bold text-slate-600">No leads found</p>
                                <p className="text-sm">Try adjusting filters or search terms.</p>
                            </div>
                        ) : processedLeads.map((lead) => (
                            <div 
                                key={lead.id} 
                                onClick={() => { setLeadDetail(lead); setDetailModalOpen(true); }}
                                className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer ${selectedLeads.includes(lead.id) ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-100'}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); toggleSelection(lead.id); }} 
                                            className={`transition ${selectedLeads.includes(lead.id) ? 'text-indigo-600' : 'text-slate-300'}`}
                                        >
                                            {selectedLeads.includes(lead.id) ? <CheckSquare size={22}/> : <Square size={22}/>}
                                        </button>
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-white text-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-100 shadow-sm">
                                            {lead.name?.substring(0,2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-lg">{lead.name}</div>
                                            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                                {lead.company ? <><Briefcase size={10}/> {lead.company}</> : 'Individual'}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setActionModal({open:true, type:'single', data:lead}); }}
                                        className="p-2 bg-indigo-50 rounded-xl text-indigo-600"
                                    >
                                        <Share2 size={18}/>
                                    </button>
                                </div>
                                
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                        <Mail size={14} className="text-slate-400"/> {lead.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                        <Phone size={14} className="text-slate-400"/> {lead.phone}
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Calendar size={14}/> {formatDate(lead.created_at)}
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${lead.source === 'chatbot' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {lead.source}
                                        </span>
                                    </div>
                                </div>

                                {/* Mobile Status Dropdown */}
                                <div className="border-t border-slate-50 pt-3 flex justify-between items-center" onClick={e => e.stopPropagation()}>
                                    <StatusDropdown currentStatus={lead.status || 'new'} onChange={(newStatus) => handleStatusUpdate(lead.id, newStatus)}/>
                                    <button 
                                        type="button"
                                        onClick={(e) => handleDelete(e, lead.id)}
                                        className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
      </div>

      {/* MODAL 1: LEAD DETAIL (ENHANCED WITH STATUS) */}
      {detailModalOpen && leadDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-slate-900/5">
                <div className="bg-slate-900 p-8 flex justify-between items-start text-white shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-white text-slate-900 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">{leadDetail.name.substring(0,2).toUpperCase()}</div>
                        <div>
                            <h2 className="text-2xl font-bold">{leadDetail.name}</h2>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="bg-white/10 px-2.5 py-0.5 rounded-lg text-white text-xs uppercase font-bold flex items-center gap-2">{leadDetail.source}</span>
                                <div className="bg-white/10 p-1 rounded-lg">
                                    {/* Status in Modal Header */}
                                    <StatusDropdown currentStatus={leadDetail.status || 'new'} onChange={(newStatus) => handleStatusUpdate(leadDetail.id, newStatus)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" onClick={() => setDetailModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition relative z-10"><X size={20}/></button>
                </div>
                <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
                    <div className="grid grid-cols-1 gap-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Users size={14}/> Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex gap-4 items-center"><div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={18}/></div><div><div className="text-[10px] text-slate-400 uppercase font-bold">Email</div><div className="font-bold text-slate-800">{leadDetail.email}</div></div></div>
                                <div className="flex gap-4 items-center"><div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={18}/></div><div><div className="text-[10px] text-slate-400 uppercase font-bold">Phone</div><div className="font-bold text-slate-800">{leadDetail.phone}</div></div></div>
                                <div className="flex gap-4 items-center"><div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Briefcase size={18}/></div><div><div className="text-[10px] text-slate-400 uppercase font-bold">Company</div><div className="font-bold text-slate-800">{leadDetail.company || 'N/A'}</div></div></div>
                                <div className="flex gap-4 items-center"><div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><TrendingUp size={18}/></div><div><div className="text-[10px] text-slate-400 uppercase font-bold">Status</div><div className="font-bold text-slate-800">{leadDetail.status || 'New Lead'}</div></div></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> Project Requirements</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0"><Layers size={18}/></div>
                                    <div><div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Core Service</div><span className="inline-block mt-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-bold border border-indigo-200">{leadDetail.service || 'General Inquiry'}</span></div>
                                </div>
                                {leadDetail.sub_services && (
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><CheckSquare size={18}/></div>
                                        <div><div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Specific Services</div><p className="font-medium text-slate-700 text-sm mt-1 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">{leadDetail.sub_services}</p></div>
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0"><Clock size={18}/></div>
                                    <div><div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Timeline</div><div className="font-bold text-slate-700 mt-1">{leadDetail.timeline || 'Flexible'}</div></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><MessageCircle size={14}/> Full Message</h3>
                            <div className="font-medium text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap">{leadDetail.message || "No message provided."}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => { setDetailModalOpen(false); handleDelete({ stopPropagation: ()=>{} }, leadDetail.id); }} className="bg-white border border-red-100 text-red-500 px-5 py-3 rounded-xl font-bold hover:bg-red-50 transition flex items-center gap-2"><Trash2 size={18}/> Delete</button>
                    <button type="button" onClick={() => { setDetailModalOpen(false); setActionModal({open:true, type:'single', data:leadDetail}); }} className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800 font-bold shadow-lg transition"><Share2 size={18}/> Share Lead</button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL 2: UNIFIED SHARE (Bulk & Single) */}
      {actionModal.open && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100">
                <button type="button" onClick={() => setActionModal({...actionModal, open:false})} className="absolute top-5 right-5 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition z-10 text-slate-500"><X size={20}/></button>
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
                        {actionModal.type === 'bulk' ? <FileSpreadsheet size={40}/> : <FileText size={40}/>}
                    </div>
                    <h2 className="text-2xl font-black text-slate-800">{actionModal.type === 'bulk' ? 'Export Leads' : 'Share Lead'}</h2>
                    <p className="text-slate-500 font-medium mt-2 mb-8 px-4">
                        {actionModal.type === 'bulk' 
                            ? `You selected ${selectedLeads.length} leads. Choose how you want to share the CSV file.` 
                            : `Share full details for ${actionModal.data?.name}.`
                        }
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                        <button type="button" onClick={() => handleShareAction('whatsapp')} className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-green-100 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-200 font-bold transition group">
                            <MessageCircle size={22} className="group-hover:scale-110 transition-transform"/> Share via WhatsApp
                        </button>
                        <button type="button" onClick={() => handleShareAction('email')} className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 font-bold transition group">
                            <Mail size={22} className="group-hover:scale-110 transition-transform"/> Share via Email
                        </button>
                        {actionModal.type === 'single' && (
                            <button type="button" onClick={() => handleShareAction('copy')} className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-200 font-bold transition group">
                                <Copy size={22} className="group-hover:scale-110 transition-transform"/> Copy to Clipboard
                            </button>
                        )}
                        {actionModal.type === 'bulk' && (
                            <>
                                <div className="my-2 text-xs font-bold text-slate-300 uppercase tracking-widest">Or</div>
                                <button type="button" onClick={() => { downloadCSV(leads.filter(l => selectedLeads.includes(l.id))); addToast("File downloaded successfully!"); }} className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold transition group shadow-sm">
                                    <Download size={20}/> Download File Only
                                </button>
                            </>
                        )}
                    </div>
                    {actionModal.type === 'bulk' && (
                        <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 text-center leading-relaxed">
                            <p className="font-bold text-slate-600 mb-1 flex items-center justify-center gap-1"><AlertCircle size={12}/> Important</p>
                            <p>For bulk sharing, the CSV file will download automatically. Please <strong>attach it manually</strong> in the app.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import * as API from '../../api'; 
import { 
  Loader2, Trash2, Search, Download, 
  MessageCircle, Mail, Share2, CheckSquare, Square, X, 
  History, FileSpreadsheet, Copy, Check, 
  Users, TrendingUp, AlertCircle, CheckCircle2, ArrowUpDown,
  Calendar, Layers, Clock, ExternalLink, ChevronRight, Phone, Briefcase
} from 'lucide-react';

/**
 * ============================================================================
 * CONFIGURATION & CONSTANTS
 * ============================================================================
 */

const ITEMS_PER_PAGE = 50; // Although we use single slide, good to have limits if needed later.

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

/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 */

/**
 * Generates a CSV string from an array of objects based on provided columns.
 * Handles escaping of special characters like quotes and commas.
 */
const generateCSVContent = (data) => {
  const headerRow = CSV_HEADERS.map(col => col.header).join(',');
  
  const rows = data.map(row => {
    return CSV_HEADERS.map(col => {
      let val = row[col.key];
      
      // Handle Date Objects or Strings
      if (col.key === 'created_at' && val) {
        val = new Date(val).toLocaleDateString() + ' ' + new Date(val).toLocaleTimeString();
      }

      // Handle Null/Undefined
      if (val === null || val === undefined) val = '';
      
      // Convert to string and escape double quotes
      val = String(val).replace(/"/g, '""'); 
      
      // Wrap in quotes to handle commas within data
      return `"${val}"`;
    }).join(',');
  });

  return [headerRow, ...rows].join('\n');
};

/**
 * Formats a date string into a user-friendly format (e.g., "Jan 12, 2024")
 */
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Formats a date string into a time string (e.g., "10:30 AM")
 */
const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Copies text to the clipboard and handles errors gracefully.
 */
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Calculates dashboard statistics from the leads array.
 */
const calculateStats = (data) => {
  const total = data.length;
  const chatbot = data.filter(d => d.source?.toLowerCase().includes('chat')).length;
  
  // Calculate "New Leads" (Last 7 Days)
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

/**
 * Toast Notification Component
 * Displays temporary success or error messages at the bottom of the screen.
 */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); // Auto-dismiss after 4s
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = type === 'error' 
    ? 'bg-red-50 border-red-200 text-red-800' 
    : 'bg-emerald-50 border-emerald-200 text-emerald-800';
  
  const Icon = type === 'error' ? AlertCircle : CheckCircle2;

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-4 px-6 py-4 rounded-xl border shadow-xl shadow-slate-200/50 animate-in slide-in-from-right-10 fade-in duration-300 ${bgClass} min-w-[300px]`}>
      <Icon size={24} className="shrink-0"/>
      <div className="flex-1 font-medium text-sm">{message}</div>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-black/5">
        <X size={16}/>
      </button>
    </div>
  );
};

/**
 * Statistic Card Component
 * Displays a single metric at the top of the dashboard.
 */
const StatCard = ({ label, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between hover:shadow-md transition-all duration-300 group">
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
      <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight group-hover:translate-x-1 transition-transform">{value}</h3>
      {subtext && <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-50 inline-block px-2 py-1 rounded-md">{subtext}</p>}
    </div>
    <div className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={24} />
    </div>
  </div>
);

/**
 * Skeleton Loader Component
 * Shows a loading state for the table rows.
 */
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
  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  
  // Data
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, chatbot: 0, newLeads: 0 });
  
  // UI State
  const [toasts, setToasts] = useState([]); 
  
  // Filtering & Sorting
  const [filterType, setFilterType] = useState('all'); // 'all', 'chatbot', 'website'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  // Selection
  const [selectedLeads, setSelectedLeads] = useState([]);

  // --- MODALS ---
  
  // 1. Lead Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [leadDetail, setLeadDetail] = useState(null);

  // 2. Share Modal (Individual/Multi-Recipient)
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareType, setShareType] = useState('whatsapp'); // 'whatsapp' | 'email'
  const [selectedLeadForShare, setSelectedLeadForShare] = useState(null);
  
  // Share Modal - Data
  const [shareRecipients, setShareRecipients] = useState([]); // History from API
  const [selectedHistoryRecipients, setSelectedHistoryRecipients] = useState([]); // Indices of selected history
  const [newRecipient, setNewRecipient] = useState({ name: '', phone: '', email: '' });
  
  // Share Modal - Results
  const [generatedSingleLinks, setGeneratedSingleLinks] = useState([]);
  const [shareLoading, setShareLoading] = useState(false);

  // 3. Bulk Export Modal
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  // --------------------------------------------------------------------------
  // EFFECTS & DATA FETCHING
  // --------------------------------------------------------------------------

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await API.getLeads();
      const data = res.data || [];
      // Normalize data if needed
      setLeads(data);
      setStats(calculateStats(data));
    } catch (err) {
      addToast("Failed to load leads from server. Please refresh.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toast Helper
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // --------------------------------------------------------------------------
  // COMPUTED DATA: FILTERING & SORTING
  // --------------------------------------------------------------------------

  const processedLeads = useMemo(() => {
    let result = [...leads];

    // 1. Filter by Type
    if (filterType !== 'all') {
      result = result.filter(l => {
        if (filterType === 'chatbot') return l.source?.toLowerCase().includes('chat');
        if (filterType === 'website') return l.source?.toLowerCase().includes('web');
        return true;
      });
    }

    // 2. Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => 
        l.name?.toLowerCase().includes(q) || 
        l.email?.toLowerCase().includes(q) ||
        l.phone?.includes(q) ||
        l.service?.toLowerCase().includes(q)
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Handle nulls
      if (!valA) valA = '';
      if (!valB) valB = '';

      // Case insensitive string sort
      if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [leads, filterType, searchQuery, sortConfig]);

  // --------------------------------------------------------------------------
  // HANDLERS: TABLE ACTIONS
  // --------------------------------------------------------------------------

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this lead?")) return;
    
    try {
      await API.deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      setSelectedLeads(prev => prev.filter(sid => sid !== id));
      addToast("Lead deleted successfully.");
      
      // Recalc stats immediately
      setStats(calculateStats(leads.filter(l => l.id !== id)));
    } catch (err) {
      addToast("Failed to delete lead from server.", "error");
    }
  };

  const toggleSelection = (id) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    const allIds = processedLeads.map(l => l.id);
    const allSelected = allIds.every(id => selectedLeads.includes(id));
    
    if (allSelected) {
      // Deselect all visible
      setSelectedLeads(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      // Select all visible (merge unique)
      const unique = new Set([...selectedLeads, ...allIds]);
      setSelectedLeads(Array.from(unique));
    }
  };

  // --------------------------------------------------------------------------
  // HANDLER: BULK EXPORT & SHARE (CSV)
  // --------------------------------------------------------------------------

  const downloadCSV = () => {
    const leadsToExport = leads.filter(l => selectedLeads.includes(l.id));
    const csvContent = generateCSVContent(leadsToExport);
    
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `XpertAI_Leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  };

  const handleOpenBulkModal = () => {
    if (selectedLeads.length === 0) return;
    setBulkModalOpen(true);
  };

  const executeBulkShare = (method) => {
    addToast("Generating and downloading CSV file...");
    
    // 1. Download file
    downloadCSV();

    // 2. Open Share Intent
    const count = selectedLeads.length;
    const date = new Date().toLocaleDateString();
    let message = '';
    let url = '';

    if (method === 'whatsapp') {
        message = `*Bulk Leads Export - ${date}*\n\nContains: ${count} leads\n\n📎 *ATTACHMENT:* Please find the downloaded CSV file attached.\n\n_Sent via XpertAI Admin Panel_`;
        url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    } else if (method === 'email') {
        const subject = `Bulk Leads Export (${count}) - ${date}`;
        message = `Here is the requested leads export.\n\nDate: ${date}\nCount: ${count}\n\n📎 *ATTACHMENT REQUIRED:*\nI have attached the downloaded CSV file containing the lead details.\n\nRegards,\nXpertAI Admin`;
        url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    }

    setTimeout(() => {
        if (url) window.open(url, '_blank');
        addToast("Opened share app. Please attach the downloaded file manually.");
    }, 1500);
  };

  // --------------------------------------------------------------------------
  // HANDLER: INDIVIDUAL SHARE (WhatsApp/Email)
  // --------------------------------------------------------------------------

  const handleOpenShareModal = async (e, lead) => {
    e.stopPropagation();
    setSelectedLeadForShare(lead);
    setShareModalOpen(true);
    setGeneratedSingleLinks([]);
    setNewRecipient({ name: '', phone: '', email: '' });
    setSelectedHistoryRecipients([]);

    try {
        // Fetch previous recipients to autofill
        const recRes = await API.getPreviousRecipients();
        setShareRecipients(recRes.data || []);
    } catch (err) {
        console.warn("Could not fetch recipient history", err);
    }
  };

  const handleSingleShareSubmit = async (e) => {
    e.preventDefault();
    setShareLoading(true);

    const recipientsToProcess = [];
    
    // 1. Collect from History Selection
    selectedHistoryRecipients.forEach(idx => {
        const item = shareRecipients[idx];
        recipientsToProcess.push({
            name: item.recipient_name, 
            phone: item.recipient_phone,
            // Assuming history doesn't strictly store email separate from phone logic yet, 
            // but for email sharing we might need an email field in history later. 
            // For now, we fallback to manual entry for emails or assume phone field holds it if customized.
            email: '' 
        });
    });

    // 2. Collect from Manual Input
    if (newRecipient.name && (newRecipient.phone || newRecipient.email)) {
        recipientsToProcess.push(newRecipient);
    }

    if (recipientsToProcess.length === 0) {
        addToast("Please select or enter at least one recipient.", "error");
        setShareLoading(false);
        return;
    }

    try {
        // Log to Backend (History)
        await API.logLeadShare(selectedLeadForShare.id, { 
            recipients: recipientsToProcess,
            method: shareType 
        });

        // Generate Links
        const links = [];
        const lead = selectedLeadForShare;

        if (shareType === 'whatsapp') {
            const text = `*New Lead Assignment*\n━━━━━━━━━━━━━━━━\n👤 *Name:* ${lead.name}\n📱 *Phone:* ${lead.phone}\n📧 *Email:* ${lead.email}\n🛠 *Service:* ${lead.service}\n📎 *Specifics:* ${lead.sub_services || '-'}\n📝 *Note:* ${lead.message || 'N/A'}\n━━━━━━━━━━━━━━━━\nSent via XpertAI`;
            
            recipientsToProcess.forEach(r => {
                if (r.phone) {
                    const cleanPhone = r.phone.replace(/[^0-9]/g, '');
                    links.push({
                        name: r.name || r.recipient_name,
                        url: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
                    });
                }
            });
        } else {
            // Email
            const subject = `Lead Assignment: ${lead.name}`;
            const body = `Hello,\n\nA new lead has been assigned to you.\n\n--------------------------------\nLead Details\n--------------------------------\nName: ${lead.name}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nService Category: ${lead.service}\nSpecific Services: ${lead.sub_services || 'N/A'}\nTimeline: ${lead.timeline || 'N/A'}\n\nMessage:\n${lead.message || 'N/A'}\n\nRegards,\nXpertAI Automation`;
            
            recipientsToProcess.forEach(r => {
                // If using manual email input
                if (r.email) {
                    links.push({
                        name: r.name || r.recipient_name,
                        url: `mailto:${r.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                    });
                }
            });
        }

        setGeneratedSingleLinks(links);
        
        if (links.length === 1) {
            // If only one, open immediately
            window.open(links[0].url, '_blank');
            addToast("Opening application...");
        } else {
            addToast(`Generated ${links.length} share links successfully.`);
        }

        // Reset inputs
        setNewRecipient({ name: '', phone: '', email: '' });
        setSelectedHistoryRecipients([]);

    } catch (err) {
        addToast("Failed to process share log.", "error");
        console.error(err);
    }
    setShareLoading(false);
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-600 pb-32">
      
      {/* Toast Overlay */}
      {toasts.map(t => (
        <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
      ))}

      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                Leads Management
                <span className="text-sm bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-medium">
                    {leads.length} Total
                </span>
            </h1>
            <p className="text-slate-500 mt-1">View, track, and distribute incoming client inquiries effectively.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={fetchLeads} 
                className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition shadow-sm flex items-center gap-2"
             >
                <ArrowUpDown size={16} className="text-slate-400"/> Refresh
             </button>
             <button 
                onClick={() => { selectAllVisible(); handleOpenBulkModal(); }} 
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition flex items-center gap-2 transform active:scale-95"
             >
                <Download size={18}/> Export All
             </button>
          </div>
        </div>

        {/* --- STATS ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Total Database" 
            value={stats.total} 
            icon={Users} 
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatCard 
            label="Chatbot Source" 
            value={stats.chatbot} 
            icon={MessageCircle} 
            colorClass="bg-purple-50 text-purple-600"
          />
          <StatCard 
            label="New This Week" 
            value={stats.newLeads} 
            subtext="Needs Attention"
            icon={TrendingUp} 
            colorClass="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* --- CONTROLS BAR (Search & Filter) --- */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-30">
          
          {/* Search */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18}/>
            <input 
              type="text" 
              placeholder="Search by name, email, phone..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition text-sm font-medium"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar px-2">
            {['all', 'chatbot', 'website'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  filterType === type 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {type === 'all' && <Layers size={14}/>}
                {type === 'chatbot' && <MessageCircle size={14}/>}
                {type === 'website' && <ExternalLink size={14}/>}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* --- FLOATING BULK ACTION BAR --- */}
        {selectedLeads.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl shadow-slate-900/40 flex items-center gap-6 animate-in slide-in-from-bottom-10 fade-in duration-300 border border-slate-700">
                <div className="flex items-center gap-3 pr-4 border-r border-slate-700">
                    <span className="font-bold bg-white/10 px-3 py-1 rounded-full text-sm">{selectedLeads.length}</span>
                    <span className="text-sm font-medium text-slate-300">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleOpenBulkModal}
                        className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition font-bold text-sm"
                    >
                        <Share2 size={16} className="text-indigo-400"/> Share / Export
                    </button>
                    <button 
                        onClick={() => {
                            if(window.confirm(`Are you sure you want to delete ${selectedLeads.length} leads? This cannot be undone.`)) {
                                const leadsToDelete = [...selectedLeads];
                                leadsToDelete.forEach(id => handleDelete({stopPropagation:()=>{}}, id));
                            }
                        }}
                        className="flex items-center gap-2 hover:bg-red-500/20 px-3 py-2 rounded-lg transition font-bold text-sm text-red-400 hover:text-red-300"
                    >
                        <Trash2 size={16}/> Delete
                    </button>
                </div>
                <button onClick={() => setSelectedLeads([])} className="ml-2 hover:bg-white/10 p-1.5 rounded-full transition"><X size={16}/></button>
            </div>
        )}

        {/* --- MAIN DATA TABLE --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? <div className="p-12"><TableSkeleton/></div> : (
                <div className="overflow-x-auto max-h-[70vh] custom-scrollbar">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-4 w-16 text-center">
                                    <button onClick={selectAllVisible} className="text-slate-400 hover:text-indigo-600 transition">
                                        {selectedLeads.length > 0 && processedLeads.every(l => selectedLeads.includes(l.id)) 
                                            ? <CheckSquare size={20}/> 
                                            : <Square size={20}/>
                                        }
                                    </button>
                                </th>
                                <th className="p-4 cursor-pointer hover:bg-slate-100 transition group" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-2 font-bold text-slate-700">
                                        Lead Profile <ArrowUpDown size={14} className="text-slate-400 group-hover:text-indigo-500"/>
                                    </div>
                                </th>
                                <th className="p-4 font-bold text-slate-700">Contact Info</th>
                                <th className="p-4 cursor-pointer hover:bg-slate-100 transition group" onClick={() => handleSort('source')}>
                                    <div className="flex items-center gap-2 font-bold text-slate-700">
                                        Source <ArrowUpDown size={14} className="text-slate-400 group-hover:text-indigo-500"/>
                                    </div>
                                </th>
                                <th className="p-4 cursor-pointer hover:bg-slate-100 transition group" onClick={() => handleSort('created_at')}>
                                    <div className="flex items-center gap-2 font-bold text-slate-700">
                                        Date <ArrowUpDown size={14} className="text-slate-400 group-hover:text-indigo-500"/>
                                    </div>
                                </th>
                                <th className="p-4 text-center font-bold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {processedLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="bg-slate-50 p-4 rounded-full mb-4"><Search size={40} className="opacity-20"/></div>
                                            <p className="text-lg font-bold text-slate-600">No leads found</p>
                                            <p className="text-sm">Try adjusting filters or search terms.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : processedLeads.map((lead) => (
                                <tr 
                                    key={lead.id} 
                                    onClick={() => { setLeadDetail(lead); setDetailModalOpen(true); }}
                                    className={`group hover:bg-slate-50/80 transition cursor-pointer ${selectedLeads.includes(lead.id) ? 'bg-indigo-50/40' : ''}`}
                                >
                                    {/* Selection Checkbox */}
                                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={() => toggleSelection(lead.id)} 
                                            className={`transition ${selectedLeads.includes(lead.id) ? 'text-indigo-600 scale-110' : 'text-slate-300 group-hover:text-slate-400'}`}
                                        >
                                            {selectedLeads.includes(lead.id) ? <CheckSquare size={20}/> : <Square size={20}/>}
                                        </button>
                                    </td>

                                    {/* Profile Name & Company */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center text-sm font-bold border border-indigo-200 shadow-sm">
                                                {lead.name?.substring(0,2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{lead.name}</div>
                                                <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                    {lead.company ? <><Briefcase size={10}/> {lead.company}</> : 'Individual'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact Details */}
                                    <td className="p-4">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                <Mail size={12} className="text-slate-400"/> {lead.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                <Phone size={12} className="text-slate-400"/> {lead.phone}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Source Badge */}
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wider ${
                                            lead.source === 'chatbot' 
                                            ? 'bg-purple-50 text-purple-700 border-purple-100' 
                                            : lead.source === 'website' 
                                                ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                            {lead.source === 'chatbot' ? <MessageCircle size={12}/> : <ExternalLink size={12}/>}
                                            {lead.source}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="p-4 text-xs font-medium text-slate-500">
                                        {formatDate(lead.created_at)}
                                        <div className="text-[10px] text-slate-400 mt-0.5">{formatTime(lead.created_at)}</div>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                                            <button 
                                                onClick={(e) => handleOpenShareModal(e, lead)}
                                                className="p-2 hover:bg-indigo-100 rounded-lg text-slate-400 hover:text-indigo-600 transition shadow-sm border border-transparent hover:border-indigo-200" 
                                                title="Quick Share"
                                            >
                                                <Share2 size={16}/>
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(e, lead.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition shadow-sm border border-transparent hover:border-red-200"
                                                title="Delete"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODAL 1: LEAD DETAIL CONTAINER (Full View) */}
      {/* ================================================================= */}
      {detailModalOpen && leadDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-slate-900/5">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 flex justify-between items-start text-white shrink-0">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center font-bold text-2xl border border-white/10 shadow-inner">
                            {leadDetail.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{leadDetail.name}</h2>
                            <div className="flex items-center gap-3 mt-2 text-sm text-slate-300 font-medium">
                                <span className="bg-white/20 px-2 py-0.5 rounded text-white text-xs uppercase tracking-wide">{leadDetail.source}</span>
                                <span>•</span>
                                <span>ID: #{leadDetail.id}</span>
                                <span>•</span>
                                <span>{formatDate(leadDetail.created_at)}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setDetailModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white transition backdrop-blur-md"><X size={20}/></button>
                </div>
                
                {/* Scrollable Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Section 1: Contact */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                                <Users size={14}/> Contact Information
                            </h3>
                            <div className="space-y-5">
                                <div className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"><Mail size={18}/></div>
                                    <div>
                                        <div className="text-xs text-slate-400 uppercase font-bold">Email Address</div>
                                        <div className="font-medium text-slate-800 text-lg">{leadDetail.email}</div>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors"><Phone size={18}/></div>
                                    <div>
                                        <div className="text-xs text-slate-400 uppercase font-bold">Phone Number</div>
                                        <div className="font-medium text-slate-800 text-lg">{leadDetail.phone}</div>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"><Briefcase size={18}/></div>
                                    <div>
                                        <div className="text-xs text-slate-400 uppercase font-bold">Company / Org</div>
                                        <div className="font-medium text-slate-800 text-lg">{leadDetail.company || 'Not Provided'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Requirements */}
                        <div className="space-y-6">
                             <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                                <Layers size={14}/> Project Requirements
                             </h3>
                             <div className="space-y-5">
                                
                                {/* Core Service */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Layers size={18}/></div>
                                    <div>
                                        <div className="text-xs text-slate-400 uppercase font-bold">Core Service</div>
                                        <span className="inline-block mt-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-bold border border-indigo-200">
                                            {leadDetail.service || 'General Inquiry'}
                                        </span>
                                    </div>
                                </div>

                                {/* Sub Services */}
                                {leadDetail.sub_services && (
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><CheckSquare size={18}/></div>
                                        <div>
                                            <div className="text-xs text-slate-400 uppercase font-bold">Specific Services</div>
                                            <p className="font-medium text-slate-700 text-sm mt-1 leading-relaxed">
                                                {leadDetail.sub_services}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Timeline */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500"><Clock size={18}/></div>
                                    <div>
                                        <div className="text-xs text-slate-400 uppercase font-bold">Timeline</div>
                                        <div className="font-medium text-slate-700">{leadDetail.timeline || 'Flexible / Not Specified'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Message Box (Full Width) */}
                        <div className="md:col-span-2 mt-4">
                             <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MessageCircle size={14}/> Full Message
                             </h3>
                             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap shadow-inner relative">
                                <div className="absolute top-4 right-4 opacity-10"><MessageCircle size={40}/></div>
                                {leadDetail.message || "No additional message provided by the lead."}
                             </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-between items-center shrink-0">
                    <button onClick={() => setDetailModalOpen(false)} className="text-slate-500 font-bold hover:text-slate-800 text-sm px-4">
                        Close Details
                    </button>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => { setDetailModalOpen(false); handleDelete({ stopPropagation: ()=>{} }, leadDetail.id); }} 
                            className="bg-white border border-red-200 text-red-500 px-5 py-3 rounded-xl font-bold hover:bg-red-50 transition flex items-center gap-2"
                        >
                            <Trash2 size={18}/> Delete
                        </button>
                        <button 
                            onClick={() => { setDetailModalOpen(false); handleOpenShareModal({ stopPropagation: ()=>{} }, leadDetail); }} 
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5"
                        >
                            <Share2 size={18}/> Share Lead
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: INDIVIDUAL / MULTI-RECIPIENT SHARE */}
      {/* ================================================================= */}
      {shareModalOpen && selectedLeadForShare && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden border border-slate-100">
                
                {/* Header */}
                <div className="bg-white p-5 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Share Lead Details</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Send full context to your team or clients</p>
                    </div>
                    <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"><X size={18}/></button>
                </div>

                {/* Platform Tabs */}
                <div className="grid grid-cols-2 border-b border-slate-100">
                    <button 
                        onClick={() => setShareType('whatsapp')} 
                        className={`py-4 text-sm font-bold flex items-center justify-center gap-2 transition border-b-2 ${
                            shareType === 'whatsapp' 
                            ? 'text-green-600 border-green-500 bg-green-50/50' 
                            : 'text-slate-500 border-transparent hover:bg-slate-50'
                        }`}
                    >
                        <MessageCircle size={18}/> WhatsApp
                    </button>
                    <button 
                        onClick={() => setShareType('email')} 
                        className={`py-4 text-sm font-bold flex items-center justify-center gap-2 transition border-b-2 ${
                            shareType === 'email' 
                            ? 'text-indigo-600 border-indigo-500 bg-indigo-50/50' 
                            : 'text-slate-500 border-transparent hover:bg-slate-50'
                        }`}
                    >
                        <Mail size={18}/> Email
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50">
                    
                    {/* 1. Generated Results (Success State) */}
                    {generatedSingleLinks.length > 0 && (
                        <div className="mb-6 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm animate-in fade-in">
                            <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2 text-sm">
                                <CheckCircle2 size={16} className="text-emerald-500"/> Generated Links ({generatedSingleLinks.length})
                            </h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {generatedSingleLinks.map((link, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 text-sm group hover:border-emerald-300 transition">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                {idx + 1}
                                            </div>
                                            <span className="font-medium text-slate-700 truncate">{link.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { copyToClipboard(link.url); addToast("Link copied!") }} className="text-slate-400 hover:text-emerald-600 p-1.5 rounded hover:bg-emerald-100" title="Copy Link"><Copy size={14}/></button>
                                            <a href={link.url} target="_blank" rel="noreferrer" className="text-emerald-600 font-bold hover:underline flex items-center gap-1 bg-white px-2 py-1 rounded border border-emerald-200 shadow-sm hover:shadow">
                                                Open <ExternalLink size={12}/>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setGeneratedSingleLinks([])} className="text-xs text-slate-500 mt-3 hover:text-indigo-600 font-medium flex items-center gap-1">
                                <ChevronRight size={12}/> Send to more people
                            </button>
                        </div>
                    )}

                    {/* 2. Selection Form */}
                    {generatedSingleLinks.length === 0 && (
                        <>
                            {/* History Chips */}
                            {shareRecipients.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><History size={14}/> Recent Recipients</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {shareRecipients.map((prev, idx) => (
                                            <button 
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    if (selectedHistoryRecipients.includes(idx)) setSelectedHistoryRecipients(p => p.filter(i => i !== idx));
                                                    else setSelectedHistoryRecipients(p => [...p, idx]);
                                                }}
                                                className={`text-xs px-3 py-2 rounded-lg border transition font-medium flex items-center gap-2 shadow-sm ${
                                                    selectedHistoryRecipients.includes(idx) 
                                                    ? 'bg-slate-800 text-white border-slate-800 ring-2 ring-offset-2 ring-slate-300' 
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                                }`}
                                            >
                                                {prev.recipient_name}
                                                {selectedHistoryRecipients.includes(idx) && <Check size={12} className="text-emerald-400"/>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Manual Entry */}
                            <form onSubmit={handleSingleShareSubmit} className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                    <span className="text-xs font-bold text-slate-400 uppercase">Or Add New</span>
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Recipient Name</label>
                                        <input 
                                            className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-slate-50 focus:bg-white" 
                                            placeholder="e.g. Sales Team Lead" 
                                            value={newRecipient.name} 
                                            onChange={e => setNewRecipient({...newRecipient, name: e.target.value})}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                                            {shareType === 'whatsapp' ? 'WhatsApp Number' : 'Email Address'}
                                        </label>
                                        {shareType === 'whatsapp' ? (
                                            <div className="relative">
                                                <Phone size={16} className="absolute left-3 top-3 text-slate-400"/>
                                                <input 
                                                    className="w-full pl-9 border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-slate-50 focus:bg-white" 
                                                    placeholder="+1 234 567 8900" 
                                                    value={newRecipient.phone} 
                                                    onChange={e => setNewRecipient({...newRecipient, phone: e.target.value})}
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <Mail size={16} className="absolute left-3 top-3 text-slate-400"/>
                                                <input 
                                                    className="w-full pl-9 border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-slate-50 focus:bg-white" 
                                                    placeholder="recipient@example.com" 
                                                    type="email"
                                                    value={newRecipient.email} 
                                                    onChange={e => setNewRecipient({...newRecipient, email: e.target.value})}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={shareLoading} 
                                    className={`w-full py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 mt-4 text-white shadow-lg transition transform active:scale-[0.98] ${
                                        shareType === 'whatsapp' 
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:to-green-700 shadow-green-200' 
                                        : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:to-indigo-700 shadow-indigo-200'
                                    }`}
                                >
                                    {shareLoading ? <Loader2 className="animate-spin" size={18}/> : <Share2 size={18}/>} 
                                    <span>Generate Share Link</span>
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: BULK EXPORT / SHARE (Auto-Attach) */}
      {/* ================================================================= */}
      {bulkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100">
                
                <button onClick={() => setBulkModalOpen(false)} className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition z-10 text-slate-500"><X size={20}/></button>

                <div className="p-8 text-center animate-in slide-in-from-bottom-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                        <FileSpreadsheet size={32}/>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Export & Share</h2>
                    <p className="text-slate-500 text-sm mt-2 mb-8 px-4">
                        You are about to export <span className="font-bold text-slate-900">{selectedLeads.length} leads</span>. 
                        The CSV file will download automatically.
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                        <button 
                            onClick={() => executeBulkShare('whatsapp')} 
                            className="flex items-center justify-center gap-3 p-4 rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300 font-bold transition group relative overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-green-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                            <MessageCircle size={22} className="group-hover:scale-110 transition-transform"/> 
                            Share via WhatsApp
                        </button>
                        <button 
                            onClick={() => executeBulkShare('email')} 
                            className="flex items-center justify-center gap-3 p-4 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 font-bold transition group relative overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-indigo-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                            <Mail size={22} className="group-hover:scale-110 transition-transform"/> 
                            Share via Email
                        </button>
                        <div className="relative py-2 flex items-center">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">Or</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>
                        <button 
                            onClick={() => { downloadCSV(); addToast("File downloaded successfully!"); }} 
                            className="flex items-center justify-center gap-3 p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-bold transition group shadow-sm"
                        >
                            <Download size={18}/> Download File Only
                        </button>
                    </div>
                    
                    <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 text-center leading-relaxed">
                        <p className="font-bold text-slate-600 mb-1 flex items-center justify-center gap-1"><AlertCircle size={12}/> Important</p>
                        <p>Browsers cannot attach files to WhatsApp or Email automatically for security reasons. Please <strong>drag and drop</strong> the downloaded file when the app opens.</p>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}
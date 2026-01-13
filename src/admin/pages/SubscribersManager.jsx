import React, { useEffect, useState } from 'react';
import * as API from '../../api';
import { 
  Loader2, Trash2, Search, Download, Mail, Calendar, Users, 
  FileText, Plus, Save, Send, X, CheckSquare, Square, Edit2
} from 'lucide-react';

export default function SubscribersManager() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'templates'
  
  // --- SUBSCRIBER STATE ---
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);

  // --- TEMPLATE STATE ---
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null); // null = list, {} = new, {id..} = edit

  // --- EMAIL COMPOSER MODAL STATE ---
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', body: '', templateId: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subRes, tempRes] = await Promise.all([
        API.getSubscribers(),
        API.getEmailTemplates()
      ]);
      setSubscribers(subRes.data);
      setTemplates(tempRes.data);
    } catch (err) {
      console.error("Failed to load data", err);
    }
    setLoading(false);
  };

  // ==========================
  //  SUBSCRIBER LOGIC
  // ==========================
  
  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm("Remove this subscriber?")) return;
    try {
      await API.deleteSubscriber(id);
      setSubscribers(prev => prev.filter(s => s.id !== id));
      setSelectedSubscribers(prev => prev.filter(sid => sid !== id));
    } catch (err) { alert("Failed to delete."); }
  };

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
        setSelectedSubscribers([]);
    } else {
        setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedSubscribers.includes(id)) {
        setSelectedSubscribers(prev => prev.filter(sid => sid !== id));
    } else {
        setSelectedSubscribers(prev => [...prev, id]);
    }
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    if (subscribers.length === 0) return alert("No subscribers to export.");
    const headers = ["ID", "Email Address", "Subscribed Date"];
    const rows = filteredSubscribers.map(s => [s.id, `"${s.email}"`, `"${new Date(s.subscribed_at).toLocaleString()}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================
  //  TEMPLATE LOGIC
  // ==========================

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    const formData = {
        name: e.target.name.value,
        subject: e.target.subject.value,
        body: e.target.body.value
    };

    try {
        if (editingTemplate.id) {
            await API.updateEmailTemplate(editingTemplate.id, formData);
        } else {
            await API.createEmailTemplate(formData);
        }
        alert("Template Saved!");
        setEditingTemplate(null);
        loadData(); // Refresh templates
    } catch (err) {
        alert("Failed to save template.");
    }
  };

  const handleDeleteTemplate = async (id) => {
      if(!window.confirm("Delete this template?")) return;
      await API.deleteEmailTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // ==========================
  //  SEND EMAIL LOGIC
  // ==========================

  const openEmailModal = () => {
      if(selectedSubscribers.length === 0) return alert("Please select at least one subscriber.");
      setEmailData({ subject: '', body: '', templateId: '' });
      setEmailModalOpen(true);
  };

  const handleTemplateSelect = (e) => {
      const templateId = e.target.value;
      if (!templateId) return;
      
      const template = templates.find(t => t.id === parseInt(templateId));
      if (template) {
          setEmailData({ 
              ...emailData, 
              templateId, 
              subject: template.subject, 
              body: template.body 
          });
      }
  };

  const handleSendEmail = async () => {
      if(!emailData.subject || !emailData.body) return alert("Subject and Body are required.");
      setSending(true);

      const recipients = subscribers
        .filter(s => selectedSubscribers.includes(s.id))
        .map(s => s.email);

      try {
          await API.sendBulkEmail({
              recipients,
              subject: emailData.subject,
              body: emailData.body
          });
          alert(`Email sent successfully to ${recipients.length} subscribers!`);
          setEmailModalOpen(false);
          setSelectedSubscribers([]);
      } catch (err) {
          console.error(err);
          alert("Failed to send emails. Check console.");
      }
      setSending(false);
  };


  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40}/></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 pb-10 animate-in fade-in duration-500">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Email Marketing</h1>
          <p className="text-slate-500 mt-1">Manage subscribers and send email campaigns.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full sm:w-fit">
            <button 
                onClick={() => setActiveTab('list')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'list' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <Users size={16}/> Subscribers
            </button>
            <button 
                onClick={() => setActiveTab('templates')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'templates' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <FileText size={16}/> Templates
            </button>
        </div>
      </div>

      {/* ======================= TAB 1: SUBSCRIBERS LIST ======================= */}
      {activeTab === 'list' && (
        <div className="space-y-4">
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
                    <input 
                        type="text" 
                        placeholder="Search subscribers..." 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    {selectedSubscribers.length > 0 && (
                        <button 
                            onClick={openEmailModal}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition animate-in zoom-in"
                        >
                            <Send size={18}/> Send Email ({selectedSubscribers.length})
                        </button>
                    )}
                    <button 
                        onClick={handleExport}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-sm"
                    >
                        <Download size={18}/> Export CSV
                    </button>
                    <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center">
                        Total: {subscribers.length}
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-bold text-slate-500">
                    <tr>
                        <th className="p-5 w-10">
                            <button onClick={toggleSelectAll}>
                                {selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0 
                                    ? <CheckSquare className="text-blue-600" size={20}/> 
                                    : <Square className="text-slate-300" size={20}/>
                                }
                            </button>
                        </th>
                        <th className="p-5">Email Address</th>
                        <th className="p-5">Subscribed Date</th>
                        <th className="p-5 text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {filteredSubscribers.map((sub) => (
                        <tr key={sub.id} className={`hover:bg-blue-50/50 transition ${selectedSubscribers.includes(sub.id) ? 'bg-blue-50' : ''}`}>
                        <td className="p-5">
                            <button onClick={() => toggleSelectOne(sub.id)}>
                                {selectedSubscribers.includes(sub.id) 
                                    ? <CheckSquare className="text-blue-600" size={20}/> 
                                    : <Square className="text-slate-300" size={20}/>
                                }
                            </button>
                        </td>
                        <td className="p-5 font-medium text-slate-700">{sub.email}</td>
                        <td className="p-5 text-slate-500">
                            {new Date(sub.subscribed_at).toLocaleDateString()}
                        </td>
                        <td className="p-5 text-right">
                            <button onClick={() => handleDeleteSubscriber(sub.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                        </td>
                        </tr>
                    ))}
                    {filteredSubscribers.length === 0 && (
                        <tr><td colSpan="4" className="p-10 text-center text-slate-400">No subscribers found.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
                {filteredSubscribers.map((sub) => (
                    <div key={sub.id} className={`bg-white p-4 rounded-xl shadow-sm border ${selectedSubscribers.includes(sub.id) ? 'border-blue-300 bg-blue-50' : 'border-slate-200'}`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <button onClick={() => toggleSelectOne(sub.id)}>
                                    {selectedSubscribers.includes(sub.id) 
                                        ? <CheckSquare className="text-blue-600" size={20}/> 
                                        : <Square className="text-slate-300" size={20}/>
                                    }
                                </button>
                                <div>
                                    <p className="font-medium text-slate-800">{sub.email}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                        <Calendar size={12}/> {new Date(sub.subscribed_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => handleDeleteSubscriber(sub.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}
                {filteredSubscribers.length === 0 && (
                    <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-200 text-center text-slate-400">
                        No subscribers found.
                    </div>
                )}
            </div>
        </div>
      )}

      {/* ======================= TAB 2: TEMPLATE MANAGER ======================= */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* List of Templates */}
            <div className="lg:col-span-1 space-y-4">
                <button 
                    onClick={() => setEditingTemplate({})} 
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-blue-500 hover:text-blue-600 transition flex justify-center items-center gap-2"
                >
                    <Plus size={20}/> Create New Template
                </button>

                <div className="space-y-3">
                    {templates.map(temp => (
                        <div key={temp.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                            <h3 className="font-bold text-slate-800">{temp.name}</h3>
                            <p className="text-xs text-slate-500 mt-1 truncate">{temp.subject}</p>
                            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                                <button onClick={() => setEditingTemplate(temp)} className="text-xs flex items-center gap-1 text-blue-600 font-bold"><Edit2 size={14}/> Edit</button>
                                <button onClick={() => handleDeleteTemplate(temp.id)} className="text-xs flex items-center gap-1 text-red-500 font-bold"><Trash2 size={14}/> Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="lg:col-span-2">
                {editingTemplate ? (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl">{editingTemplate.id ? 'Edit Template' : 'New Template'}</h3>
                            <button onClick={() => setEditingTemplate(null)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                        </div>
                        <form onSubmit={handleSaveTemplate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Template Name</label>
                                <input name="name" required defaultValue={editingTemplate.name} className="w-full border p-2 rounded-lg" placeholder="e.g. Welcome Email"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Subject</label>
                                <input name="subject" required defaultValue={editingTemplate.subject} className="w-full border p-2 rounded-lg" placeholder="Subject line..."/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Body</label>
                                <textarea name="body" required rows="10" defaultValue={editingTemplate.body} className="w-full border p-2 rounded-lg font-mono text-sm" placeholder="Write your email content here..."/>
                            </div>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700">
                                <Save size={18}/> Save Template
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 border border-dashed border-slate-300 rounded-2xl min-h-[300px]">
                        Select a template to edit or create new.
                    </div>
                )}
            </div>
        </div>
      )}

      {/* ======================= EMAIL COMPOSER MODAL ======================= */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2"><Mail size={20}/> Compose Email</h3>
                    <button onClick={() => setEmailModalOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><X size={18}/></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-bold border border-blue-100">
                        Sending to {selectedSubscribers.length} recipients
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Load Template (Optional)</label>
                        <select onChange={handleTemplateSelect} className="w-full border p-2 rounded-lg bg-white text-sm">
                            <option value="">-- Select a Template --</option>
                            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                        <input 
                            value={emailData.subject}
                            onChange={e => setEmailData({...emailData, subject: e.target.value})}
                            className="w-full border p-2 rounded-lg font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message Body</label>
                        <textarea 
                            rows="8"
                            value={emailData.body}
                            onChange={e => setEmailData({...emailData, body: e.target.value})}
                            className="w-full border p-2 rounded-lg font-mono text-sm"
                        ></textarea>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 border-t flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button onClick={() => setEmailModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg w-full sm:w-auto">Cancel</button>
                    <button 
                        onClick={handleSendEmail} 
                        disabled={sending}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 w-full sm:w-auto"
                    >
                        {sending ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>} Send Now
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}
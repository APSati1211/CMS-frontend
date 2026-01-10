import React, { useEffect, useState } from 'react';
import * as API from '../../../api'; // Check path
import { 
  Save, Plus, Trash2, Edit2, Loader2, X, 
  MapPin, Layout, MessageSquare, Ticket, Mail 
} from 'lucide-react';

export default function ContactManager() {
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('layout'); // 'layout', 'addresses', 'messages', 'tickets'
  
  // List Editing
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
        // Fetch Page Data (Content + Addresses)
        const pageRes = await API.getContactPageData();
        setData(pageRes.data);

        // Fetch Messages & Tickets (Admin Only)
        // Ensure you have these GET functions in your API file pointing to 'contact/messages/' and 'contact/tickets/'
        const msgRes = await API.fetchList('contact/messages'); 
        const tktRes = await API.fetchList('contact/tickets');
        
        setMessages(msgRes.data);
        setTickets(tktRes.data);

    } catch (err) {
        console.error("Failed to load contact data", err);
    }
    setLoading(false);
  };

  // --- 1. SINGLETON UPDATE (Hero & Map) ---
  const handlePageUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Note: Adjust endpoint prefix if needed based on your API setup
    const id = data?.content?.id || 1;
    
    try {
        await API.updateItem('contact/contact-content', id, formData);
        alert("Page Content Updated!");
        loadAll();
    } catch (err) {
        alert("Failed to update.");
        console.error(err);
    }
  };

  // --- 2. GENERIC LIST HANDLERS ---
  const handleDelete = async (resource, id) => {
    if(!window.confirm("Delete this item?")) return;
    try {
        await API.deleteItem(`contact/${resource}`, id);
        loadAll();
    } catch (err) { alert("Failed to delete."); }
  };

  const handleSaveItem = async (e, resource) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const endpoint = `contact/${resource}`;
        if (editingItem) {
            await API.updateItem(endpoint, editingItem.id, formData);
        } else {
            await API.createItem(endpoint, formData);
        }
        setEditingItem(null);
        setIsAddingNew(false);
        loadAll();
    } catch (err) {
        alert("Failed to save item.");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  const tabs = [
      { id: 'layout', label: 'Page Layout', icon: Layout },
      { id: 'addresses', label: 'Addresses', icon: MapPin },
      { id: 'messages', label: 'Messages', icon: Mail },
      { id: 'tickets', label: 'Support Tickets', icon: Ticket },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Contact Manager</h1>
        <div className="flex flex-wrap gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setEditingItem(null); setIsAddingNew(false); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <tab.icon size={16}/> {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* --- TAB 1: PAGE LAYOUT --- */}
      {activeTab === 'layout' && (
        <form onSubmit={handlePageUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-in fade-in">
            <h3 className="font-bold text-lg border-b pb-2">Hero & Content</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hero Title</label>
                    <input name="hero_title" defaultValue={data?.content?.hero_title} className="w-full border p-3 rounded-xl font-bold"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hero Subtitle</label>
                    <input name="hero_subtitle" defaultValue={data?.content?.hero_subtitle} className="w-full border p-3 rounded-xl"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Form Title</label>
                    <input name="form_title" defaultValue={data?.content?.form_title} className="w-full border p-3 rounded-xl"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Support Title</label>
                    <input name="support_title" defaultValue={data?.content?.support_title} className="w-full border p-3 rounded-xl"/>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Google Maps Embed URL (src only)</label>
                    <input name="map_embed_url" defaultValue={data?.content?.map_embed_url} className="w-full border p-3 rounded-xl font-mono text-sm text-blue-600"/>
                    <p className="text-xs text-slate-400 mt-1">Paste only the URL inside the src="" of the iframe.</p>
                </div>
            </div>
            <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2">
                    <Save size={18}/> Save Changes
                </button>
            </div>
        </form>
      )}

      {/* --- TAB 2: ADDRESSES --- */}
      {activeTab === 'addresses' && (
        <ListManager
            title="Office Locations"
            items={data?.addresses}
            resource="office-addresses"
            fields={[
                { name: 'title', label: 'Office Name', type: 'text' },
                { name: 'address', label: 'Full Address', type: 'textarea' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'phone', label: 'Phone', type: 'text' },
                { name: 'order', label: 'Sort Order', type: 'number' },
            ]}
            {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
        />
      )}

      {/* --- TAB 3: MESSAGES (READ ONLY) --- */}
      {activeTab === 'messages' && (
        <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-bold">Inbox ({messages.length})</h2>
            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Message</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {messages.map(msg => (
                            <tr key={msg.id} className="hover:bg-slate-50">
                                <td className="p-4 font-medium">{msg.name}</td>
                                <td className="p-4 text-blue-600">{msg.email}</td>
                                <td className="p-4 max-w-xs truncate" title={msg.message}>{msg.message}</td>
                                <td className="p-4 text-slate-400">{new Date(msg.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete('messages', msg.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                        {messages.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">No messages yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- TAB 4: TICKETS --- */}
      {activeTab === 'tickets' && (
        <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-bold">Support Tickets ({tickets.length})</h2>
            <div className="grid gap-4">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 text-xs rounded font-bold uppercase ${
                                    ticket.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                }`}>{ticket.priority}</span>
                                <span className="font-bold text-lg">{ticket.subject}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{ticket.description}</p>
                            <div className="text-xs text-slate-400 flex gap-3">
                                <span>From: {ticket.name} ({ticket.email})</span>
                                <span>Date: {new Date(ticket.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                            <select 
                                defaultValue={ticket.status} 
                                onChange={(e) => {
                                    // Direct update call for status change
                                    const formData = new FormData();
                                    formData.append('status', e.target.value);
                                    API.updateItem('contact/tickets', ticket.id, formData).then(() => {
                                        alert("Status Updated");
                                        loadAll();
                                    });
                                }}
                                className={`border rounded px-2 py-1 text-xs font-bold uppercase ${
                                    ticket.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' : 
                                    ticket.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600'
                                }`}
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                            <button onClick={() => handleDelete('tickets', ticket.id)} className="text-red-400 hover:text-red-600 text-xs flex gap-1 items-center">
                                <Trash2 size={12}/> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

    </div>
  );
}

// --- REUSABLE LIST MANAGER ---
const ListManager = ({ title, items, resource, fields, onDelete, onSave, editingItem, setEditingItem, isAddingNew, setIsAddingNew }) => {
    const safeItems = Array.isArray(items) ? items : [];

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {title} <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{safeItems.length}</span>
                </h2>
                {!isAddingNew && !editingItem && (
                    <button onClick={() => setIsAddingNew(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md">
                        <Plus size={18}/> Add New
                    </button>
                )}
            </div>

            {/* FORM */}
            {(isAddingNew || editingItem) && (
                <form onSubmit={(e) => onSave(e, resource)} className="bg-slate-50 p-6 rounded-2xl border border-blue-200 shadow-sm mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-blue-700">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                        <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }}><X size={20}/></button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {fields.map(field => (
                            <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea name={field.name} defaultValue={editingItem?.[field.name] || ''} className="w-full border p-3 rounded-xl bg-white" rows="3" required/>
                                ) : (
                                    <input type={field.type} name={field.name} defaultValue={editingItem?.[field.name] || ''} className="w-full border p-3 rounded-xl bg-white" required={field.type !== 'file'} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }} className="px-4 py-2 text-slate-600">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Save Item</button>
                    </div>
                </form>
            )}

            {/* LIST */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeItems.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingItem(item); setIsAddingNew(false); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-blue-600 p-1.5 hover:bg-blue-50 rounded"><Edit2 size={14}/></button>
                            <button onClick={() => onDelete(resource, item.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                        </div>
                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{item.address}</p>
                        <div className="mt-3 text-xs font-medium text-blue-600">
                            <p>{item.email}</p>
                            <p>{item.phone}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
import React, { useEffect, useState } from 'react';
import * as API from '../../../api'; 
import { 
  Save, Plus, Trash2, Edit2, Loader2, X, 
  Layout, FileText, Download, Link as LinkIcon
} from 'lucide-react';

export default function ResourcesManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('layout'); // 'layout', 'cases', 'downloads', 'links'
  
  // List Editing
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
        const res = await API.getResourcesPageData();
        setData(res.data);
    } catch (err) {
        console.error("Failed to load resources data", err);
    }
    setLoading(false);
  };

  // --- 1. SINGLETON UPDATE (Hero & Titles) ---
  const handleSingletonUpdate = async (e, type) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const endpoint = type === 'hero' ? 'resources_page/resources-hero' : 'resources_page/section-titles';
    const id = type === 'hero' ? (data?.hero?.id || 1) : (data?.titles?.id || 1);

    try {
        await API.updateItem(endpoint, id, formData);
        alert(`${type.toUpperCase()} Updated!`);
        loadAll();
    } catch (err) {
        alert("Failed to update.");
        console.error(err);
    }
  };

  // --- 2. LIST HANDLERS ---
  const handleDelete = async (resource, id) => {
    if(!window.confirm("Delete this item?")) return;
    try {
        await API.deleteItem(resource, id);
        loadAll();
    } catch (err) { alert("Failed to delete."); }
  };

  const handleSaveItem = async (e, resource) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        if (editingItem) {
            await API.updateItem(resource, editingItem.id, formData);
        } else {
            await API.createItem(resource, formData);
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
      { id: 'cases', label: 'Case Studies', icon: FileText },
      { id: 'downloads', label: 'Downloads', icon: Download },
      { id: 'links', label: 'Useful Links', icon: LinkIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Resources Manager</h1>
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

      {/* --- TAB 1: LAYOUT --- */}
      {activeTab === 'layout' && (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in">
            {/* HERO FORM */}
            <form onSubmit={(e) => handleSingletonUpdate(e, 'hero')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 h-fit">
                <h3 className="font-bold text-lg border-b pb-2">Hero Section</h3>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Page Title</label>
                    <input name="title" defaultValue={data?.hero?.title} className="w-full border p-3 rounded-xl font-bold"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                    <textarea name="subtitle" defaultValue={data?.hero?.subtitle} className="w-full border p-3 rounded-xl" rows="3"/>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex justify-center gap-2">
                    <Save size={18}/> Save Hero
                </button>
            </form>

            {/* SECTION TITLES FORM */}
            <form onSubmit={(e) => handleSingletonUpdate(e, 'titles')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 h-fit">
                <h3 className="font-bold text-lg border-b pb-2">Section Headings</h3>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Case Studies Title</label>
                    <input name="case_studies_title" defaultValue={data?.titles?.case_studies_title} className="w-full border p-3 rounded-xl"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Downloads Title</label>
                    <input name="downloads_title" defaultValue={data?.titles?.downloads_title} className="w-full border p-3 rounded-xl"/>
                </div>
                <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-700 flex justify-center gap-2">
                    <Save size={18}/> Save Titles
                </button>
            </form>
        </div>
      )}

      {/* --- TAB 2: CASE STUDIES --- */}
      {activeTab === 'cases' && (
        <ListManager
            title="Case Studies"
            items={data?.case_studies}
            resource="resources_page/case-studies"
            fields={[
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'client_name', label: 'Client Name', type: 'text' },
                { name: 'result_stat', label: 'Result Stat (e.g. 300% ROI)', type: 'text' },
                { name: 'summary', label: 'Summary', type: 'textarea' },
                { name: 'pdf_file', label: 'Upload PDF', type: 'file' },
                { name: 'order', label: 'Order', type: 'number' },
            ]}
            {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
        />
      )}

      {/* --- TAB 3: DOWNLOADS --- */}
      {activeTab === 'downloads' && (
        <ListManager
            title="Downloadable Resources"
            items={data?.downloads}
            resource="resources_page/downloads"
            fields={[
                { name: 'title', label: 'Resource Title', type: 'text' },
                { name: 'resource_type', label: 'Type', type: 'select', options: ['E-Book', 'Whitepaper', 'Guide', 'Report', 'Presentation', 'Dataset'] },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'file', label: 'Upload File', type: 'file' },
                { name: 'external_link', label: 'Or External Link URL', type: 'text' },
                { name: 'order', label: 'Order', type: 'number' },
            ]}
            {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
        />
      )}

      {/* --- TAB 4: USEFUL LINKS --- */}
      {activeTab === 'links' && (
        <ListManager
            title="Useful Links"
            items={data?.useful_links}
            resource="resources_page/useful-links"
            fields={[
                { name: 'title', label: 'Link Title', type: 'text' },
                { name: 'url', label: 'URL', type: 'text' },
                { name: 'order', label: 'Order', type: 'number' },
            ]}
            {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
        />
      )}

    </div>
  );
}

// --- REUSABLE LIST COMPONENT ---
const ListManager = ({ title, items, resource, fields, onDelete, onSave, editingItem, setEditingItem, isAddingNew, setIsAddingNew }) => {
    const safeItems = Array.isArray(items) ? items : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {title} 
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{safeItems.length}</span>
                </h2>
                {!isAddingNew && !editingItem && (
                    <button onClick={() => setIsAddingNew(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md">
                        <Plus size={18}/> Add New
                    </button>
                )}
            </div>

            {/* FORM */}
            {(isAddingNew || editingItem) && (
                <form onSubmit={(e) => onSave(e, resource)} className="bg-slate-50 p-6 rounded-2xl border border-blue-200 shadow-sm mb-8 animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                        <h3 className="font-bold text-blue-700 flex items-center gap-2">
                            {editingItem ? <Edit2 size={18}/> : <Plus size={18}/>} 
                            {editingItem ? 'Edit Item' : 'Add New Item'}
                        </h3>
                        <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }} className="bg-white p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition"><X size={20}/></button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {fields.map(field => (
                            <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{field.label}</label>
                                
                                {field.type === 'textarea' ? (
                                    <textarea name={field.name} defaultValue={editingItem?.[field.name] || ''} className="w-full border p-3 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none" rows="3" required/>
                                ) : field.type === 'file' ? (
                                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl border">
                                        {editingItem?.[field.name] && <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">File Exists</span>}
                                        <input type="file" name={field.name} className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-0"/>
                                    </div>
                                ) : field.type === 'select' ? (
                                    <select name={field.name} defaultValue={editingItem?.[field.name] || ''} className="w-full border p-3 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input type={field.type} name={field.name} defaultValue={editingItem?.[field.name] || ''} className="w-full border p-3 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none" required={field.type !== 'file'} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md transition transform active:scale-95">
                            <Save size={18}/> Save Item
                        </button>
                    </div>
                </form>
            )}

            {/* LIST */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeItems.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition group relative flex flex-col justify-between">
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg backdrop-blur-sm shadow-sm border">
                            <button onClick={() => { setEditingItem(item); setIsAddingNew(false); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-blue-600 p-1.5 hover:bg-blue-50 rounded transition"><Edit2 size={14}/></button>
                            <button onClick={() => onDelete(resource, item.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded transition"><Trash2 size={14}/></button>
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-slate-800 line-clamp-1 text-sm mb-1">{item.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mb-2">{item.resource_type || item.client_name || "Link"}</p>
                            
                            <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg">
                                {item.description || item.summary || item.url || "No details"}
                            </p>
                        </div>
                        
                        {(item.file || item.pdf_file) && (
                            <div className="mt-3 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block w-fit">
                                📎 Document Attached
                            </div>
                        )}
                    </div>
                ))}
                {safeItems.length === 0 && !isAddingNew && (
                    <div className="col-span-full text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        No items found. Click "Add New" to create one.
                    </div>
                )}
            </div>
        </div>
    );
};
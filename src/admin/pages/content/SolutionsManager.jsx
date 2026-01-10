import React, { useEffect, useState } from 'react';
import * as API from '../../../api'; 
import { 
  Save, Plus, Trash2, Edit2, Loader2, X, 
  Layout, Layers, Image as ImageIcon 
} from 'lucide-react';

export default function SolutionsManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('layout'); // 'layout', 'list'
  
  // List Editing
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
        const res = await API.getSolutionsPageData();
        setData(res.data);
    } catch (err) {
        console.error("Failed to load solutions data", err);
    }
    setLoading(false);
  };

  // --- 1. HERO UPDATE ---
  const handlePageUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Use the specific endpoint for content updates
    const id = data?.content?.id || 1;
    try {
        // We use the generic updateItem pointing to the namespaced URL
        await API.updateItem('stakeholders/solutions-content', id, formData);
        alert("Page Content Updated!");
        loadAll();
    } catch (err) {
        alert("Failed to update.");
        console.error(err);
    }
  };

  // --- 2. LIST HANDLERS ---
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this solution?")) return;
    try {
        await API.deleteItem('stakeholders/stakeholders', id);
        loadAll();
    } catch (err) { alert("Failed to delete."); }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const resource = 'stakeholders/stakeholders';
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
      { id: 'list', label: 'Solutions List', icon: Layers },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Solutions Manager</h1>
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
        <form onSubmit={handlePageUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-in fade-in">
            <h3 className="font-bold text-lg border-b pb-2">Hero Section</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hero Title</label>
                    <input name="hero_title" defaultValue={data?.content?.hero_title} className="w-full border p-3 rounded-xl font-bold"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hero Subtitle</label>
                    <textarea name="hero_subtitle" defaultValue={data?.content?.hero_subtitle} className="w-full border p-3 rounded-xl" rows="3"/>
                </div>
            </div>

            <h3 className="font-bold text-lg border-b pb-2 mt-4">Bottom CTA</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CTA Title</label>
                    <input name="cta_title" defaultValue={data?.content?.cta_title} className="w-full border p-3 rounded-xl"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CTA Text</label>
                    <textarea name="cta_text" defaultValue={data?.content?.cta_text} className="w-full border p-3 rounded-xl" rows="2"/>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2">
                    <Save size={18}/> Save Changes
                </button>
            </div>
        </form>
      )}

      {/* --- TAB 2: SOLUTIONS LIST --- */}
      {activeTab === 'list' && (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    All Solutions <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{data?.solutions?.length}</span>
                </h2>
                {!isAddingNew && !editingItem && (
                    <button onClick={() => setIsAddingNew(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md">
                        <Plus size={18}/> Add Solution
                    </button>
                )}
            </div>

            {/* FORM */}
            {(isAddingNew || editingItem) && (
                <form onSubmit={handleSaveItem} className="bg-slate-50 p-6 rounded-2xl border border-blue-200 shadow-sm mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-blue-700">{editingItem ? 'Edit Solution' : 'Add New Solution'}</h3>
                        <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }}><X size={20}/></button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                            <input name="title" defaultValue={editingItem?.title} required className="w-full border p-3 rounded-xl bg-white"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Icon Name (Lucide)</label>
                            <input name="icon_name" defaultValue={editingItem?.icon_name || 'Layers'} className="w-full border p-3 rounded-xl bg-white"/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Short Description</label>
                            <textarea name="description" defaultValue={editingItem?.description} className="w-full border p-3 rounded-xl bg-white" rows="2" required/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Long Description (For Detail Page)</label>
                            <textarea name="long_description" defaultValue={editingItem?.long_description} className="w-full border p-3 rounded-xl bg-white" rows="5"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Display Order</label>
                            <input name="order" type="number" defaultValue={editingItem?.order || 0} className="w-full border p-3 rounded-xl bg-white"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image (Optional)</label>
                            <input name="image" type="file" className="w-full border p-2 rounded-xl bg-white text-sm"/>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }} className="px-4 py-2 text-slate-600">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Save</button>
                    </div>
                </form>
            )}

            {/* LIST */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.solutions?.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:shadow-md transition">
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-lg border">
                            <button onClick={() => { setEditingItem(item); setIsAddingNew(false); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-blue-600 p-1.5 hover:bg-blue-50 rounded"><Edit2 size={14}/></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold border">
                                {item.icon_name ? <span className="text-xs">{item.icon_name.slice(0,2)}</span> : 'Ly'}
                            </div>
                            <h4 className="font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                        </div>
                        
                        <p className="text-xs text-slate-500 line-clamp-3 mb-2">{item.description}</p>
                        <div className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded w-fit">
                            Slug: {item.slug}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

    </div>
  );
}
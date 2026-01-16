import React, { useEffect, useState } from 'react';
import * as API from '../../../api'; 
import { 
  Save, Plus, Trash2, Edit2, Loader2, X, Layout, 
  Monitor, CheckCircle2 
} from 'lucide-react';

export default function LeadSystemManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('main'); 
  
  // List State
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await API.getLeadSystemData();
      setData(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleMainContentUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        // Use ID 1 if not present in response
        const id = data?.hero?.id || 1; 
        await API.updateLeadSystemData(id, formData);
        alert("Page Content Updated Successfully!");
        loadData();
    } catch (err) { alert("Failed to update content."); }
  };

  const handleDeleteFeature = async (id) => {
    if(!window.confirm("Delete this feature?")) return;
    try { await API.deleteItem('ls-features', id); loadData(); } catch (err) { alert("Failed to delete."); }
  };

  const handleSaveFeature = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        if (editingItem) await API.updateItem('ls-features', editingItem.id, formData);
        else await API.createItem('ls-features', formData);
        setEditingItem(null); setIsAddingNew(false); loadData();
    } catch (err) { alert("Failed to save feature."); }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  const tabs = [
      { id: 'main', label: 'Main Content', icon: Layout },
      { id: 'features', label: 'Features', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 p-4 md:p-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Lead System Manager</h1>
        <div className="flex overflow-x-auto w-full md:w-auto gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm hide-scrollbar">
            {tabs.map(tab => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setEditingItem(null); setIsAddingNew(false); }} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <tab.icon size={16}/> {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* --- TAB 1: MAIN CONTENT --- */}
      {activeTab === 'main' && (
        <form onSubmit={handleMainContentUpdate} className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8 animate-in fade-in">
            
            {/* HERO SECTION */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2"><Layout size={18} className="text-blue-500"/> Hero Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Page Title</label>
                        <textarea name="hero_title" defaultValue={data?.hero?.title} className="w-full border p-3 rounded-xl font-bold text-slate-800 focus:border-blue-500 outline-none" rows="2" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                        <textarea name="hero_subtitle" defaultValue={data?.hero?.subtitle} className="w-full border p-3 rounded-xl text-slate-600 focus:border-blue-500 outline-none" rows="3" />
                    </div>
                </div>
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2"><Monitor size={18} className="text-purple-500"/> Dashboard Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image Alt / Placeholder Text</label>
                        <input name="dashboard_placeholder" defaultValue={data?.dashboard?.placeholder_text} className="w-full border p-3 rounded-xl focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upload New Image</label>
                        <input type="file" name="dashboard_image" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition"/>
                        {data?.dashboard?.image && (
                            <div className="mt-3 p-2 bg-slate-50 rounded-xl border w-fit">
                                <img src={data.dashboard.image} alt="Preview" className="h-20 rounded-lg object-cover"/>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CTA SECTION */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500"/> Bottom CTA</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CTA Title</label>
                        <input name="cta_title" defaultValue={data?.cta?.title} className="w-full border p-3 rounded-xl font-bold focus:border-emerald-500 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CTA Description</label>
                        <textarea name="cta_text" defaultValue={data?.cta?.text} className="w-full border p-3 rounded-xl focus:border-emerald-500 outline-none" rows="2"/>
                    </div>
                </div>
            </div>

            <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition flex justify-center items-center gap-2">
                <Save size={20}/> Save All Changes
            </button>
        </form>
      )}

      {/* --- TAB 2: FEATURES LIST --- */}
      {activeTab === 'features' && (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    System Features <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs border">{data?.features?.length || 0}</span>
                </h2>
                {!isAddingNew && !editingItem && (
                    <button onClick={() => setIsAddingNew(true)} className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md">
                        <Plus size={18}/> Add Feature
                    </button>
                )}
            </div>

            {/* EDITOR FORM */}
            {(isAddingNew || editingItem) && (
                <form onSubmit={handleSaveFeature} className="bg-slate-50 p-5 rounded-2xl border border-blue-200 shadow-sm mb-6 relative">
                    <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    <h3 className="font-bold text-blue-700 mb-4">{editingItem ? 'Edit Feature' : 'New Feature'}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Feature Title</label>
                            <input name="title" defaultValue={editingItem?.title} className="w-full border p-3 rounded-xl bg-white focus:border-blue-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Icon Name (Lucide)</label>
                            <input name="icon_name" defaultValue={editingItem?.icon_name || 'CheckCircle'} className="w-full border p-3 rounded-xl bg-white focus:border-blue-500 outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                            <textarea name="description" defaultValue={editingItem?.description} className="w-full border p-3 rounded-xl bg-white focus:border-blue-500 outline-none" rows="2" required />
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }} className="px-4 py-2 text-slate-600 font-bold bg-white border rounded-lg hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-sm">Save Feature</button>
                    </div>
                </form>
            )}

            {/* LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.features?.map(feature => (
                    <div key={feature.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100 font-bold">
                                    {feature.icon_name ? feature.icon_name.slice(0,2) : <CheckCircle2 size={20}/>}
                                </div>
                            </div>
                            <h4 className="font-bold text-slate-800 text-lg mb-1">{feature.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{feature.description}</p>
                        </div>
                        
                        <div className="flex gap-2 mt-5 pt-4 border-t border-slate-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingItem(feature); setIsAddingNew(false); window.scrollTo({top:0, behavior:'smooth'}); }} className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 flex items-center justify-center gap-1">
                                <Edit2 size={14}/> Edit
                            </button>
                            <button onClick={() => handleDeleteFeature(feature.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-100 flex items-center justify-center gap-1">
                                <Trash2 size={14}/> Delete
                            </button>
                        </div>
                    </div>
                ))}
                
                {data?.features?.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                        <p>No features added yet. Click "Add Feature" to start.</p>
                    </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
}
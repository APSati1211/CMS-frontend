import React, { useEffect, useState } from 'react';
import * as API from '../../../api';
import { Loader2, Plus, Trash2, Layout, Save, X } from 'lucide-react';

export default function LeadSystemManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await API.getLeadSystemData();
      setData(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        await API.updateLeadSystemData(data?.hero?.id, formData);
        alert("Saved!");
        setEditing(false);
        loadData();
    } catch (err) { alert("Error saving"); }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Delete feature?")) return;
      await API.deleteItem('ls-features', id);
      loadData();
  }

  if(loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600"/></div>;

  const hero = data?.hero || {};
  const dashboard = data?.dashboard || {};
  const cta = data?.cta || {};
  const features = data?.features || [];

  return (
    <div className="space-y-8 pb-10">
        {/* HERO & CONTENT */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-bold text-slate-800">Product Page Content</h2>
                <button onClick={() => setEditing(!editing)} className="text-blue-600 font-bold hover:underline">
                    {editing ? <X size={20}/> : "Edit Content"}
                </button>
            </div>
            {editing ? (
                <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6 animate-in fade-in">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hero Section</label>
                        <input name="hero_title" defaultValue={hero.title} className="w-full border p-2 rounded-lg mb-2"/>
                        <textarea name="hero_subtitle" defaultValue={hero.subtitle} className="w-full border p-2 rounded-lg"/>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dashboard Preview</label>
                        <input name="dashboard_placeholder" defaultValue={dashboard.placeholder_text} className="w-full border p-2 rounded-lg mb-2" placeholder="Image Alt Text"/>
                        <input type="file" name="dashboard_image" className="block w-full text-sm text-slate-500 file:bg-blue-50 file:border-0 file:rounded-full file:px-4 file:py-1 file:text-blue-700"/>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CTA Section</label>
                        <input name="cta_title" defaultValue={cta.title} className="w-full border p-2 rounded-lg mb-2"/>
                        <textarea name="cta_text" defaultValue={cta.text} className="w-full border p-2 rounded-lg"/>
                    </div>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-fit flex items-center gap-2">
                        <Save size={16}/> Save Changes
                    </button>
                </form>
            ) : (
                <div className="text-sm space-y-3 text-slate-600">
                    <p><span className="font-bold text-slate-800">Hero:</span> {hero.title}</p>
                    {dashboard.image && (
                        <div className="mt-2">
                            <span className="font-bold text-slate-800 block mb-1">Dashboard Image:</span>
                            <img src={dashboard.image} alt="Dashboard" className="h-24 rounded border bg-slate-50"/>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* FEATURES LIST */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold mb-4 flex justify-between items-center text-slate-800">
                System Features 
                <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={20}/></button>
            </h3>
            <div className="space-y-2">
                {features.map(f => (
                    <div key={f.id} className="flex justify-between items-center border-b last:border-0 py-3 px-2 hover:bg-slate-50 transition rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <Layout size={20}/>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-800">{f.title}</p>
                                <p className="text-xs text-slate-500">{f.description}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(f.id)} className="text-slate-300 hover:text-red-500 p-2">
                            <Trash2 size={18}/>
                        </button>
                    </div>
                ))}
                {features.length === 0 && <p className="text-sm text-slate-400">No features added.</p>}
            </div>
        </div>
    </div>
  );
}
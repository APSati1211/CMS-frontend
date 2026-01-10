import React, { useEffect, useState } from 'react';
import * as API from '../../../api'; // Verify path
import { 
  Save, Loader2, FileText, Plus, Trash2, Edit2, X, List as ListIcon 
} from 'lucide-react';

export default function LegalManager() {
  const [activeTab, setActiveTab] = useState('privacy-policy');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Section Editing State
  const [editingSection, setEditingSection] = useState(null);
  const [isAddingSection, setIsAddingSection] = useState(false);

  const tabs = [
    { id: 'privacy-policy', label: 'Privacy Policy' },
    { id: 'terms-and-conditions', label: 'Terms & Conditions' },
    { id: 'refund-policy', label: 'Refund Policy' },
  ];

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const loadData = async (slug) => {
    setLoading(true);
    setEditingSection(null);
    setIsAddingSection(false);
    try {
      const res = await API.getLegalPageData(slug);
      setData(res.data);
    } catch (err) {
      console.error("Error loading legal page", err);
      setData(null);
    }
    setLoading(false);
  };

  // --- 1. UPDATE PAGE METADATA (Title, Intro) ---
  const handlePageUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.updateLegalPageData(activeTab, {
        title: data.title,
        description: data.description
      });
      alert("Page Details Updated!");
    } catch (err) {
      alert("Failed to update page.");
    }
  };

  // --- 2. SECTION HANDLERS ---
  const handleSaveSection = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Attach the parent page ID
    formData.append('legal_page', data.id);

    try {
      if (editingSection) {
        await API.updateItem('legal/sections', editingSection.id, formData);
      } else {
        await API.createItem('legal/sections', formData);
      }
      setEditingSection(null);
      setIsAddingSection(false);
      loadData(activeTab); // Refresh
    } catch (err) {
      alert("Failed to save section.");
      console.error(err);
    }
  };

  const handleDeleteSection = async (id) => {
    if(!window.confirm("Delete this section?")) return;
    try {
      await API.deleteItem('legal/sections', id);
      loadData(activeTab);
    } catch (err) { alert("Failed to delete."); }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600"/></div>;
  if (!data) return <div className="p-10 text-center text-red-500">Page not found in database. Run seed script.</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Legal Content Manager</h1>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* --- PART 1: GENERAL PAGE SETTINGS --- */}
      <form onSubmit={handlePageUpdate} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2"><FileText size={18}/> Page Overview</h3>
              <button type="submit" className="text-blue-600 font-bold text-sm hover:underline">Save Overview</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Page Title</label>
                  <input 
                    value={data.title} 
                    onChange={e => setData({...data, title: e.target.value})} 
                    className="w-full border p-2 rounded-lg font-bold"
                  />
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Intro Description</label>
                  <input 
                    value={data.description} 
                    onChange={e => setData({...data, description: e.target.value})} 
                    className="w-full border p-2 rounded-lg"
                  />
              </div>
          </div>
      </form>

      {/* --- PART 2: SECTIONS MANAGER --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2"><ListIcon size={18}/> Content Sections</h3>
              {!isAddingSection && !editingSection && (
                  <button onClick={() => setIsAddingSection(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
                      <Plus size={16}/> Add Section
                  </button>
              )}
          </div>

          {/* EDITOR FORM */}
          {(isAddingSection || editingSection) && (
              <form onSubmit={handleSaveSection} className="bg-slate-50 p-6 rounded-xl border border-blue-200 animate-in fade-in">
                  <div className="flex justify-between mb-4">
                      <h4 className="font-bold text-blue-700">{editingSection ? 'Edit Section' : 'New Section'}</h4>
                      <button type="button" onClick={() => { setEditingSection(null); setIsAddingSection(false); }}><X size={20}/></button>
                  </div>
                  <div className="space-y-4">
                      <div className="grid md:grid-cols-4 gap-4">
                          <div className="md:col-span-3">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Heading</label>
                              <input name="heading" defaultValue={editingSection?.heading} className="w-full border p-2 rounded-lg" required />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Order</label>
                              <input name="order" type="number" defaultValue={editingSection?.order || 0} className="w-full border p-2 rounded-lg" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Content</label>
                          <textarea name="content" defaultValue={editingSection?.content} rows="6" className="w-full border p-3 rounded-lg" required />
                      </div>
                      <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => { setEditingSection(null); setIsAddingSection(false); }} className="px-4 py-2 text-slate-600">Cancel</button>
                          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Save Section</button>
                      </div>
                  </div>
              </form>
          )}

          {/* LIST OF SECTIONS */}
          <div className="space-y-3">
              {data.sections?.length === 0 && <p className="text-center text-slate-400 py-8">No sections found. Add one above.</p>}
              
              {data.sections?.map((section) => (
                  <div key={section.id} className="border p-4 rounded-xl hover:bg-slate-50 transition group flex justify-between items-start gap-4">
                      <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">#{section.order}</span>
                              <h4 className="font-bold text-slate-800">{section.heading}</h4>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2">{section.content}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingSection(section); setIsAddingSection(false); }} className="p-2 text-blue-600 bg-white border rounded hover:bg-blue-50"><Edit2 size={16}/></button>
                          <button onClick={() => handleDeleteSection(section.id)} className="p-2 text-red-600 bg-white border rounded hover:bg-red-50"><Trash2 size={16}/></button>
                      </div>
                  </div>
              ))}
          </div>
      </div>

    </div>
  );
}
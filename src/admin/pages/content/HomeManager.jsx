import React, { useEffect, useState } from 'react';
// FIX 1: Updated path from '../../api' to '../../../api'
import * as API from '../../../api'; 
// FIX 2: Added 'X' to the imports explicitly
import { 
  Save, Plus, Trash2, Edit2, Loader2, Image as ImageIcon, 
  X, Check, ChevronDown, ChevronUp 
} from 'lucide-react';

export default function HomeManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('main'); // main, stats, process, features, testimonials, clients, faq
  const [editingItem, setEditingItem] = useState(null); // For lists (id or null)
  const [isAddingNew, setIsAddingNew] = useState(false); // For lists

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await API.getHomeData();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load home data", err);
    }
    setLoading(false);
  };

  // --- 1. SINGLETON CONTENT UPDATE (Hero, Titles, CTA) ---
  const handleMainContentUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        await API.updateHomeData(data.content.id, formData);
        alert("Main Content Updated Successfully!");
        loadData();
    } catch (err) {
        alert("Failed to update content.");
    }
  };

  // --- 2. GENERIC LIST HANDLERS ---
  const handleDelete = async (resource, id) => {
    if(!window.confirm("Are you sure you want to delete this item?")) return;
    try {
        await API.deleteItem(resource, id);
        loadData();
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
        loadData();
    } catch (err) {
        alert("Failed to save item.");
        console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  const tabs = [
      { id: 'main', label: 'Main Content' },
      { id: 'stats', label: 'Stats' },
      { id: 'process', label: 'Process' },
      { id: 'features', label: 'Features' },
      { id: 'clients', label: 'Clients' },
      { id: 'testimonials', label: 'Testimonials' },
      { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Home Page Manager</h1>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline text-sm">View Live Site</a>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
        {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setEditingItem(null); setIsAddingNew(false); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                {tab.label}
            </button>
        ))}
      </div>

      {/* --- TAB CONTENT --- */}

      {/* 1. MAIN CONTENT (Hero, Titles, CTA) */}
      {activeTab === 'main' && (
        <form onSubmit={handleMainContentUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8 animate-in fade-in">
            
            {/* Hero Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Hero Section</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hero Title</label>
                        <textarea name="hero_title" defaultValue={data.content.hero_title} className="w-full border p-3 rounded-xl font-bold text-lg" rows="2" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hero Subtitle</label>
                        <textarea name="hero_subtitle" defaultValue={data.content.hero_subtitle} className="w-full border p-3 rounded-xl text-slate-600" rows="3" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CTA Button Text</label>
                        <input name="hero_cta_text" defaultValue={data.content.hero_cta_text} className="w-full border p-3 rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hero Image</label>
                        <div className="flex items-center gap-4">
                            {data.content.hero_image && <img src={data.content.hero_image} alt="Hero" className="h-16 w-16 object-cover rounded-lg border"/>}
                            <input type="file" name="hero_image" className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Titles */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Section Headings</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {['process_title', 'process_subtitle', 'features_title', 'clients_title', 'reviews_title', 'faq_title'].map(field => (
                        <div key={field}>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{field.replace('_', ' ')}</label>
                            <input name={field} defaultValue={data.content[field]} className="w-full border p-3 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Bottom Call to Action</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CTA Title</label>
                        <input name="cta_title" defaultValue={data.content.cta_title} className="w-full border p-3 rounded-xl font-bold" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CTA Description</label>
                        <textarea name="cta_text" defaultValue={data.content.cta_text} className="w-full border p-3 rounded-xl" rows="2"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Button Text</label>
                        <input name="cta_btn_text" defaultValue={data.content.cta_btn_text} className="w-full border p-3 rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Button Link</label>
                        <input name="cta_btn_link" defaultValue={data.content.cta_btn_link} className="w-full border p-3 rounded-xl" />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition flex items-center gap-2">
                    <Save size={20}/> Save All Changes
                </button>
            </div>
        </form>
      )}

      {/* 2. STATS MANAGER */}
      {activeTab === 'stats' && (
        <ListManager 
            title="Statistics" 
            items={data.stats} 
            resource="stats" 
            fields={[
                { name: 'value', label: 'Value (e.g. 500+)', type: 'text' },
                { name: 'label', label: 'Label (e.g. Happy Clients)', type: 'text' },
                { name: 'icon', label: 'Icon Name (Lucide)', type: 'text' },
            ]}
            onDelete={handleDelete}
            onSave={handleSaveItem}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            isAddingNew={isAddingNew}
            setIsAddingNew={setIsAddingNew}
        />
      )}

      {/* 3. PROCESS STEPS */}
      {activeTab === 'process' && (
        <ListManager 
            title="Process Steps" 
            items={data.process} 
            resource="process-steps" 
            fields={[
                { name: 'step_number', label: 'Step #', type: 'number' },
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'icon_name', label: 'Icon Name', type: 'text' },
            ]}
            onDelete={handleDelete}
            onSave={handleSaveItem}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            isAddingNew={isAddingNew}
            setIsAddingNew={setIsAddingNew}
        />
      )}

      {/* 4. FEATURES */}
      {activeTab === 'features' && (
        <ListManager 
            title="Key Features" 
            items={data.features} 
            resource="features" 
            fields={[
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'icon', label: 'Icon Name', type: 'text' },
            ]}
            onDelete={handleDelete}
            onSave={handleSaveItem}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            isAddingNew={isAddingNew}
            setIsAddingNew={setIsAddingNew}
        />
      )}

      {/* 5. CLIENTS */}
      {activeTab === 'clients' && (
        <ListManager 
            title="Trusted Clients" 
            items={data.clients} 
            resource="clients" 
            fields={[
                { name: 'name', label: 'Client Name', type: 'text' },
                { name: 'logo', label: 'Logo', type: 'file' },
            ]}
            onDelete={handleDelete}
            onSave={handleSaveItem}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            isAddingNew={isAddingNew}
            setIsAddingNew={setIsAddingNew}
        />
      )}

      {/* 6. TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <ListManager 
            title="Testimonials" 
            items={data.testimonials} 
            resource="testimonials" 
            fields={[
                { name: 'author_name', label: 'Author Name', type: 'text' },
                { name: 'role', label: 'Role/Position', type: 'text' },
                { name: 'company', label: 'Company', type: 'text' },
                { name: 'quote', label: 'Quote', type: 'textarea' },
                { name: 'image', label: 'Author Photo', type: 'file' },
            ]}
            onDelete={handleDelete}
            onSave={handleSaveItem}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            isAddingNew={isAddingNew}
            setIsAddingNew={setIsAddingNew}
        />
      )}

      {/* 7. FAQ */}
      {activeTab === 'faq' && (
        <ListManager 
            title="Frequently Asked Questions" 
            items={data.faq} 
            resource="faqs" 
            fields={[
                { name: 'question', label: 'Question', type: 'text' },
                { name: 'answer', label: 'Answer', type: 'textarea' },
                { name: 'order', label: 'Order', type: 'number' },
            ]}
            onDelete={handleDelete}
            onSave={handleSaveItem}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            isAddingNew={isAddingNew}
            setIsAddingNew={setIsAddingNew}
        />
      )}

    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: GENERIC LIST MANAGER
// ============================================================================
const ListManager = ({ title, items, resource, fields, onDelete, onSave, editingItem, setEditingItem, isAddingNew, setIsAddingNew }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-800">{title} ({items.length})</h2>
                {!isAddingNew && !editingItem && (
                    <button onClick={() => setIsAddingNew(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-md">
                        <Plus size={18}/> Add New
                    </button>
                )}
            </div>

            {/* EDIT / ADD FORM */}
            {(isAddingNew || editingItem) && (
                <form onSubmit={(e) => onSave(e, resource)} className="bg-slate-50 p-6 rounded-2xl border border-blue-200 shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                        <h3 className="font-bold text-blue-700">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                        <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }} className="bg-white p-1 rounded-full hover:bg-slate-200"><X size={20}/></button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {fields.map(field => (
                            <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea name={field.name} defaultValue={editingItem?.[field.name]} className="w-full border p-3 rounded-xl" rows="3" required/>
                                ) : field.type === 'file' ? (
                                    <div className="flex items-center gap-4">
                                        {editingItem?.[field.name] && <img src={editingItem[field.name]} alt="preview" className="h-12 w-12 rounded-lg object-cover border"/>}
                                        <input type="file" name={field.name} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                    </div>
                                ) : (
                                    <input type={field.type} name={field.name} defaultValue={editingItem?.[field.name]} className="w-full border p-3 rounded-xl" required={field.type !== 'file'} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md">
                            <Save size={18}/> Save Item
                        </button>
                    </div>
                </form>
            )}

            {/* LIST DISPLAY */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition group relative">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-lg shadow-sm border">
                            <button onClick={() => { setEditingItem(item); setIsAddingNew(false); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-blue-600 p-1 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                            <button onClick={() => onDelete(resource, item.id)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                        </div>

                        {/* Rendering logic based on item type */}
                        <div className="pr-12">
                            {/* Image if available */}
                            {(item.image || item.logo) && (
                                <img src={item.image || item.logo} alt="img" className="h-10 w-10 object-contain mb-3 rounded-lg bg-slate-50 border"/>
                            )}
                            
                            {/* Title / Name */}
                            <h4 className="font-bold text-slate-800 line-clamp-1">{item.title || item.name || item.author_name || item.question || item.value}</h4>
                            
                            {/* Subtitle / Description */}
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {item.description || item.quote || item.answer || item.label || item.role}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
import React, { useEffect, useState } from 'react';
import * as API from '../../../api'; 
import { 
  Save, Plus, Trash2, Edit2, Loader2, X, Image as ImageIcon,
  Layout, Briefcase, List as ListIcon, MessageSquare, HelpCircle
} from 'lucide-react';

export default function ServicesManager() {
  const [pageData, setPageData] = useState(null);
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('layout'); // 'layout', 'services', 'features', 'content'
  
  // List Editing
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
        const [pData, sList] = await Promise.all([API.getServicesPageData(), API.getServices()]);
        setPageData(pData.data);
        setServicesList(sList.data);
    } catch (err) {
        console.error("Failed to load services data", err);
    }
    setLoading(false);
  };

  // --- 1. UPDATE HERO & CTA (Singleton) ---
  const handlePageUpdate = async (e, section) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const endpoint = section === 'hero' ? 'services_page/service-hero' : 'services_page/service-cta';
    const id = section === 'hero' ? (pageData?.hero?.id || 1) : (pageData?.cta?.id || 1);

    try {
        await API.updateItem(endpoint, id, formData);
        alert(`${section.toUpperCase()} Updated!`);
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
      { id: 'services', label: 'Service List', icon: Briefcase },
      { id: 'features', label: 'Features & Process', icon: ListIcon },
      { id: 'content', label: 'Reviews & FAQ', icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Services Page Manager</h1>
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

      {/* --- TAB 1: LAYOUT (Hero & CTA) --- */}
      {activeTab === 'layout' && (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in">
            {/* HERO FORM */}
            <form onSubmit={(e) => handlePageUpdate(e, 'hero')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 h-fit">
                <h3 className="font-bold text-lg border-b pb-2">Hero Section</h3>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                    <input name="title" defaultValue={pageData?.hero?.title} className="w-full border p-3 rounded-xl font-bold"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                    <textarea name="subtitle" defaultValue={pageData?.hero?.subtitle} className="w-full border p-3 rounded-xl" rows="3"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CTA Button Text</label>
                    <input name="cta_text" defaultValue={pageData?.hero?.cta_text} className="w-full border p-3 rounded-xl"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hero Image</label>
                    <div className="flex items-center gap-4">
                        {pageData?.hero?.image && <img src={pageData.hero.image} alt="Hero" className="h-16 w-16 object-cover rounded-lg border"/>}
                        <input type="file" name="image" className="text-sm text-slate-500"/>
                    </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex justify-center gap-2">
                    <Save size={18}/> Save Hero
                </button>
            </form>

            {/* CTA FORM */}
            <form onSubmit={(e) => handlePageUpdate(e, 'cta')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 h-fit">
                <h3 className="font-bold text-lg border-b pb-2">Bottom Call to Action</h3>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                    <input name="title" defaultValue={pageData?.cta?.title} className="w-full border p-3 rounded-xl font-bold"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                    <textarea name="text" defaultValue={pageData?.cta?.text} className="w-full border p-3 rounded-xl" rows="3"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Button Text</label>
                    <input name="button_text" defaultValue={pageData?.cta?.button_text} className="w-full border p-3 rounded-xl"/>
                </div>
                <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-700 flex justify-center gap-2">
                    <Save size={18}/> Save CTA
                </button>
            </form>
        </div>
      )}

      {/* --- TAB 2: SERVICE LIST (CMS) --- */}
      {activeTab === 'services' && (
        <ListManager
            title="All Services"
            items={servicesList}
            resource="services" 
            fields={[
                { name: 'title', label: 'Service Name', type: 'text' },
                { name: 'short_description', label: 'Short Description', type: 'textarea' },
                { name: 'image', label: 'Service Image', type: 'file' }, // <-- ADDED THIS
                { name: 'icon', label: 'Icon Name (Lucide)', type: 'text' },
                { name: 'slug', label: 'URL Slug (auto-generated if empty)', type: 'text' },
                { name: 'order', label: 'Sort Order', type: 'number' },
            ]}
            {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
        />
      )}

      {/* --- TAB 3: FEATURES & PROCESS --- */}
      {activeTab === 'features' && (
        <div className="space-y-12 animate-in fade-in">
            <ListManager
                title="Service Process Steps"
                items={pageData?.process}
                resource="services_page/service-process"
                fields={[
                    { name: 'step_number', label: 'Step # (e.g. 01)', type: 'text' },
                    { name: 'title', label: 'Step Title', type: 'text' },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'icon_name', label: 'Icon Name', type: 'text' },
                    { name: 'order', label: 'Sort Order', type: 'number' },
                ]}
                {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
            />
            
            <ListManager
                title="Key Features"
                items={pageData?.features}
                resource="services_page/service-features"
                fields={[
                    { name: 'title', label: 'Feature Title', type: 'text' },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'icon_name', label: 'Icon Name', type: 'text' },
                    { name: 'order', label: 'Sort Order', type: 'number' },
                ]}
                {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
            />
        </div>
      )}

      {/* --- TAB 4: REVIEWS & FAQ --- */}
      {activeTab === 'content' && (
        <div className="space-y-12 animate-in fade-in">
            <ListManager
                title="Client Testimonials"
                items={pageData?.testimonials}
                resource="services_page/service-testimonials"
                fields={[
                    { name: 'name', label: 'Client Name', type: 'text' },
                    { name: 'role', label: 'Role / Company', type: 'text' },
                    { name: 'quote', label: 'Quote', type: 'textarea' },
                    { name: 'image', label: 'Photo', type: 'file' },
                    { name: 'order', label: 'Sort Order', type: 'number' },
                ]}
                {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
            />

            <ListManager
                title="Frequently Asked Questions"
                items={pageData?.faq}
                resource="services_page/service-faq"
                fields={[
                    { name: 'question', label: 'Question', type: 'text' },
                    { name: 'answer', label: 'Answer', type: 'textarea' },
                    { name: 'order', label: 'Sort Order', type: 'number' },
                ]}
                {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
            />
        </div>
      )}

    </div>
  );
}

// --- REUSABLE LIST MANAGER ---
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
                                        {editingItem?.[field.name] && <img src={editingItem[field.name]} alt="preview" className="h-10 w-10 rounded-lg object-cover border"/>}
                                        <input type="file" name={field.name} className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-0"/>
                                    </div>
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
                        
                        <div className="flex gap-4 items-start mb-3">
                            {/* Updated Logic: Show Image > Show Icon > Show Initial */}
                            {(item.image || item.icon) ? (
                                <img src={item.image || item.icon} alt="img" className="h-12 w-12 object-cover rounded-lg border bg-slate-50 flex-shrink-0" onError={(e) => {e.target.style.display='none'}}/>
                            ) : (
                                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold flex-shrink-0">
                                    {(item.title || item.name || item.question || '?').charAt(0)}
                                </div>
                            )}
                            <div className="min-w-0">
                                <h4 className="font-bold text-slate-800 line-clamp-1 text-sm">{item.title || item.name || item.question}</h4>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.subtitle || item.role || item.step_number || item.icon_name}</p>
                            </div>
                        </div>
                        
                        <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg">
                            {item.description || item.quote || item.answer || item.short_description || "No description"}
                        </p>
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
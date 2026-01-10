import React, { useEffect, useState } from 'react';
import * as API from '../../../api'; // Adjust path as needed
import { 
  Save, Plus, Trash2, Edit2, Loader2, X, 
  Briefcase, Heart, MessageSquare, FileText, CheckCircle, XCircle 
} from 'lucide-react';

export default function CareersManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('main'); // 'main', 'jobs', 'benefits', 'testimonials'
  
  // List Editing State
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await API.getCareersPageData();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load careers data", err);
    }
    setLoading(false);
  };

  // --- 1. SINGLETON CONTENT UPDATE ---
  const handleMainContentUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const contentId = data?.content?.id || 1;
        await API.updateCareersPageData(contentId, formData);
        alert("Page Content Updated!");
        loadData();
    } catch (err) {
        alert("Failed to update content.");
        console.error(err);
    }
  };

  // --- 2. GENERIC LIST HANDLERS ---
  const handleDelete = async (resource, id) => {
    if(!window.confirm("Delete this item?")) return;
    try {
        // Assuming your createItem/deleteItem logic handles 'careers/' prefix if needed
        // If not, update API.deleteItem to handle app-specific prefixes
        await API.deleteItem(`careers/${resource}`, id); 
        loadData();
    } catch (err) { alert("Failed to delete."); }
  };

  const handleSaveItem = async (e, resource) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Handle Checkboxes manually if needed
    if (resource === 'jobs') {
        formData.set('is_active', formData.get('is_active') ? 'True' : 'False');
    }

    try {
        const endpoint = `careers/${resource}`;
        if (editingItem) {
            await API.updateItem(endpoint, editingItem.id, formData);
        } else {
            await API.createItem(endpoint, formData);
        }
        setEditingItem(null);
        setIsAddingNew(false);
        loadData();
    } catch (err) {
        alert("Failed to save item.");
        console.error(err);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;
  
  const content = data?.content || {}; 

  const tabs = [
      { id: 'main', label: 'Main Content', icon: FileText },
      { id: 'jobs', label: 'Job Openings', icon: Briefcase },
      { id: 'benefits', label: 'Benefits', icon: Heart },
      { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Careers Page Manager</h1>
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

      {/* --- TAB 1: MAIN CONTENT --- */}
      {activeTab === 'main' && (
        <form onSubmit={handleMainContentUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8 animate-in fade-in">
            
            {/* Hero Section */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Hero Section</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Hero Title</label>
                        <input name="hero_title" defaultValue={content.hero_title || ''} className="w-full border p-3 rounded-xl font-bold"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Hero Subtitle</label>
                        <textarea name="hero_subtitle" defaultValue={content.hero_subtitle || ''} className="w-full border p-3 rounded-xl" rows="2"/>
                    </div>
                </div>
            </div>

            {/* Culture Section */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Culture Section</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Culture Title</label>
                        <input name="culture_title" defaultValue={content.culture_title || ''} className="w-full border p-3 rounded-xl font-bold"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Culture Text</label>
                        <textarea name="culture_text" defaultValue={content.culture_text || ''} className="w-full border p-3 rounded-xl" rows="3"/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Culture Image</label>
                        <div className="flex items-center gap-4">
                            {content.culture_image && <img src={content.culture_image} alt="Culture" className="h-20 w-32 object-cover rounded-lg border bg-slate-50"/>}
                            <input type="file" name="culture_image" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Headings */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Section Headings</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Benefits Title</label>
                        <input name="benefits_title" defaultValue={content.benefits_title || ''} className="w-full border p-3 rounded-xl"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Benefits Subtitle</label>
                        <input name="benefits_subtitle" defaultValue={content.benefits_subtitle || ''} className="w-full border p-3 rounded-xl"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Openings Title</label>
                        <input name="openings_title" defaultValue={content.openings_title || ''} className="w-full border p-3 rounded-xl"/>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2 transform active:scale-95 transition">
                    <Save size={20}/> Save All Content
                </button>
            </div>
        </form>
      )}

      {/* --- TAB 2: JOB OPENINGS --- */}
      {activeTab === 'jobs' && (
        <ListManager
            title="Job Openings"
            items={data?.jobs}
            resource="jobs"
            fields={[
                { name: 'title', label: 'Job Title', type: 'text' },
                { name: 'department', label: 'Department', type: 'text' },
                { name: 'location', label: 'Location', type: 'text' },
                { name: 'type', label: 'Job Type (Full-Time, Contract, etc.)', type: 'select', options: ['Full-Time', 'Part-Time', 'Contract', 'Internship'] },
                { name: 'description', label: 'Job Description (HTML Supported)', type: 'textarea' },
                { name: 'is_active', label: 'Is Active?', type: 'checkbox' },
            ]}
            {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
        />
      )}

      {/* --- TAB 3: BENEFITS --- */}
      {activeTab === 'benefits' && (
        <ListManager
            title="Benefits & Perks"
            items={data?.benefits}
            resource="benefits"
            fields={[
                { name: 'title', label: 'Benefit Title', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'icon_name', label: 'Icon Name (Lucide)', type: 'text' },
                { name: 'order', label: 'Display Order', type: 'number' },
            ]}
            {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
        />
      )}

      {/* --- TAB 4: TESTIMONIALS --- */}
      {activeTab === 'testimonials' && (
        <ListManager
            title="Employee Testimonials"
            items={data?.testimonials}
            resource="testimonials"
            fields={[
                { name: 'name', label: 'Employee Name', type: 'text' },
                { name: 'role', label: 'Job Role', type: 'text' },
                { name: 'quote', label: 'Quote', type: 'textarea' },
                { name: 'image', label: 'Photo', type: 'file' },
                { name: 'order', label: 'Display Order', type: 'number' },
            ]}
            {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
        />
      )}

    </div>
  );
}

// --- REUSABLE LIST MANAGER COMPONENT ---
const ListManager = ({ title, items, resource, fields, onDelete, onSave, editingItem, setEditingItem, isAddingNew, setIsAddingNew }) => {
    // Ensure items is always an array
    const safeItems = Array.isArray(items) ? items : [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

            {/* EDIT/ADD FORM */}
            {(isAddingNew || editingItem) && (
                <form onSubmit={(e) => onSave(e, resource)} className="bg-slate-50 p-6 rounded-2xl border border-blue-200 shadow-sm mb-6 animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                        <h3 className="font-bold text-blue-700 flex items-center gap-2">
                            {editingItem ? <Edit2 size={18}/> : <Plus size={18}/>} 
                            {editingItem ? 'Edit Item' : 'Add New Item'}
                        </h3>
                        <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }} className="bg-white p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition"><X size={20}/></button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {fields.map(field => (
                            <div key={field.name} className={field.type === 'textarea' || field.name === 'description' ? 'md:col-span-2' : ''}>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{field.label}</label>
                                
                                {field.type === 'textarea' ? (
                                    <textarea name={field.name} defaultValue={editingItem?.[field.name] || ''} className="w-full border p-3 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none" rows="3" required/>
                                
                                ) : field.type === 'file' ? (
                                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl border">
                                        {editingItem?.[field.name] && <img src={editingItem[field.name]} alt="preview" className="h-10 w-10 rounded-lg object-cover border"/>}
                                        <input type="file" name={field.name} className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-0"/>
                                    </div>
                                
                                ) : field.type === 'select' ? (
                                    <select name={field.name} defaultValue={editingItem?.[field.name] || ''} className="w-full border p-3 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>

                                ) : field.type === 'checkbox' ? (
                                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border">
                                        <input type="checkbox" name={field.name} defaultChecked={editingItem?.[field.name]} className="w-5 h-5 text-blue-600"/>
                                        <span className="text-sm font-medium text-slate-700">Active</span>
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

            {/* LIST DISPLAY */}
            {safeItems.length === 0 && !isAddingNew ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-400 font-medium">No items found.</p>
                    <button onClick={() => setIsAddingNew(true)} className="text-blue-600 font-bold text-sm mt-2 hover:underline">Create the first one</button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {safeItems.map(item => (
                        <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition group relative flex flex-col justify-between">
                            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg backdrop-blur-sm shadow-sm border">
                                <button onClick={() => { setEditingItem(item); setIsAddingNew(false); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-blue-600 p-1.5 hover:bg-blue-50 rounded transition"><Edit2 size={14}/></button>
                                <button onClick={() => onDelete(resource, item.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded transition"><Trash2 size={14}/></button>
                            </div>
                            
                            <div className="flex gap-4 items-start mb-3">
                                {(item.image || item.logo) ? (
                                    <img src={item.image || item.logo} alt="img" className="h-12 w-12 object-cover rounded-lg border bg-slate-50 flex-shrink-0"/>
                                ) : (
                                    <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold flex-shrink-0">
                                        {(item.name || item.title || '?').charAt(0)}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <h4 className="font-bold text-slate-800 line-clamp-1 text-sm">{item.name || item.title}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.role || item.department || item.icon_name}</p>
                                    
                                    {/* Status Badge for Jobs */}
                                    {item.is_active !== undefined && (
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.is_active ? <CheckCircle size={10}/> : <XCircle size={10}/>}
                                            {item.is_active ? 'Active' : 'Closed'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Description Preview */}
                            <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg">
                                {item.description || item.quote || "No description"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
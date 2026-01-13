import React, { useEffect, useState } from 'react';
import * as API from '../../../api'; // Adjust path based on your project structure
import { 
  Save, Plus, Trash2, Edit2, Loader2, X, 
  Briefcase, Heart, MessageSquare, FileText, Settings, Users, 
  Download, FileText as FileIcon, CheckCircle, Share2, Mail, ExternalLink, Eye
} from 'lucide-react';

export default function CareersManager() {
  const [data, setData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('main'); 
  
  // List Editing State
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Sharing & Viewing State
  const [shareModal, setShareModal] = useState({ isOpen: false, type: null, id: null, title: '' });
  const [viewModal, setViewModal] = useState(null); // Holds the application object to view
  const [emailTo, setEmailTo] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // --- CONFIG: API BASE URL ---
  const APPLICATIONS_API_URL = "http://localhost:8000/api/applications";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Get Page Data
      const res = await API.getCareersPageData();
      setData(res.data);

      // 2. Get Applications List
      try {
         const appsRes = await API.fetchList('applications'); 
         setApplications(appsRes.data);
      } catch (e) { console.warn("Could not load applications", e); }

    } catch (err) {
      console.error("Failed to load careers data", err);
    }
    setLoading(false);
  };

  // --- SINGLETON CONTENT UPDATE ---
  const handleMainContentUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Explicitly handle checkboxes
    const checkboxFields = [
        'is_phone_required', 'is_linkedin_required', 
        'is_cover_letter_required', 'show_referral_field', 'is_referral_multiselect'
    ];
    checkboxFields.forEach(field => {
        if(e.target.elements[field]) {
            formData.set(field, e.target.elements[field].checked ? 'True' : 'False');
        }
    });

    try {
        const contentId = data?.content?.id || 1;
        await API.updateCareersPageData(contentId, formData);
        alert("Settings Updated!");
        loadData();
    } catch (err) {
        alert("Failed to update.");
        console.error(err);
    }
  };

  // --- DOWNLOAD HANDLERS ---
  const handleDownload = (type, id=null) => {
      if (type === 'csv_all') window.open(`${APPLICATIONS_API_URL}/export_csv/`);
      if (type === 'zip_resumes') window.open(`${APPLICATIONS_API_URL}/download_resumes/`);
      if (type === 'csv_single' && id) window.open(`${APPLICATIONS_API_URL}/${id}/download_details/`);
  };

  // --- SHARE HANDLERS ---
  const openShareModal = (type, id=null, title="Share") => {
      setShareModal({ isOpen: true, type, id, title });
      setEmailTo("");
  };

  const handleSendEmail = async (e) => {
      e.preventDefault();
      setSendingEmail(true);
      try {
          const response = await fetch(`${APPLICATIONS_API_URL}/share_via_email/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  email: emailTo,
                  type: shareModal.type,
                  id: shareModal.id
              })
          });
          const result = await response.json();
          if (response.ok) {
              alert("Email sent successfully!");
              setShareModal({ ...shareModal, isOpen: false });
          } else {
              alert("Error: " + (result.error || "Failed to send email"));
          }
      } catch (error) {
          console.error(error);
          alert("Network error: Failed to connect to server.");
      }
      setSendingEmail(false);
  };

  const handleWhatsAppShare = () => {
      if (shareModal.type.includes('csv_all') || shareModal.type.includes('zip')) {
          alert("Bulk files cannot be attached to WhatsApp Web links. Please use Email sharing for bulk data.");
          return;
      }
      
      const app = applications.find(a => a.id === shareModal.id);
      if (app) {
          const jobTitle = data?.jobs?.find(j => j.id === app.job)?.title || "Unknown Role";
          const text = `*New Job Application*\n\n*Name:* ${app.applicant_name}\n*Role:* ${jobTitle}\n*Email:* ${app.email}\n*Phone:* ${app.phone}\n*Resume Link:* ${app.resume_link || "Attached in Email"}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
  };

  // --- GENERIC LIST HANDLERS ---
  const handleDelete = async (resource, id) => {
    if(!window.confirm("Delete this item?")) return;
    try {
        await API.deleteItem(`${resource}`, id); 
        loadData();
    } catch (err) { alert("Failed to delete."); }
  };

  const handleSaveItem = async (e, resource) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (resource === 'jobs') {
        formData.set('is_active', e.target.elements['is_active'].checked ? 'True' : 'False');
    }
    try {
        const endpoint = `${resource}`;
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
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;
  
  const content = data?.content || {}; 

  const tabs = [
      { id: 'main', label: 'Main Content', icon: FileText },
      { id: 'form_setup', label: 'Edit Applications Form', icon: Settings },
      { id: 'applications', label: 'Applications', icon: Users },
      { id: 'jobs', label: 'Job Openings', icon: Briefcase },
      { id: 'benefits', label: 'Benefits', icon: Heart },
      { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Careers Page Manager</h1>
        <div className="flex flex-wrap gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setEditingItem(null); setIsAddingNew(false); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <tab.icon size={16}/> {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* --- TAB 1: MAIN CONTENT --- */}
      {activeTab === 'main' && (
        <form onSubmit={handleMainContentUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8 animate-in fade-in">
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Hero Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Hero Title</label>
                        <input name="hero_title" defaultValue={content.hero_title} className="w-full border p-3 rounded-xl font-bold"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Hero Subtitle</label>
                        <textarea name="hero_subtitle" defaultValue={content.hero_subtitle} className="w-full border p-3 rounded-xl" rows="2"/>
                    </div>
                </div>
            </div>
            {/* Culture Section */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Culture Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Culture Title</label>
                        <input name="culture_title" defaultValue={content.culture_title} className="w-full border p-3 rounded-xl font-bold"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Culture Text</label>
                        <textarea name="culture_text" defaultValue={content.culture_text} className="w-full border p-3 rounded-xl" rows="3"/>
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
            <div className="pt-4 border-t flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2">
                    <Save size={20}/> Save Content
                </button>
            </div>
        </form>
      )}

      {/* --- TAB 2: EDIT APPLICATIONS FORM --- */}
      {activeTab === 'form_setup' && (
        <form onSubmit={handleMainContentUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8 animate-in fade-in">
            {/* Field Labels */}
            <div>
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                    <Settings size={20}/> Form Labels
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {['form_name_label', 'form_email_label', 'form_phone_label', 'form_linkedin_label', 'form_resume_label', 'form_cover_letter_label'].map(field => (
                        <div key={field}>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1">{field.replace('form_', '').replace('_label', '')} Label</label>
                            <input name={field} defaultValue={content[field]} className="w-full border p-3 rounded-xl"/>
                        </div>
                    ))}
                </div>
            </div>
            {/* Validation */}
            <div>
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                    <CheckCircle size={20}/> Mandatory Fields
                </h3>
                <div className="flex flex-wrap gap-6">
                    {[
                        {key: 'is_phone_required', label: 'Phone Number'},
                        {key: 'is_linkedin_required', label: 'LinkedIn URL'},
                        {key: 'is_cover_letter_required', label: 'Cover Letter'}
                    ].map(item => (
                        <label key={item.key} className="flex items-center gap-3 p-4 border rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-blue-300 transition">
                            <input type="checkbox" name={item.key} defaultChecked={content[item.key]} className="w-5 h-5 text-blue-600 rounded"/>
                            <span className="font-bold text-slate-700">{item.label} Required</span>
                        </label>
                    ))}
                </div>
            </div>
            {/* Referral Source */}
            <div>
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                    <Users size={20}/> Referral Source Field
                </h3>
                <div className="space-y-4">
                    <label className="flex items-center gap-3">
                        <input type="checkbox" name="show_referral_field" defaultChecked={content.show_referral_field} className="w-5 h-5 text-blue-600 rounded"/>
                        <span className="font-bold text-slate-700">Show "How did you hear about us?" section</span>
                    </label>
                    <div className="grid md:grid-cols-2 gap-6 pl-8 border-l-2 border-slate-100">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1">Section Label</label>
                            <input name="form_referral_label" defaultValue={content.form_referral_label} className="w-full border p-3 rounded-xl"/>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1">Options (Comma Separated)</label>
                            <input name="referral_options" defaultValue={content.referral_options} className="w-full border p-3 rounded-xl" placeholder="LinkedIn, Twitter, Friend..."/>
                        </div>
                        <div className="md:col-span-2">
                             <label className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                                <input type="checkbox" name="is_referral_multiselect" defaultChecked={content.is_referral_multiselect} className="w-5 h-5 text-yellow-600 rounded"/>
                                <div>
                                    <span className="font-bold text-slate-800 block">Allow Multi-Select</span>
                                    <span className="text-xs text-slate-500">If unchecked, users can only pick one option. If checked, they can pick multiple.</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-4 border-t flex justify-end">
                <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-lg flex items-center gap-2">
                    <Save size={20}/> Update Form Configuration
                </button>
            </div>
        </form>
      )}

      {/* --- TAB 3: APPLICATIONS --- */}
      {activeTab === 'applications' && (
        <div className="space-y-6 animate-in fade-in">
            {/* Actions Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <h3 className="font-bold text-lg text-slate-700">Received Applications ({applications.length})</h3>
                
                <div className="flex flex-wrap gap-2">
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <button onClick={() => handleDownload('csv_all')} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 text-sm font-bold hover:bg-green-100 border-r border-green-200 transition">
                            <FileText size={16}/> CSV (All)
                        </button>
                        <button onClick={() => openShareModal('csv_all', null, "Share All Applications (CSV)")} className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 text-sm font-bold hover:bg-green-100 transition">
                            <Share2 size={16}/>
                        </button>
                    </div>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <button onClick={() => handleDownload('zip_resumes')} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-bold hover:bg-blue-100 border-r border-blue-200 transition">
                            <Download size={16}/> Resumes (ZIP)
                        </button>
                        <button onClick={() => openShareModal('zip_resumes', null, "Share All Resumes (ZIP)")} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 text-sm font-bold hover:bg-blue-100 transition">
                            <Share2 size={16}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 border-b">
                        <tr>
                            <th className="p-4">Applicant</th>
                            <th className="p-4">Applying For</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Applied On</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {applications.map(app => (
                            <tr key={app.id} className="hover:bg-slate-50 transition">
                                <td className="p-4 font-bold text-slate-800">{app.applicant_name}</td>
                                <td className="p-4 text-slate-600">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
                                        {data?.jobs?.find(j => j.id === app.job)?.title || "Job #" + app.job}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-600">
                                    <div className="flex flex-col">
                                        <span>{app.email}</span>
                                        <span className="text-xs text-slate-400">{app.phone}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-500">{new Date(app.applied_at).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* VIEW DETAILS */}
                                        <button onClick={() => setViewModal(app)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="View Details">
                                            <Eye size={16}/>
                                        </button>

                                        {/* Resume */}
                                        {app.resume_file ? (
                                            <a href={app.resume_file} download className="p-2 text-blue-600 hover:bg-blue-50 rounded tooltip" title="Download Resume">
                                                <FileIcon size={16}/>
                                            </a>
                                        ) : app.resume_link ? (
                                            <a href={app.resume_link} target="_blank" rel="noreferrer" className="p-2 text-blue-400 hover:bg-blue-50 rounded" title="View Resume Link">
                                                <ExternalLink size={16}/>
                                            </a>
                                        ) : null}

                                        {/* Download Detail CSV */}
                                        <button onClick={() => handleDownload('csv_single', app.id)} className="p-2 text-slate-600 hover:bg-slate-100 rounded" title="Download Details CSV">
                                            <Download size={16}/>
                                        </button>
                                        
                                        {/* Share */}
                                        <button onClick={() => openShareModal('csv_single', app.id, `Share ${app.applicant_name}'s Details`)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded" title="Share">
                                            <Share2 size={16}/>
                                        </button>
                                        
                                        <button onClick={() => handleDelete('applications', app.id)} className="p-2 text-red-400 hover:bg-red-50 rounded" title="Delete">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-400">No applications received yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- TAB 4: JOB OPENINGS --- */}
      {activeTab === 'jobs' && (
        <ListManager
            title="Job Openings"
            items={data?.jobs}
            resource="jobs"
            fields={[
                { name: 'title', label: 'Job Title', type: 'text' },
                { name: 'department', label: 'Department', type: 'text' },
                { name: 'location', label: 'Location', type: 'text' },
                { name: 'type', label: 'Job Type', type: 'select', options: ['Full-Time', 'Part-Time', 'Contract', 'Internship'] },
                { name: 'description', label: 'Description (HTML)', type: 'textarea' },
                { name: 'is_active', label: 'Is Active?', type: 'checkbox' },
            ]}
            {...{ onDelete: handleDelete, onSave: handleSaveItem, editingItem, setEditingItem, isAddingNew, setIsAddingNew }}
        />
      )}

      {/* --- TAB 5: BENEFITS --- */}
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

      {/* --- TAB 6: TESTIMONIALS --- */}
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

      {/* --- SHARE POPUP MODAL --- */}
      {shareModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-bold text-lg text-slate-800">{shareModal.title}</h3>
                    <button onClick={() => setShareModal({ ...shareModal, isOpen: false })} className="p-1 hover:bg-slate-100 rounded-full transition"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Option 1: Email */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Mail size={16}/> Send via Email
                        </label>
                        <div className="text-xs text-slate-500 mb-2">The requested file (CSV/ZIP) will be sent as an attachment.</div>
                        <form onSubmit={handleSendEmail} className="flex gap-2">
                            <input 
                                type="email" 
                                required 
                                placeholder="recipient@example.com" 
                                value={emailTo}
                                onChange={e => setEmailTo(e.target.value)}
                                className="flex-1 border p-2.5 rounded-lg text-sm outline-none focus:border-blue-500"
                            />
                            <button disabled={sendingEmail} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                                {sendingEmail ? <Loader2 className="animate-spin" size={16}/> : 'Send'}
                            </button>
                        </form>
                    </div>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-bold">OR</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* Option 2: WhatsApp */}
                    <div>
                        <button 
                            onClick={handleWhatsAppShare}
                            className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition ${
                                shareModal.type.includes('csv_all') || shareModal.type.includes('zip') 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200'
                            }`}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                            Share via WhatsApp
                        </button>
                        {(shareModal.type.includes('csv_all') || shareModal.type.includes('zip')) && (
                            <p className="text-xs text-center text-slate-400 mt-2 bg-slate-50 p-2 rounded">
                                * WhatsApp Web Sharing is available for <b>Individual</b> applicants only. Use email for bulk files.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- VIEW APPLICATION MODAL --- */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b bg-slate-50">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">{viewModal.applicant_name}</h3>
                        <p className="text-sm text-slate-500">
                            Applying for <span className="font-bold text-blue-600">{data?.jobs?.find(j => j.id === viewModal.job)?.title || "Job #" + viewModal.job}</span>
                        </p>
                    </div>
                    <button onClick={() => setViewModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={20}/></button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                            <p className="text-slate-800 font-medium">{viewModal.email}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Phone</label>
                            <p className="text-slate-800 font-medium">{viewModal.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">LinkedIn</label>
                            {viewModal.linkedin_url ? (
                                <a href={viewModal.linkedin_url} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline truncate">
                                    {viewModal.linkedin_url}
                                </a>
                            ) : <p className="text-slate-500">N/A</p>}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Applied On</label>
                            <p className="text-slate-800 font-medium">{new Date(viewModal.applied_at).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Referral */}
                    {viewModal.referral_source && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <label className="text-xs font-bold text-blue-500 uppercase">Referral Source</label>
                            <p className="text-blue-900 font-medium">{viewModal.referral_source}</p>
                        </div>
                    )}

                    {/* Cover Letter */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Cover Letter</label>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {viewModal.cover_letter || "No cover letter provided."}
                        </div>
                    </div>

                    {/* Resume Actions within Modal */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Resume</label>
                        <div className="flex gap-3">
                            {viewModal.resume_file && (
                                <a href={viewModal.resume_file} download className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 transition">
                                    <FileIcon size={16}/> Download PDF
                                </a>
                            )}
                            {viewModal.resume_link && (
                                <a href={viewModal.resume_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 transition">
                                    <ExternalLink size={16}/> Open Link
                                </a>
                            )}
                            {!viewModal.resume_file && !viewModal.resume_link && (
                                <span className="text-slate-400 text-sm italic">No resume attached</span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="p-4 border-t bg-slate-50 flex justify-end">
                    <button onClick={() => setViewModal(null)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800">Close</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

// Reusable List Manager
const ListManager = ({ title, items, resource, fields, onDelete, onSave, editingItem, setEditingItem, isAddingNew, setIsAddingNew }) => {
    const safeItems = Array.isArray(items) ? items : [];
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {title} <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{safeItems.length}</span>
                </h2>
                {!isAddingNew && !editingItem && (
                    <button onClick={() => setIsAddingNew(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md">
                        <Plus size={18}/> Add New
                    </button>
                )}
            </div>

            {(isAddingNew || editingItem) && (
                <form onSubmit={(e) => onSave(e, resource)} className="bg-slate-50 p-6 rounded-2xl border border-blue-200 shadow-sm mb-6 animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                        <h3 className="font-bold text-blue-700 flex items-center gap-2">
                            {editingItem ? <Edit2 size={18}/> : <Plus size={18}/>} {editingItem ? 'Edit Item' : 'Add New Item'}
                        </h3>
                        <button type="button" onClick={() => { setEditingItem(null); setIsAddingNew(false); }} className="bg-white p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition"><X size={20}/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeItems.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition group relative flex flex-col justify-between">
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg backdrop-blur-sm shadow-sm border">
                            <button onClick={() => { setEditingItem(item); setIsAddingNew(false); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-blue-600 p-1.5 hover:bg-blue-50 rounded transition"><Edit2 size={14}/></button>
                            <button onClick={() => onDelete(resource, item.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded transition"><Trash2 size={14}/></button>
                        </div>
                        <div className="flex gap-4 items-start mb-3">
                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold flex-shrink-0">
                                {item.image ? <img src={item.image} className="w-full h-full object-cover rounded-lg"/> : (item.name || item.title || '?').charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-bold text-slate-800 line-clamp-1 text-sm">{item.name || item.title}</h4>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.role || item.department || item.icon_name}</p>
                                {item.is_active !== undefined && (
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.is_active ? 'Active' : 'Closed'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg">
                            {item.description || item.quote || "No description"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import { getHomeData, updatePageContent } from '../../api';
import { Save, Loader2 } from 'lucide-react';

export default function HomeEditor() {
  const [content, setContent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getHomeData().then(res => setContent(res.data.content));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Assuming 'content' has an ID for the CMS record
    try {
        await updatePageContent(content.id, content);
        alert("Changes saved successfully!");
    } catch (err) { console.error(err); }
    setIsSaving(false);
  };

  if(!content) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold text-slate-900">Edit Home Page</h2>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            {isSaving ? <Loader2 className="animate-spin"/> : <Save size={20}/>} Save Changes
          </button>
      </div>

      <div className="grid gap-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 border-l-4 border-blue-500 pl-3">Hero Section</h3>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Main Title</label>
                <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                    value={content.hero_title}
                    onChange={(e) => setContent({...content, hero_title: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subtitle</label>
                <textarea 
                    rows="4"
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                    value={content.hero_subtitle}
                    onChange={(e) => setContent({...content, hero_subtitle: e.target.value})}
                />
            </div>
        </section>

        <section className="space-y-4 pt-8 border-t border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 border-l-4 border-purple-500 pl-3">Process Section</h3>
            <div className="grid md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Process Title</label>
                    <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" value={content.process_title} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Process Subtitle</label>
                    <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" value={content.process_subtitle} />
                 </div>
            </div>
        </section>
      </div>
    </div>
  );
}
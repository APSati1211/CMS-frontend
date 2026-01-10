import React, { useState, useEffect } from 'react';
import { getBrandingSettings, updateBrandingSettings } from '../../api';
import { 
    Save, Upload, Loader2, Layout, AlertCircle, Menu, 
    CheckCircle2, Eye, Image as ImageIcon, Globe, X, ExternalLink
} from 'lucide-react';

export default function HeaderManager() {
  const [data, setData] = useState({
    site_title: "",
    show_announcement: false,
    announcement_text: "",
    announcement_link: "",
    nav_about_label: "About",
    nav_services_label: "Services",
    nav_solutions_label: "Solutions",
    nav_careers_label: "Careers",
    nav_resources_label: "Resources",
    nav_cta_label: "Get Started"
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // New State for Live Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getBrandingSettings();
      if (res.data) {
        setData(res.data);
        if(res.data.logo) setLogoPreview(res.data.logo);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching branding:", err);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (key !== 'logo' && key !== 'favicon' && data[key] !== null) {
            formData.append(key, data[key]);
        }
    });
    
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      const id = data.id || 1; 
      await updateBrandingSettings(id, formData);
      alert("Header Settings Updated Successfully!"); 
    } catch (err) {
      console.error(err);
      alert("Failed to update settings.");
    }
    setSaving(false);
  };

  if (loading) return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Header & Branding</h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">Control your site's visual identity and navigation structure.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="group flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {saving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
          <span>Publish Changes</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: IDENTITY & CONFIG (4 Cols) --- */}
        <div className="lg:col-span-4 space-y-8">
            
            {/* SITE IDENTITY CARD */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Layout size={100}/></div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Globe size={18} className="text-indigo-500"/> Site Identity
                </h3>
                
                <div className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Website Title</label>
                        <input 
                            type="text" 
                            value={data.site_title}
                            onChange={(e) => setData({...data, site_title: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-700 transition-all shadow-inner"
                            placeholder="e.g. XpertAI"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Logo Upload</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-indigo-50/50 hover:border-indigo-400 transition-all relative group cursor-pointer bg-slate-50">
                            <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                            
                            {logoPreview ? (
                                <div className="relative group-hover:scale-105 transition-transform duration-300">
                                    <div className="h-24 w-full flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 p-2 mb-3">
                                        <img src={logoPreview} alt="Logo Preview" className="max-h-full object-contain" />
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                        <CheckCircle2 size={10}/> Image Loaded
                                    </span>
                                </div>
                            ) : (
                                <div className="py-4">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                        <ImageIcon size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600">Click to upload logo</p>
                                    <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (Max 2MB)</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ANNOUNCEMENT BAR CARD */}
            <div className={`p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border transition-all duration-300 ${data.show_announcement ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-indigo-200 border-transparent' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 font-bold text-sm">
                        <AlertCircle size={18} className={data.show_announcement ? "text-white/80" : "text-indigo-500"}/> 
                        <span className={data.show_announcement ? "text-white" : "text-slate-800"}>Top Announcement</span>
                    </div>
                    
                    {/* IOS Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={data.show_announcement} onChange={(e) => setData({...data, show_announcement: e.target.checked})} />
                        <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm peer-checked:bg-green-400/30 peer-checked:after:bg-white"></div>
                    </label>
                </div>

                {data.show_announcement && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <input 
                            type="text" 
                            placeholder="Announcement Message..."
                            value={data.announcement_text}
                            onChange={(e) => setData({...data, announcement_text: e.target.value})}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition backdrop-blur-sm"
                        />
                        <input 
                            type="text" 
                            placeholder="https:// link (Optional)"
                            value={data.announcement_link}
                            onChange={(e) => setData({...data, announcement_link: e.target.value})}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition backdrop-blur-sm"
                        />
                    </div>
                )}
                {!data.show_announcement && <p className="text-xs text-slate-400">Enable to show a banner at the top of every page.</p>}
            </div>
        </div>

        {/* --- RIGHT COLUMN: NAVIGATION & PREVIEW (8 Cols) --- */}
        <div className="lg:col-span-8">
            <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-100 h-full relative">
                
                {/* Visual Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-3xl"></div>

                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Menu size={22} className="text-indigo-600"/> Navigation Menu
                    </h3>
                    
                    {/* Live Preview Button */}
                    <button 
                        onClick={() => setShowPreviewModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full border border-indigo-200 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95"
                    >
                        <Eye size={16}/>
                        <span className="text-xs font-bold uppercase tracking-wide">Live Preview</span>
                    </button>
                </div>
                
                {/* MENU ITEMS GRID */}
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                    <NavItem label="About Link" value={data.nav_about_label} onChange={(v) => setData({...data, nav_about_label: v})} />
                    <NavItem label="Services Link" value={data.nav_services_label} onChange={(v) => setData({...data, nav_services_label: v})} />
                    <NavItem label="Solutions Link" value={data.nav_solutions_label} onChange={(v) => setData({...data, nav_solutions_label: v})} />
                    <NavItem label="Careers Link" value={data.nav_careers_label} onChange={(v) => setData({...data, nav_careers_label: v})} />
                    <NavItem label="Resources Link" value={data.nav_resources_label} onChange={(v) => setData({...data, nav_resources_label: v})} />
                    
                    {/* CTA Config */}
                    <div className="md:col-span-2 mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-end gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-indigo-600 uppercase mb-2 ml-1">CTA Button Label</label>
                                <input 
                                    type="text" 
                                    value={data.nav_cta_label} 
                                    onChange={(e) => setData({...data, nav_cta_label: e.target.value})} 
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-indigo-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                />
                            </div>
                            
                            {/* CTA Preview */}
                            <div className="hidden md:block pb-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase text-center mb-2">Button Preview</div>
                                <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 text-sm">
                                    {data.nav_cta_label || "Get Started"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- INLINE PREVIEW (Mini) --- */}
                <div className="mt-10 pt-8 border-t border-slate-100 opacity-60 hover:opacity-100 transition-opacity">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-4 text-center">Quick Preview</label>
                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner cursor-pointer" onClick={() => setShowPreviewModal(true)}>
                        {data.show_announcement && (
                            <div className="bg-slate-900 text-white text-[10px] py-1 text-center font-medium">
                                {data.announcement_text || "Announcement"}
                            </div>
                        )}
                        <div className="bg-white px-4 py-3 flex justify-between items-center">
                            <div className="h-4 w-12 bg-indigo-200 rounded"></div>
                            <div className="flex gap-2">
                                {[1,2,3,4].map(i => <div key={i} className="h-2 w-8 bg-slate-200 rounded"></div>)}
                            </div>
                            <div className="h-6 w-16 bg-indigo-600 rounded"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* --- FULL SCREEN PREVIEW MODAL --- */}
      {showPreviewModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-7xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300">
                  
                  {/* Modal Header/Controls */}
                  <div className="bg-slate-100 border-b border-slate-200 p-4 flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-2">
                          <div className="flex gap-1.5 mr-4">
                              <div className="w-3 h-3 rounded-full bg-red-400"></div>
                              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                              <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          </div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-white px-3 py-1 rounded-md border shadow-sm">
                              Live Website Preview
                          </div>
                      </div>
                      <button 
                        onClick={() => setShowPreviewModal(false)}
                        className="bg-white p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition shadow-sm border border-slate-200"
                      >
                          <X size={20}/>
                      </button>
                  </div>

                  {/* Preview Viewport */}
                  <div className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar relative">
                      
                      {/* 1. Announcement Bar */}
                      {data.show_announcement && (
                          <div className="bg-slate-900 text-white py-2 px-4 text-center text-sm font-medium relative z-20">
                              {data.announcement_text || "Announcement Text Here"}
                              {data.announcement_link && <ExternalLink size={12} className="inline ml-2 opacity-70"/>}
                          </div>
                      )}

                      {/* 2. Navigation Bar */}
                      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                              
                              {/* Logo Area */}
                              <div className="flex items-center gap-3">
                                  {logoPreview ? (
                                      <img src={logoPreview} alt="Site Logo" className="h-10 w-auto object-contain" />
                                  ) : (
                                      <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                          {data.site_title ? data.site_title.charAt(0) : "X"}
                                      </div>
                                  )}
                                  <span className="font-bold text-xl text-slate-800 tracking-tight hidden md:block">
                                      {data.site_title || "XpertAI"}
                                  </span>
                              </div>

                              {/* Desktop Nav Links */}
                              <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
                                  {[
                                      data.nav_about_label,
                                      data.nav_services_label,
                                      data.nav_solutions_label,
                                      data.nav_careers_label,
                                      data.nav_resources_label
                                  ].map((link, i) => (
                                      <a key={i} href="#" className="hover:text-indigo-600 transition-colors">{link}</a>
                                  ))}
                              </nav>

                              {/* CTA & Mobile Toggle */}
                              <div className="flex items-center gap-4">
                                  <a href="#" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                                      {data.nav_cta_label || "Get Started"}
                                  </a>
                                  <div className="md:hidden text-slate-800"><Menu /></div>
                              </div>
                          </div>
                      </header>

                      {/* 3. Dummy Hero Section for Context */}
                      <section className="bg-white py-20 lg:py-32 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 skew-x-12 translate-x-20"></div>
                          <div className="max-w-7xl mx-auto px-6 relative z-10">
                              <div className="max-w-3xl">
                                  <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wide mb-6 border border-indigo-100">
                                      Leading AI Solutions
                                  </div>
                                  <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
                                      Transforming Business with <span className="text-indigo-600">Intelligent AI</span>.
                                  </h1>
                                  <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl">
                                      This is a preview of your header. The content below is just a placeholder to show how the navigation sits on top of your page content.
                                  </p>
                                  <div className="flex gap-4">
                                      <div className="h-14 w-40 bg-slate-900 rounded-xl"></div>
                                      <div className="h-14 w-40 bg-white border border-slate-200 rounded-xl"></div>
                                  </div>
                              </div>
                          </div>
                      </section>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}

// Helper Component for Inputs (Light Themed)
const NavItem = ({ label, value, onChange }) => (
    <div className="group">
        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 transition-colors group-focus-within:text-indigo-500">{label}</label>
        <div className="relative">
            <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm group-hover:bg-white"
            />
        </div>
    </div>
);
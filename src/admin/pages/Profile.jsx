import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../../api';
import { 
  User, Mail, Phone, MapPin, Save, Loader2, Camera, 
  ShieldCheck, Lock, AlertCircle, Briefcase, Globe, 
  Linkedin, Twitter, Crown, Send, Settings2, CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    role: 'superadmin',
    profile_image: null,
    password: '',
    confirm_password: '',
    job_title: '',
    bio: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
    leads_sender_email: '' 
  });
  
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      const data = res.data;
      
      setFormData({ 
          ...data, 
          password: '', 
          confirm_password: '',
          job_title: data.job_title || '',
          bio: data.bio || '',
          linkedin_url: data.linkedin_url || '',
          twitter_url: data.twitter_url || '',
          website_url: data.website_url || '',
          leads_sender_email: data.leads_sender_email || data.email || '',
          role: data.role || 'superadmin' 
      });
      
      if (data.profile_image) {
        setPreviewImage(data.profile_image);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to load profile", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (formData.password && formData.password !== formData.confirm_password) {
        setError("Passwords do not match!");
        setSaving(false);
        return;
    }
    
    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if ((key === 'password' || key === 'confirm_password') && !formData[key]) return;
      if (key === 'profile_image' && typeof formData[key] === 'string') return;
      if (formData[key] !== null && formData[key] !== undefined) {
          dataToSend.append(key, formData[key]);
      }
    });

    try {
      await updateProfile(dataToSend);
      setSuccess("Profile and System Settings updated successfully!");
      setFormData(prev => ({ ...prev, password: '', confirm_password: '' }));
    } catch (err) {
      console.error("Update failed", err);
      setError("Failed to update profile. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500 font-sans">
      
      {/* --- REFRESHED HERO SECTION --- */}
      <div className="relative mb-28">
          {/* Light Vibrant Banner */}
          <div className="h-60 w-full rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 overflow-hidden relative shadow-lg">
              {/* Subtle Patterns */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
              <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Sparkles size={300} className="text-white" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          </div>

          {/* Floating Profile Info */}
          <div className="absolute bottom-[-90px] left-0 right-0 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
              
              {/* Avatar */}
              <div className="relative group">
                  <div className="w-40 h-40 rounded-3xl border-4 border-white shadow-xl bg-white overflow-hidden rotate-[-2deg] hover:rotate-0 transition-all duration-300">
                      <img 
                          src={previewImage || `https://ui-avatars.com/api/?name=${formData.username}&background=f1f5f9&color=0f172a`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                      />
                  </div>
                  <label className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-3 rounded-xl cursor-pointer hover:bg-blue-700 transition shadow-lg border-4 border-white group-hover:scale-110">
                      <Camera size={20} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
              </div>

              {/* Text Info */}
              <div className="flex-1 text-center md:text-left mb-2">
                  <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight -mt-9 mb-5">
                        {formData.first_name} {formData.last_name}
                    </h1>
                  <div className="flex flex-col md:flex-row items-center gap-3 text-slate-500 font-medium mt-2">
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                        <Briefcase size={14} className="text-blue-500"/> {formData.job_title || "System Administrator"}
                      </span>
                      <span className="hidden md:inline text-slate-300">•</span>
                      <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100">
                          {formData.role === 'superadmin' ? <><Crown size={12}/> Super Admin</> : formData.role}
                      </span>
                  </div>
              </div>

              {/* Main Action */}
              <div className="mb-2 hidden md:block">
                  <button 
                      onClick={handleSubmit} 
                      disabled={saving}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                      {saving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                      Save Changes
                  </button>
              </div>
          </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 px-4 md:px-0 mt-8">
        
        {/* --- LEFT SIDEBAR (4 Cols) --- */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Super Admin Badge Card - Refined */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-[-10px] right-[-10px] p-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all transform group-hover:scale-110"><Crown size={100}/></div>
                <div className="relative z-10">
                    <h3 className="font-bold text-amber-600 uppercase tracking-widest text-[10px] mb-2">Authority Level</h3>
                    <div className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        SUPER ADMIN
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                        Full access granted. You can manage system configurations, leads distribution, and user roles.
                    </p>
                </div>
            </div>

            {/* Quick Stats / Socials */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Globe size={16} className="text-blue-500"/> Social Presence
                </h3>
                <div className="space-y-4">
                    <SocialInput icon={Linkedin} color="text-blue-700" placeholder="LinkedIn Profile" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} />
                    <SocialInput icon={Twitter} color="text-sky-500" placeholder="Twitter Profile" name="twitter_url" value={formData.twitter_url} onChange={handleChange} />
                    <SocialInput icon={Globe} color="text-emerald-600" placeholder="Portfolio Website" name="website_url" value={formData.website_url} onChange={handleChange} />
                </div>
            </div>

            {/* Account Meta */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm mb-4">System Metadata</h3>
                <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600 font-bold border border-slate-100">
                        @
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Username</div>
                        <div className="font-bold text-slate-800 truncate text-sm">{formData.username}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-600 font-bold border border-slate-100">
                        ID
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">User ID</div>
                        <div className="font-bold text-slate-800 text-sm">#849201</div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- MAIN CONTENT (8 Cols) --- */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* Feedback Messages */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} className="shrink-0"/> {error}
                </div>
            )}
            {success && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 flex items-center gap-3 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 size={20} className="shrink-0"/> {success}
                </div>
            )}

            {/* --- 1. SYSTEM CONFIGURATION (LIGHT MODE) --- */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Settings2 size={20}/></div>
                        System Configuration
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Sender Identity</label>
                            <div className="relative group">
                                <Send className="absolute left-4 top-3.5 text-indigo-500" size={18}/>
                                <input 
                                    type="email"
                                    name="leads_sender_email"
                                    value={formData.leads_sender_email}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                    placeholder="noreply@xpertai.com"
                                />
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed pl-1">
                                Appears as the <strong>"From"</strong> address in automated lead emails.
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Global Admin Role</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-3.5 text-amber-500" size={18}/>
                                <input 
                                    type="text" 
                                    value="Super Admin"
                                    disabled
                                    className="w-full pl-11 pr-4 py-3 bg-amber-50/50 border border-amber-100 rounded-xl text-amber-700 font-bold cursor-not-allowed"
                                />
                            </div>
                             <p className="text-[11px] text-slate-400 leading-relaxed pl-1">
                                Managed at database level.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. PERSONAL DETAILS --- */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><User size={20}/></div>
                    Personal & Professional
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
                    <InputGroup label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
                    
                    <div className="md:col-span-2">
                         <InputGroup label="Job Title" name="job_title" value={formData.job_title} onChange={handleChange} placeholder="e.g. Chief Technology Officer" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Professional Bio</label>
                        <textarea 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleChange}
                            rows="4" 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm resize-none placeholder:text-slate-400"
                            placeholder="Brief description about your role and responsibilities..."
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* --- 3. CONTACT INFO --- */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Mail size={20}/></div>
                    Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <InputGroup label="Email Address" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <InputGroup label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Office Address</label>
                        <textarea 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            rows="2" 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm resize-none placeholder:text-slate-400"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* --- 4. SECURITY --- */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><Lock size={20}/></div>
                    Security Settings
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <InputGroup label="Username" name="username" value={formData.username} onChange={handleChange} />
                    </div>
                    <InputGroup label="New Password" name="password" type="password" placeholder="Leave blank to keep current" value={formData.password} onChange={handleChange} />
                    <InputGroup label="Confirm Password" name="confirm_password" type="password" placeholder="Confirm new password" value={formData.confirm_password} onChange={handleChange} />
                </div>
            </div>

             {/* Mobile Save Button */}
             <div className="md:hidden">
                <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 flex justify-center items-center gap-2">
                    {saving ? <Loader2 className="animate-spin" /> : <Save />} Save Changes
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}

// Helper Components - Updated for Light Theme
const InputGroup = ({ label, type = "text", ...props }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">{label}</label>
        <input 
            type={type} 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm placeholder:text-slate-400"
            {...props}
        />
    </div>
);

const SocialInput = ({ icon: Icon, color, ...props }) => (
    <div className="relative group">
        <Icon className={`absolute left-4 top-3.5 ${color} transition-colors opacity-70 group-focus-within:opacity-100`} size={18}/>
        <input 
            type="url" 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm transition-all shadow-sm placeholder:text-slate-400"
            {...props}
        />
    </div>
);
import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../../api';
import { 
  User, Mail, Phone, MapPin, Save, Loader2, Camera, 
  ShieldCheck, Lock, AlertCircle, Briefcase, Globe, 
  Linkedin, Twitter, Crown, Send, Settings2, CheckCircle2
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
    role: 'superadmin', // Defaulted as requested
    profile_image: null,
    password: '',
    confirm_password: '',
    // Extended Profile Data
    job_title: '',
    bio: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
    // Specific Feature Request
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
          // Handle potential nulls for extended fields
          job_title: data.job_title || '',
          bio: data.bio || '',
          linkedin_url: data.linkedin_url || '',
          twitter_url: data.twitter_url || '',
          website_url: data.website_url || '',
          leads_sender_email: data.leads_sender_email || data.email || '', // Default to main email if not set
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

  if (loading) return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* --- HERO COVER SECTION --- */}
      <div className="relative mb-24">
          {/* Cover Image (Abstract) */}
          <div className="h-64 w-full rounded-b-[3rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 overflow-hidden relative shadow-xl">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Crown size={200} className="text-white" />
              </div>
          </div>

          {/* Floating Profile Info */}
          <div className="absolute bottom-[-80px] left-0 right-0 px-6 md:px-12 flex flex-col md:flex-row items-end gap-6 max-w-7xl mx-auto">
              
              {/* Avatar */}
              <div className="relative group">
                  <div className="w-44 h-44 rounded-full border-[6px] border-white shadow-2xl bg-white overflow-hidden">
                      <img 
                          src={previewImage || `https://ui-avatars.com/api/?name=${formData.username}&background=0f172a&color=fff`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                      />
                  </div>
                  <label className="absolute bottom-2 right-2 bg-indigo-600 text-white p-3 rounded-full cursor-pointer hover:bg-indigo-700 transition shadow-lg border-4 border-white group-hover:scale-110">
                      <Camera size={20} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
              </div>

              {/* Text Info */}
              <div className="flex-1 text-center md:text-left mb-2 md:mb-4">
                  <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                      {formData.first_name} {formData.last_name}
                  </h1>
                  <div className="flex flex-col md:flex-row items-center gap-3 text-slate-500 font-medium mt-1">
                      <span className="flex items-center gap-1"><Briefcase size={16}/> {formData.job_title || "System Administrator"}</span>
                      <span className="hidden md:inline">•</span>
                      <span className="flex items-center gap-1 text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full text-xs uppercase tracking-wide">
                          {formData.role === 'superadmin' ? <><Crown size={12}/> Super Admin</> : formData.role}
                      </span>
                  </div>
              </div>

              {/* Main Action */}
              <div className="mb-4 hidden md:block">
                  <button 
                      onClick={handleSubmit} 
                      disabled={saving}
                      className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                      {saving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                      Save All Changes
                  </button>
              </div>
          </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 px-4 md:px-0">
        
        {/* --- LEFT SIDEBAR (4 Cols) --- */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Super Admin Badge Card */}
            <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-6 rounded-3xl border border-amber-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-900"><Crown size={80}/></div>
                <div className="relative z-10">
                    <h3 className="font-bold text-amber-900 uppercase tracking-widest text-xs mb-2">System Authority</h3>
                    <div className="text-2xl font-black text-amber-600 flex items-center gap-2">
                        SUPER ADMIN
                    </div>
                    <p className="text-xs text-amber-800/80 mt-2 font-medium">
                        You have full read/write access to all system configurations, user management, and lead distribution settings.
                    </p>
                </div>
            </div>

            {/* Quick Stats / Socials */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
                <h3 className="font-bold text-slate-400 text-xs uppercase mb-6 flex items-center gap-2">
                    <Globe size={14}/> Social & Web Presence
                </h3>
                <div className="space-y-4">
                    <SocialInput icon={Linkedin} color="text-blue-700" placeholder="LinkedIn Profile URL" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} />
                    <SocialInput icon={Twitter} color="text-sky-500" placeholder="Twitter Profile URL" name="twitter_url" value={formData.twitter_url} onChange={handleChange} />
                    <SocialInput icon={Globe} color="text-emerald-600" placeholder="Personal Website / Portfolio" name="website_url" value={formData.website_url} onChange={handleChange} />
                </div>
            </div>

            {/* Account Meta */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
                <h3 className="font-bold text-slate-400 text-xs uppercase mb-4">Account Meta</h3>
                <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 font-bold border border-slate-100">
                        @
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Username</div>
                        <div className="font-bold text-slate-800 truncate">{formData.username}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-green-600 font-bold border border-slate-100">
                        ID
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">User ID</div>
                        <div className="font-bold text-slate-800">#849201</div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- MAIN CONTENT (8 Cols) --- */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* Feedback Messages */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} className="shrink-0"/> {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl border border-green-100 flex items-center gap-3 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 size={20} className="shrink-0"/> {success}
                </div>
            )}

            {/* --- 1. SYSTEM CONFIGURATION (Lead Settings) --- */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5"><Settings2 size={150}/></div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Settings2 size={22} className="text-indigo-400"/> System Configuration
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase">Lead Sender Identity</label>
                            <div className="relative group">
                                <Send className="absolute left-4 top-3.5 text-indigo-400" size={18}/>
                                <input 
                                    type="email"
                                    name="leads_sender_email"
                                    value={formData.leads_sender_email}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:bg-white/20 focus:border-indigo-400 outline-none transition-all"
                                    placeholder="noreply@xpertai.com"
                                />
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                This email address will appear as the <strong>"From"</strong> address when you share leads via email from the Leads Manager. 
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase">Global Admin Role</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-3.5 text-amber-400" size={18}/>
                                <input 
                                    type="text" 
                                    value="Super Admin"
                                    disabled
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-amber-400 font-bold cursor-not-allowed opacity-80"
                                />
                            </div>
                             <p className="text-[11px] text-slate-400 leading-relaxed">
                                Role modification is restricted to database level access only.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. PERSONAL DETAILS --- */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                    <User size={22} className="text-blue-600"/> Personal & Professional
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
                    <InputGroup label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
                    
                    <div className="md:col-span-2">
                         <InputGroup label="Job Title" name="job_title" value={formData.job_title} onChange={handleChange} placeholder="e.g. Chief Technology Officer" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Professional Bio</label>
                        <textarea 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleChange}
                            rows="4" 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm resize-none"
                            placeholder="Brief description about your role and responsibilities..."
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* --- 3. CONTACT INFO --- */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                    <Mail size={22} className="text-emerald-500"/> Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <InputGroup label="Email Address" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <InputGroup label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Office Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm resize-none"></textarea>
                    </div>
                </div>
            </div>

            {/* --- 4. SECURITY --- */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                    <Lock size={22} className="text-rose-500"/> Security Settings
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
                <button onClick={handleSubmit} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl flex justify-center items-center gap-2">
                    {saving ? <Loader2 className="animate-spin" /> : <Save />} Save Changes
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}

// Helper Components
const InputGroup = ({ label, type = "text", ...props }) => (
    <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">{label}</label>
        <input 
            type={type} 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm hover:bg-white"
            {...props}
        />
    </div>
);

const SocialInput = ({ icon: Icon, color, ...props }) => (
    <div className="relative group">
        <Icon className={`absolute left-4 top-3.5 ${color} transition-colors`} size={18}/>
        <input 
            type="url" 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm transition-all shadow-sm hover:bg-white"
            {...props}
        />
    </div>
);
import { useEffect, useState } from "react";
import { getCareersPageData, applyForJob } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { 
  MapPin, Clock, Briefcase, X, CheckCircle, 
  Loader2, ArrowRight, Filter, Search, ChevronRight, UploadCloud 
} from "lucide-react";

export default function Careers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalMode, setModalMode] = useState("details"); // 'details' or 'apply'

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterDept, setFilterDept] = useState("All");

  useEffect(() => {
    getCareersPageData()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Careers data error:", err);
        setLoading(false);
      });
  }, []);

  const renderIcon = (iconName) => {
    const Icon = LucideIcons[iconName] || LucideIcons.Star;
    return <Icon size={32} className="text-blue-600 mb-4" />;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 text-blue-600 animate-pulse font-bold text-lg">
        Finding Opportunities...
    </div>
  );

  const { content, benefits, jobs, testimonials } = data || {};

  // --- FILTER LOGIC ---
  const filteredJobs = jobs?.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === "All" || job.type === filterType;
      const matchDept = filterDept === "All" || job.department === filterDept;
      return matchSearch && matchType && matchDept;
  }) || [];

  const departments = ["All", ...new Set(jobs?.map(j => j.department))];

  // Helper to open modal
  const openModal = (job, mode = "details") => {
      setSelectedJob(job);
      setModalMode(mode);
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans">
      
      {/* 1. HERO SECTION - LIGHT THEME (MATCHING HOME) */}
      <div className="relative pt-32 pb-20 md:pt-44 md:pb-32 bg-slate-50 text-slate-900 text-center px-6 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-purple-200/50 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-6 tracking-wide uppercase">
                We are hiring
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-900">
              {content?.hero_title}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {content?.hero_subtitle}
            </p>
            <button onClick={() => document.getElementById('openings').scrollIntoView({behavior: 'smooth'})} className="mt-10 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2 mx-auto">
                View Openings <ArrowRight size={18} />
            </button>
        </motion.div>
      </div>

      {/* 2. BENEFITS GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{content?.benefits_title}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">{content?.benefits_subtitle}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
            {benefits?.map((benefit, i) => (
                <motion.div 
                    key={benefit.id} 
                    whileHover={{ y: -8 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all text-center group"
                >
                    <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        {renderIcon(benefit.icon_name)}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{benefit.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* 3. CULTURE & TESTIMONIALS */}
      <section className="bg-white py-24 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Culture Text */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Life at XpertAI</span>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">{content?.culture_title}</h2>
                <div className="prose prose-lg text-slate-600 mb-8">
                    <p>{content?.culture_text}</p>
                </div>
                
                {/* Testimonials Carousel */}
                <div className="space-y-6">
                    {testimonials?.map((t) => (
                        <div key={t.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-4">
                            <div className="w-12 h-12 bg-blue-200 rounded-full flex-shrink-0 overflow-hidden">
                                {t.image ? <img src={t.image} alt={t.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-blue-700 font-bold">{t.name[0]}</div>}
                            </div>
                            <div>
                                <p className="italic text-slate-700 mb-2 text-sm">"{t.quote}"</p>
                                <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                                <p className="text-xs text-blue-600 uppercase font-semibold">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Culture Image */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl rotate-3 opacity-10 -z-10"></div>
                {content?.culture_image ? (
                    <img src={content.culture_image} alt="Culture" className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]" />
                ) : (
                    <div className="relative bg-slate-100 h-[500px] rounded-3xl flex items-center justify-center text-slate-400 font-bold text-xl border-2 border-dashed border-slate-300">
                        Culture Image
                    </div>
                )}
            </motion.div>
        </div>
      </section>

      {/* 4. JOB OPENINGS */}
      <section className="py-24 px-6 bg-slate-50" id="openings">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{content?.openings_title}</h2>
                <p className="text-slate-500">Find your next role and help us shape the future.</p>
            </div>
            
            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-20">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search roles (e.g. Engineer)" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex w-full md:w-auto gap-4 overflow-x-auto pb-2 md:pb-0">
                    <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap">
                        <Filter size={18} /> Filters:
                    </div>
                    <select 
                        className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer"
                        value={filterType} onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Internship">Internships</option>
                        <option value="Contract">Contract</option>
                    </select>

                    <select 
                        className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer"
                        value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
                    >
                        {departments.map(dept => <option key={dept} value={dept}>{dept === "All" ? "All Departments" : dept}</option>)}
                    </select>
                </div>
            </div>

            {/* Job List */}
            <div className="grid gap-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <motion.div 
                            key={job.id} 
                            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group"
                        >
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                    {job.type === 'Internship' && (
                                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded uppercase">Internship</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
                                    <span className="flex items-center gap-1"><Briefcase size={16} className="text-slate-400"/> {job.department}</span>
                                    <span className="flex items-center gap-1"><MapPin size={16} className="text-slate-400"/> {job.location}</span>
                                    <span className="flex items-center gap-1"><Clock size={16} className="text-slate-400"/> {job.type}</span>
                                </div>
                                {/* Short Description Preview */}
                                <div className="text-slate-500 text-sm line-clamp-2 max-w-2xl" dangerouslySetInnerHTML={{ __html: job.description }}></div>
                            </div>
                            
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button 
                                    onClick={() => openModal(job, "details")}
                                    className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                                >
                                    View Details
                                </button>
                                <button 
                                    onClick={() => openModal(job, "apply")}
                                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                                >
                                    Apply Now <ChevronRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No jobs found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters.</p>
                        <button onClick={() => {setFilterType("All"); setFilterDept("All"); setSearchTerm("")}} className="text-blue-600 font-bold mt-4 hover:underline">
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* JOB DETAIL & APPLICATION MODAL */}
      <ApplicationModal 
        job={selectedJob} 
        isOpen={!!selectedJob} 
        mode={modalMode}
        setMode={setModalMode}
        onClose={() => setSelectedJob(null)} 
      />
    </div>
  );
}

// --- UPDATED MODAL COMPONENT ---
function ApplicationModal({ job, isOpen, mode, setMode, onClose }) {
  const [form, setForm] = useState({ 
      applicant_name: "", 
      email: "", 
      phone: "", 
      linkedin_url: "", 
      resume_link: "", 
      resume_file: null, 
      cover_letter: "" 
  });
  const [status, setStatus] = useState("idle");

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const formData = new FormData();
      formData.append("job", job.id);
      formData.append("applicant_name", form.applicant_name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("linkedin_url", form.linkedin_url);
      formData.append("resume_link", form.resume_link);
      formData.append("cover_letter", form.cover_letter);
      
      if (form.resume_file) {
          formData.append("resume_file", form.resume_file);
      }

      await applyForJob(formData);
      
      setStatus("success");
      setTimeout(() => { 
          onClose(); 
          setStatus("idle"); 
          setForm({ 
              applicant_name: "", 
              email: "", 
              phone: "", 
              linkedin_url: "", 
              resume_link: "", 
              resume_file: null, 
              cover_letter: "" 
          }); 
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
          setForm({ ...form, resume_file: e.target.files[0] });
      }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row relative"
          onClick={e => e.stopPropagation()}
        >
            {/* LEFT SIDE: JOB DETAILS (Modified to show Full Width in 'details' mode) */}
            <div className={`
                bg-slate-50 p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-slate-200 transition-all duration-300
                ${mode === 'details' ? 'w-full' : 'hidden md:block md:w-1/2'} 
            `}>
                <div className="sticky top-0 bg-slate-50 pb-4 z-10 flex justify-between items-start">
                    <div>
                        <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">{job.department}</span>
                        <h2 className="text-2xl font-bold text-slate-900 mt-1">{job.title}</h2>
                        <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                            <span className="flex items-center gap-1"><Clock size={14}/> {job.type}</span>
                        </div>
                    </div>

                    {/* CTA Button in Details Mode (Top Right) */}
                    {mode === 'details' && (
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setMode('apply')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition flex items-center gap-2 active:scale-95"
                            >
                                Apply Now <ChevronRight size={16} />
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500">
                                <X size={24} />
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="prose prose-slate prose-sm mt-4 text-slate-600 max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>

            {/* RIGHT SIDE: APPLICATION FORM (Modified Visibility) */}
            <div className={`
                p-8 overflow-y-auto bg-white transition-all duration-300
                ${mode === 'apply' ? 'w-full md:w-1/2 block' : 'hidden'}
            `}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Application Form</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
                </div>

                {status === "success" ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Application Sent!</h3>
                        <p className="text-slate-500">We'll review your profile and get back to you.</p>
                        <button onClick={onClose} className="mt-6 text-blue-600 font-bold hover:underline">Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                            <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={form.applicant_name} onChange={e => setForm({...form, applicant_name: e.target.value})} placeholder="John Doe" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
                                <input required type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                                <input type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91..." />
                            </div>
                        </div>

                        {/* --- FILE UPLOAD (MANDATORY) --- */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Resume (PDF) *</label>
                            <div className="relative">
                                <input 
                                    required 
                                    type="file" 
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <UploadCloud className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                        {/* --- LINK (OPTIONAL) --- */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Resume Link (Optional)</label>
                            <input type="url" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={form.resume_link} onChange={e => setForm({...form, resume_link: e.target.value})} placeholder="https://drive.google.com/file..." />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">LinkedIn URL</label>
                            <input type="url" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={form.linkedin_url} onChange={e => setForm({...form, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/..." />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Cover Letter</label>
                            <textarea rows="4" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={form.cover_letter} onChange={e => setForm({...form, cover_letter: e.target.value})} placeholder="Why are you a good fit?"></textarea>
                        </div>

                        {status === "error" && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                                Submission failed. Please try again later.
                            </div>
                        )}

                        <div className="pt-2 flex gap-3">
                            <button type="button" onClick={() => mode === 'apply' && window.innerWidth < 768 ? setMode('details') : onClose()} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={status === "sending"} className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg disabled:opacity-70">
                                {status === "sending" ? <Loader2 className="animate-spin" /> : "Submit Application"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
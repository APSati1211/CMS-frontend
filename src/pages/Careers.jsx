import { useEffect, useState } from "react";
import { getCareersPageData, applyForJob } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { MapPin, Clock, Briefcase, X, CheckCircle, Loader2, ArrowRight } from "lucide-react";

export default function Careers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

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
    return <Icon size={32} className="text-blue-500 mb-4" />;
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Careers...</div>;

  const { content, benefits, jobs } = data || {};

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="bg-slate-900 text-white pt-40 pb-32 text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6 relative z-10"
        >
          {content?.hero_title}
        </motion.h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto relative z-10">
          {content?.hero_subtitle}
        </p>
      </div>

      {/* 2. BENEFITS GRID */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{content?.benefits_title}</h2>
            <p className="text-slate-500">{content?.benefits_subtitle}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
            {benefits?.map((benefit, i) => (
                <motion.div 
                    key={benefit.id} 
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition"
                >
                    {renderIcon(benefit.icon_name)}
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{benefit.title}</h3>
                    <p className="text-slate-500 text-sm">{benefit.description}</p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* 3. CULTURE SECTION */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">{content?.culture_title}</h2>
                <p className="text-slate-600 text-lg leading-relaxed">{content?.culture_text}</p>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-3 opacity-10"></div>
                {content?.culture_image ? (
                    <img src={content.culture_image} alt="Culture" className="relative rounded-2xl shadow-lg w-full" />
                ) : (
                    <div className="relative bg-slate-100 h-64 rounded-2xl flex items-center justify-center text-slate-400">Culture Image</div>
                )}
            </div>
        </div>
      </section>

      {/* 4. JOB LISTINGS */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">{content?.openings_title}</h2>
            
            <div className="space-y-4">
                {jobs?.map((job) => (
                    <motion.div 
                        key={job.id} 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{job.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full"><Briefcase size={14} /> {job.department}</span>
                                <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full"><MapPin size={14} /> {job.location}</span>
                                <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full"><Clock size={14} /> {job.type}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedJob(job)}
                            className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg"
                        >
                            Apply Now <ArrowRight size={16} />
                        </button>
                    </motion.div>
                ))}
                {jobs?.length === 0 && <p className="text-center text-gray-500">No openings at the moment.</p>}
            </div>
        </div>
      </section>

      {/* APPLICATION MODAL */}
      <ApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}

function ApplicationModal({ job, onClose }) {
  const [form, setForm] = useState({ applicant_name: "", email: "", phone: "", linkedin_url: "", resume_link: "", cover_letter: "" });
  const [status, setStatus] = useState("idle");

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await applyForJob({ ...form, job: job.id });
      setStatus("success");
      setTimeout(() => { onClose(); setStatus("idle"); setForm({ applicant_name: "", email: "", phone: "", linkedin_url: "", resume_link: "", cover_letter: "" }); }, 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-slate-900 text-white p-6 flex justify-between items-center sticky top-0 z-10">
            <div>
                <h3 className="text-xl font-bold">Apply for {job.title}</h3>
                <p className="text-slate-400 text-sm">{job.department} • {job.location}</p>
            </div>
            <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition"><X size={20} /></button>
          </div>
          
          <div className="p-8">
            {status === "success" ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Application Received!</h3>
                <p className="text-slate-500">Thanks for applying. We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                        <input required type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={form.applicant_name} onChange={e => setForm({...form, applicant_name: e.target.value})} placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                        <input required type="email" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
                        <input type="tel" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 234 567 890" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL (Optional)</label>
                        <input type="url" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={form.linkedin_url} onChange={e => setForm({...form, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/..." />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Resume Link (GDrive / Dropbox) *</label>
                    <input required type="url" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={form.resume_link} onChange={e => setForm({...form, resume_link: e.target.value})} placeholder="https://drive.google.com/..." />
                    <p className="text-xs text-slate-400 mt-1">Please ensure the link is publicly accessible.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter</label>
                    <textarea rows="4" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={form.cover_letter} onChange={e => setForm({...form, cover_letter: e.target.value})} placeholder="Tell us why you're a great fit..."></textarea>
                </div>
                
                {status === "error" && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                        Something went wrong. Please check your connection and try again.
                    </div>
                )}
                
                <div className="pt-2">
                    <button type="submit" disabled={status === "sending"} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
                        {status === "sending" ? <><Loader2 className="animate-spin" /> Submitting Application...</> : "Submit Application"}
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
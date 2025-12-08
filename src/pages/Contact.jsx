import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Ticket, LifeBuoy, X, CheckCircle, Loader2, ChevronDown, Check } from "lucide-react";
import { getContactPageData, submitLead, submitTicket, getServices } from "../api"; 

export default function Contact() {
  const [data, setData] = useState(null);
  const [servicesList, setServicesList] = useState([]); // Store fetched services
  const [loading, setLoading] = useState(true);
  
  // Ticket Modal State
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  // Contact Form State
  const [form, setForm] = useState({ 
    name: "", 
    company: "",
    email: "", 
    phone: "",
    service: "",       // Main Service
    sub_services: [],  // Array for multi-select
    timeline: "",      // New Field
    message: "" 
  });
  
  const [status, setStatus] = useState(null);

  // Fetch Page Content AND Services List
  useEffect(() => {
    Promise.all([getContactPageData(), getServices()])
      .then(([pageRes, servicesRes]) => {
        setData(pageRes.data);
        setServicesList(servicesRes.data); // Expecting list of services with sub_services inside
        setLoading(false);
      })
      .catch((err) => {
        console.error("Data load error:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  // Handle Main Service Selection
  const handleServiceChange = (e) => {
    setForm({ 
        ...form, 
        service: e.target.value, 
        sub_services: [] // Reset sub-services when main service changes
    });
  };

  // Handle Multi-Select for Sub-Services
  const handleSubServiceChange = (subServiceTitle) => {
    setForm(prev => {
        const exists = prev.sub_services.includes(subServiceTitle);
        if (exists) {
            return { ...prev, sub_services: prev.sub_services.filter(s => s !== subServiceTitle) };
        } else {
            return { ...prev, sub_services: [...prev.sub_services, subServiceTitle] };
        }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // Prepare data for backend (Convert array to comma-separated string)
      const payload = {
          ...form,
          sub_services: form.sub_services.join(", "), 
          source: "website" 
      };

      await submitLead(payload); 
      setStatus("success");
      setForm({ name: "", company: "", email: "", phone: "", service: "", sub_services: [], timeline: "", message: "" });
    } catch (error) { 
      console.error("Lead submission error:", error);
      setStatus("error"); 
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const { content, addresses } = data || {};

  // Find the currently selected service object to get its sub-services
  const selectedServiceObj = servicesList.find(s => s.title === form.service);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION */}
      <div className="bg-slate-900 text-white pt-32 md:pt-40 pb-20 md:pb-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-6xl font-bold mb-4 relative z-10"
        >
          {content?.hero_title || "Get in Touch"}
        </motion.h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto relative z-10 px-2">
          {content?.hero_subtitle || "We'd love to hear from you."}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 space-y-16 md:space-y-20">
        
        {/* 2. FORM & MAP GRID */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
            
            {/* i. Contact Form */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-100"
            >
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                        <Send size={24} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">{content?.form_title || "Send a Message"}</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    
                    {/* Name & Company */}
                    <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Name *</label>
                            <input 
                              type="text" name="name" required placeholder="John Doe"
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-base"
                              value={form.name} onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Company</label>
                            <input 
                              type="text" name="company" placeholder="Business Name"
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-base"
                              value={form.company} onChange={handleChange} 
                            />
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                            <input 
                              type="email" name="email" required placeholder="john@example.com"
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-base"
                              value={form.email} onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone *</label>
                            <input 
                              type="tel" name="phone" required placeholder="+91 98765 43210"
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-base"
                              value={form.phone} onChange={handleChange} 
                            />
                        </div>
                    </div>

                    {/* DYNAMIC SERVICE DROPDOWNS */}
                    <div className="grid md:grid-cols-1 gap-4 md:gap-5">
                        
                        {/* 1. Main Service */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">I am interested in... *</label>
                            <div className="relative">
                                <select 
                                    name="service" 
                                    required 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 appearance-none text-base text-slate-600 cursor-pointer"
                                    value={form.service} 
                                    onChange={handleServiceChange}
                                >
                                    <option value="">Select a Service Category</option>
                                    {servicesList.map((service) => (
                                        <option key={service.id} value={service.title}>{service.title}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                        {/* 2. Sub Services (Conditional Animation) */}
                        <AnimatePresence>
                            {form.service && selectedServiceObj && selectedServiceObj.sub_services.length > 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Specific Requirements (Select Multiple)</label>
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                                        {selectedServiceObj.sub_services.map((sub) => (
                                            <label key={sub.id} className={`flex items-start gap-3 cursor-pointer p-2.5 rounded-lg transition border ${form.sub_services.includes(sub.title) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'}`}>
                                                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${form.sub_services.includes(sub.title) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                                                    {form.sub_services.includes(sub.title) && <Check size={14} className="text-white" />}
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden"
                                                    checked={form.sub_services.includes(sub.title)}
                                                    onChange={() => handleSubServiceChange(sub.title)}
                                                />
                                                <span className={`text-sm leading-snug ${form.sub_services.includes(sub.title) ? 'text-blue-800 font-medium' : 'text-slate-600'}`}>
                                                    {sub.title}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 text-right italic">
                                        {form.sub_services.length > 0 ? `${form.sub_services.length} services selected` : "Select one or more"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 3. Timeline */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">When do you need this? *</label>
                            <div className="relative">
                                <select 
                                    name="timeline" 
                                    required 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 appearance-none text-base text-slate-600 cursor-pointer"
                                    value={form.timeline} 
                                    onChange={handleChange}
                                >
                                    <option value="">Select Timeline</option>
                                    <option value="Immediately">Immediately (Urgent)</option>
                                    <option value="Within 1 Month">Within 1 Month</option>
                                    <option value="1-3 Months">1-3 Months</option>
                                    <option value="Just Exploring">Just Exploring / Budgeting</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Additional Details</label>
                        <textarea 
                          name="message" rows="3" placeholder="Any specific challenges or goals?"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition resize-none text-base"
                          value={form.message} onChange={handleChange}
                        ></textarea>
                    </div>

                    <button 
                        type="submit" disabled={status === "sending"}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2 active:scale-95"
                    >
                        {status === "sending" ? <Loader2 className="animate-spin" /> : "Request Consultation"}
                    </button>
                    
                    {status === "success" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium border border-green-200">
                            Thank you! Our team will review your {form.service} request and contact you shortly.
                        </motion.div>
                    )}
                    {status === "error" && (
                        <p className="text-red-600 text-center font-medium">Something went wrong. Please try again.</p>
                    )}
                </form>
            </motion.div>

            {/* ii. Map Integration */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="h-[400px] md:h-full md:min-h-[600px] bg-slate-200 rounded-3xl overflow-hidden shadow-lg border border-slate-200 relative group"
            >
                <iframe 
                    src={content?.map_embed_url || "https://www.google.com/maps/embed?pb=..."} 
                    width="100%" height="100%" 
                    style={{ border: 0, filter: "grayscale(20%) contrast(1.2) opacity(0.9)" }} 
                    allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    className="group-hover:filter-none transition-all duration-500"
                ></iframe>
            </motion.div>
        </div>

        {/* 3. OFFICE ADDRESSES */}
        <div>
            <div className="text-center mb-8 md:mb-12">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Our Locations</span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">Visit Our Offices</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 justify-center max-w-4xl mx-auto">
                {addresses?.map((office, index) => (
                    <motion.div 
                        key={office.id}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all text-center group"
                    >
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <MapPin size={28} />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4">{office.title}</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed text-sm">{office.address}</p>
                        <div className="space-y-3 pt-6 border-t border-slate-50">
                            <a href={`tel:${office.phone}`} className="flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium text-sm md:text-base">
                                <Phone size={16} /> {office.phone}
                            </a>
                            <a href={`mailto:${office.email}`} className="flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium text-sm md:text-base">
                                <Mail size={16} /> {office.email}
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* 4. SUPPORT (Updated Ticket Modal Trigger) */}
        <section className="bg-slate-900 text-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-blue-200 text-xs md:text-sm font-semibold mb-6">
                    <LifeBuoy size={16} /> Help Center
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-6">{content?.support_title}</h2>
                <p className="text-slate-400 mb-10 md:mb-12 text-base md:text-lg">{content?.support_text}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <button 
                        onClick={() => setIsTicketOpen(true)}
                        className="bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition cursor-pointer group text-center w-full active:scale-95"
                    >
                        <Ticket size={32} className="mx-auto mb-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-lg md:text-xl mb-2">Raise a Ticket</h3>
                        <p className="text-xs md:text-sm text-slate-400">Technical issue? Submit a ticket.</p>
                    </button>

                    <a href="mailto:support@xpertai.global" className="bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition cursor-pointer group active:scale-95 block">
                        <Mail size={32} className="mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-lg md:text-xl mb-2">Email Support</h3>
                        <p className="text-xs md:text-sm text-slate-400">support@xpertai.global</p>
                    </a>

                    <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition cursor-pointer group active:scale-95 w-full">
                        <MessageSquare size={32} className="mx-auto mb-4 text-green-400 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-lg md:text-xl mb-2">Live Chat</h3>
                        <p className="text-xs md:text-sm text-slate-400">Talk to our AI assistant.</p>
                    </button>
                </div>
            </div>
        </section>

      </div>

      {/* Ticket Modal */}
      <TicketModal isOpen={isTicketOpen} onClose={() => setIsTicketOpen(false)} />
    </div>
  );
}

// --- TICKET MODAL COMPONENT ---
function TicketModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", priority: "medium", description: "" });
    const [status, setStatus] = useState("idle");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");
        try {
            await submitTicket(formData);
            setStatus("success");
            setTimeout(() => {
                onClose();
                setStatus("idle");
                setFormData({ name: "", email: "", subject: "", priority: "medium", description: "" });
            }, 3000);
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
                <motion.div 
                    initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                    className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto" 
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition bg-slate-100 p-1 rounded-full">
                        <X size={20} />
                    </button>

                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <Ticket className="text-yellow-500" /> Raise a Ticket
                    </h3>
                    <p className="text-slate-500 text-sm mb-6">Describe your issue, our tech team will resolve it.</p>

                    {status === "success" ? (
                        <div className="text-center py-10">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                            </motion.div>
                            <h4 className="text-xl font-bold text-slate-800">Ticket Created!</h4>
                            <p className="text-slate-500 mt-2">We'll update you via email shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Name</label>
                                    <input required type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base focus:border-blue-500 focus:outline-none transition"
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                                    <input required type="email" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base focus:border-blue-500 focus:outline-none transition"
                                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
                                <input required type="text" placeholder="e.g. Login Issue" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base focus:border-blue-500 focus:outline-none transition"
                                    value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Priority</label>
                                <div className="relative">
                                    <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base focus:border-blue-500 focus:outline-none appearance-none transition"
                                        value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                                        <option value="low">Low - General Query</option>
                                        <option value="medium">Medium - System Issue</option>
                                        <option value="high">High - Critical Failure</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                                <textarea required rows="4" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base focus:border-blue-500 focus:outline-none transition resize-none"
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>

                            <button type="submit" disabled={status === "sending"} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition flex justify-center items-center gap-2 shadow-lg disabled:opacity-70 active:scale-95">
                                {status === "sending" ? <Loader2 className="animate-spin" size={20} /> : "Submit Ticket"}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
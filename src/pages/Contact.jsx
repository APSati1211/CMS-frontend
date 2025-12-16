import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Ticket, LifeBuoy, X, Check, Loader2, ChevronDown } from "lucide-react";
import { getContactPageData, submitLead, submitTicket, getServices } from "../api"; 
import { useChat } from "../context/ChatContext"; 
import { useLocation } from "react-router-dom"; // 👈 IMPORT THIS

export default function Contact() {
  const { openChat } = useChat();
  const location = useLocation(); // 👈 HOOK TO READ URL
  const [data, setData] = useState(null);
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", service: "", sub_services: [], timeline: "", message: "" });
  const [status, setStatus] = useState(null);

  // 1. DATA FETCHING
  useEffect(() => {
    Promise.all([getContactPageData(), getServices()])
      .then(([pageRes, servicesRes]) => {
        setData(pageRes.data);
        setServicesList(servicesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Data load error:", err);
        setLoading(false);
      });
  }, []);

  // 2. CHECK URL FOR TICKET ACTION
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("action") === "ticket") {
        setIsTicketOpen(true);
    }
  }, [location]);

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleServiceChange = (e) => {
    setForm({ ...form, service: e.target.value, sub_services: [] });
  };

  const handleSubServiceChange = (subServiceTitle) => {
    setForm(prev => {
        const exists = prev.sub_services.includes(subServiceTitle);
        if (exists) return { ...prev, sub_services: prev.sub_services.filter(s => s !== subServiceTitle) };
        return { ...prev, sub_services: [...prev.sub_services, subServiceTitle] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const payload = { ...form, sub_services: form.sub_services.join(", "), source: "website" };
      await submitLead(payload); 
      setStatus("success");
      setForm({ name: "", company: "", email: "", phone: "", service: "", sub_services: [], timeline: "", message: "" });
    } catch (error) { 
      setStatus("error"); 
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white text-slate-600">Loading...</div>;

  const { content, addresses } = data || {};
  const selectedServiceObj = servicesList.find(s => s.title === form.service);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. HERO SECTION */}
      <div className="relative pt-32 pb-20 md:pt-44 md:pb-32 bg-slate-50 text-slate-900 text-center px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-purple-200/50 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-6xl font-bold mb-4 relative z-10"
        >
          {content?.hero_title || "Get in Touch"}
        </motion.h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto relative z-10 px-2">
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
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Send size={24} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">{content?.form_title || "Send a Message"}</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Name *</label>
                            <input type="text" name="name" required placeholder="John Doe" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-base" value={form.name} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Company</label>
                            <input type="text" name="company" placeholder="Business Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-base" value={form.company} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                            <input type="email" name="email" required placeholder="john@example.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-base" value={form.email} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone *</label>
                            <input type="tel" name="phone" required placeholder="+91 98765 43210" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-base" value={form.phone} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">I am interested in... *</label>
                        <div className="relative">
                            <select name="service" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 appearance-none text-base text-slate-600 cursor-pointer" value={form.service} onChange={handleServiceChange}>
                                <option value="">Select a Service Category</option>
                                {servicesList.map((service) => (
                                    <option key={service.id} value={service.title}>{service.title}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={20} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {form.service && selectedServiceObj && selectedServiceObj.sub_services.length > 0 && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Specific Requirements</label>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                                    {selectedServiceObj.sub_services.map((sub) => (
                                        <label key={sub.id} className={`flex items-start gap-3 cursor-pointer p-2.5 rounded-lg transition border ${form.sub_services.includes(sub.title) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'}`}>
                                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${form.sub_services.includes(sub.title) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                                                {form.sub_services.includes(sub.title) && <Check size={14} className="text-white" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={form.sub_services.includes(sub.title)} onChange={() => handleSubServiceChange(sub.title)} />
                                            <span className={`text-sm leading-snug ${form.sub_services.includes(sub.title) ? 'text-blue-800 font-medium' : 'text-slate-600'}`}>{sub.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Timeline *</label>
                        <div className="relative">
                            <select name="timeline" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 appearance-none text-base text-slate-600 cursor-pointer" value={form.timeline} onChange={handleChange}>
                                <option value="">Select Timeline</option>
                                <option value="Immediately">Immediately (Urgent)</option>
                                <option value="Within 1 Month">Within 1 Month</option>
                                <option value="1-3 Months">1-3 Months</option>
                                <option value="Just Exploring">Just Exploring / Budgeting</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={20} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                        <textarea name="message" rows="3" placeholder="Details..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition resize-none text-base" value={form.message} onChange={handleChange}></textarea>
                    </div>

                    <button type="submit" disabled={status === "sending"} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex justify-center items-center gap-2 active:scale-95">
                        {status === "sending" ? <Loader2 className="animate-spin" /> : "Request Consultation"}
                    </button>
                    
                    {status === "success" && <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium border border-green-200">Message Sent!</div>}
                </form>
            </motion.div>

            {/* ii. Map */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="h-[400px] md:h-full md:min-h-[600px] bg-slate-200 rounded-3xl overflow-hidden shadow-lg border border-slate-200 relative group"
            >
                <iframe src={content?.map_embed_url} width="100%" height="100%" style={{ border: 0, filter: "grayscale(20%) contrast(1.2) opacity(0.9)" }} allowFullScreen="" loading="lazy" className="group-hover:filter-none transition-all duration-500"></iframe>
            </motion.div>
        </div>

        {/* 3. LOCATIONS */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 justify-center max-w-4xl mx-auto">
            {addresses?.map((office, index) => (
                <div key={office.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition">
                    <MapPin size={28} className="text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{office.title}</h3>
                    <p className="text-slate-600 mb-6 text-sm">{office.address}</p>
                    <div className="space-y-2">
                         <div className="text-slate-500 text-sm"><Phone size={14} className="inline mr-2"/>{office.phone}</div>
                         <div className="text-slate-500 text-sm"><Mail size={14} className="inline mr-2"/>{office.email}</div>
                    </div>
                </div>
            ))}
        </div>

        {/* 4. SUPPORT - LIGHT THEME */}
        <section className="bg-slate-100 text-slate-900 rounded-[2rem] p-8 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-blue-600 border border-slate-200 text-xs md:text-sm font-semibold mb-6">
                    <LifeBuoy size={16} /> Help Center
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-6">{content?.support_title}</h2>
                <p className="text-slate-600 mb-10 md:mb-12 text-base md:text-lg">{content?.support_text}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <button onClick={() => setIsTicketOpen(true)} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 transition shadow-sm">
                        <Ticket size={32} className="mx-auto mb-4 text-yellow-500" />
                        <h3 className="font-bold text-lg mb-2">Raise a Ticket</h3>
                    </button>
                    <a href="mailto:support@xpertai.global" className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 transition shadow-sm block">
                        <Mail size={32} className="mx-auto mb-4 text-blue-500" />
                        <h3 className="font-bold text-lg mb-2">Email Support</h3>
                    </a>
                    <button onClick={openChat} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 transition shadow-sm">
                        <MessageSquare size={32} className="mx-auto mb-4 text-green-500" />
                        <h3 className="font-bold text-lg mb-2">Live Chat</h3>
                    </button>
                </div>
            </div>
        </section>

      </div>
      <TicketModal isOpen={isTicketOpen} onClose={() => setIsTicketOpen(false)} />
    </div>
  );
}

// ... (TicketModal component kept same)
function TicketModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", priority: "medium", description: "" });
    const [status, setStatus] = useState("idle");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... submit logic ...
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4"><X size={20}/></button>
                    <h3 className="text-xl font-bold mb-4">Raise a Ticket</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input placeholder="Subject" className="w-full p-2 border rounded" required />
                        <textarea placeholder="Description" className="w-full p-2 border rounded" rows="4" required />
                        <button className="w-full bg-slate-900 text-white py-2 rounded font-bold">Submit</button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
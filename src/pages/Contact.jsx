import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Ticket, LifeBuoy } from "lucide-react";
import { getContactPageData, submitLead } from "../api"; 

export default function Contact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Restore all fields
  const [form, setForm] = useState({ 
    name: "", 
    company: "",
    email: "", 
    phone: "",
    service: "",
    message: "" 
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getContactPageData()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Contact data error:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // Source set to 'website' to show in Website Leads
      await submitLead({ ...form, source: "website" }); 
      setStatus("success");
      setForm({ name: "", company: "", email: "", phone: "", service: "", message: "" });
    } catch (error) { 
      console.error("Lead submission error:", error);
      setStatus("error"); 
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const { content, addresses } = data || {};

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION */}
      <div className="bg-slate-900 text-white pt-40 pb-24 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-4 relative z-10"
        >
          {content?.hero_title}
        </motion.h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto relative z-10">{content?.hero_subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        
        {/* 2. FORM & MAP GRID */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* i. Contact Form */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                        <Send size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{content?.form_title}</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Name & Company */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Name *</label>
                            <input 
                              type="text" name="name" required placeholder="John Doe"
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                              value={form.name} onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Company</label>
                            <input 
                              type="text" name="company" placeholder="Business Name"
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                              value={form.company} onChange={handleChange} 
                            />
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                            <input 
                              type="email" name="email" required placeholder="john@example.com"
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                              value={form.email} onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone *</label>
                            <input 
                              type="tel" name="phone" required placeholder="+91 98765 43210"
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                              value={form.phone} onChange={handleChange} 
                            />
                        </div>
                    </div>

                    {/* Service */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Service of Interest</label>
                        <input 
                          type="text" name="service" placeholder="e.g. Virtual CFO, Audit"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                          value={form.service} onChange={handleChange} 
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                        <textarea 
                          name="message" rows="4" placeholder="Tell us more about your requirements..."
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition resize-none"
                          value={form.message} onChange={handleChange}
                        ></textarea>
                    </div>

                    <button 
                        type="submit" disabled={status === "sending"}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2"
                    >
                        {status === "sending" ? "Sending..." : "Submit Request"}
                    </button>
                    
                    {status === "success" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium border border-green-200">
                            Thank you! We have received your details.
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
                className="h-full min-h-[600px] bg-slate-200 rounded-3xl overflow-hidden shadow-lg border border-slate-200 relative group"
            >
                <iframe 
                    src={content?.map_embed_url} 
                    width="100%" height="100%" 
                    style={{ border: 0, filter: "grayscale(20%) contrast(1.2) opacity(0.9)" }} 
                    allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    className="group-hover:filter-none transition-all duration-500"
                ></iframe>
            </motion.div>
        </div>

        {/* 3. OFFICE ADDRESSES */}
        <div>
            <div className="text-center mb-12">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Our Locations</span>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">Visit Our Offices</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
                {addresses?.map((office, index) => (
                    <motion.div 
                        key={office.id}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all text-center group"
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">{office.title}</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed text-sm">{office.address}</p>
                        <div className="space-y-3 pt-6 border-t border-slate-50">
                            <a href={`tel:${office.phone}`} className="flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium">
                                <Phone size={16} /> {office.phone}
                            </a>
                            <a href={`mailto:${office.email}`} className="flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium">
                                <Mail size={16} /> {office.email}
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* 4. SUPPORT */}
        <section className="bg-slate-900 text-white rounded-[2.5rem] p-10 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-blue-200 text-sm font-semibold mb-6">
                    <LifeBuoy size={16} /> Help Center
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{content?.support_title}</h2>
                <p className="text-slate-400 mb-12 text-lg">{content?.support_text}</p>
                
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition cursor-pointer group">
                        <Ticket size={40} className="mx-auto mb-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-xl mb-2">Raise a Ticket</h3>
                        <p className="text-sm text-slate-400">Technical issue? Submit a ticket.</p>
                    </div>

                    <a href="mailto:support@xpertai.global" className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition cursor-pointer group">
                        <Mail size={40} className="mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-xl mb-2">Email Support</h3>
                        <p className="text-sm text-slate-400">support@xpertai.global</p>
                    </a>

                    <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition cursor-pointer group">
                        <MessageSquare size={40} className="mx-auto mb-4 text-green-400 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-xl mb-2">Live Chat</h3>
                        <p className="text-sm text-slate-400">Talk to our AI assistant.</p>
                    </button>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}
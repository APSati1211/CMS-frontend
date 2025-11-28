import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ArrowUpRight } from "lucide-react";
import usePageContent from "../hooks/usePageContent";
import { submitLead } from "../api";

export default function Contact() {
  const { getField, loading } = usePageContent("contact");
  
  const [form, setForm] = useState({ 
    name: "", 
    company: "", 
    email: "", 
    phone: "", 
    service: "", 
    message: "" 
  });
  
  const [status, setStatus] = useState(null);

  // --- DYNAMIC FORM TEXTS ---
  const formTitle = getField("form_title", "title") || "Start Your Transformation";
  const formSubtext = getField("form_subtext") || "Fill out the form below, and our team will get in touch with a tailored plan.";
  const buttonText = getField("form_button_text", "title") || "Submit Request";
  const successMessage = getField("form_success_msg") || "Thank you! Your request has been received. We will contact you shortly.";
  
  const contactInfo = {
    email: getField("email") || "support@xpertai.global",
    phone: getField("phone") || "+91 98765 43210",
    address: getField("address") || "123 Corporate Avenue, Mumbai, India",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitLead({ ...form, source: "website" }); 
      setStatus("success");
      setForm({ name: "", company: "", email: "", phone: "", service: "", message: "" });
    } catch (error) { 
      console.error("Lead submission error:", error);
      setStatus("error"); 
    }
  };

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  if (loading) return <div className="text-center py-20 text-2xl text-blue-600">Loading Content...</div>;

  return (
    // FIX: Removed 'pt-20' from here to remove the white gap at top
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section 
          FIX: Added 'pt-32' (Padding Top) here inside the dark background.
          Now the dark color goes behind the Navbar, but text starts lower down.
      */}
      <div className="bg-slate-900 text-white pt-32 pb-24 text-center px-6">
        <h1 className="text-5xl font-bold mb-3">{getField("contact_header", "title") || "Let's Talk Business"}</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">{getField("contact_subtext") || "We'd love to hear about your financial automation challenges."}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden p-0">

            {/* Column 1: Info Panel */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5 }}
                className="bg-slate-800 text-white p-10 lg:p-12 space-y-8 flex flex-col justify-between"
            >
                <div className="space-y-6">
                    <h3 className="text-3xl font-bold mb-4">{getField("info_title", "title") || "Contact Details"}</h3>
                    <p className="text-gray-300">{getField("info_text") || "Reach out for project collaborations or specific service inquiries."}</p>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-4">
                            <Mail size={20} className="text-yellow-400 shrink-0" />
                            <div><p className="font-semibold">Email Support</p><p className="text-sm text-gray-400">{contactInfo.email}</p></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone size={20} className="text-yellow-400 shrink-0" />
                            <div><p className="font-semibold">Phone (Primary)</p><p className="text-sm text-gray-400">{contactInfo.phone}</p></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPin size={20} className="text-yellow-400 shrink-0" />
                            <div><p className="font-semibold">Office Address</p><p className="text-sm text-gray-400">{contactInfo.address}</p></div>
                        </div>
                    </div>
                </div>

                {contactInfo.mapLink && (
                    <a 
                        href={contactInfo.mapLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                        {contactInfo.mapButton} <ArrowUpRight size={16} />
                    </a>
                )}
            </motion.div>

            {/* Column 2 & 3: Contact Form */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 p-10 lg:p-12"
            >
                <h3 className="text-3xl font-bold text-slate-800 mb-2">{formTitle}</h3>
                <p className="text-gray-500 mb-8">{formSubtext}</p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div className="grid md:grid-cols-2 gap-5">
                        <input 
                          type="text" name="name" placeholder="Full Name" required 
                          className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 transition" 
                          onChange={handleChange} value={form.name} 
                        />
                        <input 
                          type="text" name="company" placeholder="Company Name" 
                          className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 transition" 
                          onChange={handleChange} value={form.company} 
                        />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-5">
                        <input 
                          type="email" name="email" placeholder="Work Email" required 
                          className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 transition" 
                          onChange={handleChange} value={form.email} 
                        />
                        <input 
                          type="tel" name="phone" placeholder="Phone Number" required 
                          className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 transition" 
                          onChange={handleChange} value={form.phone} 
                        />
                    </div>
                    
                    <input 
                      type="text" name="service" placeholder="Service of Interest (e.g. Virtual CFO, Audit)" 
                      className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 transition" 
                      onChange={handleChange} value={form.service} 
                    />

                    <textarea 
                      rows="5" name="message" placeholder="Tell us more about your requirements..." 
                      className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 transition" 
                      onChange={handleChange} value={form.message}
                    ></textarea>
                    
                    <button type="submit" disabled={status === "sending"} className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30">
                        {status === "sending" ? "Submitting..." : <><Send size={18} /> {buttonText}</>}
                    </button>
                    
                    {status === "success" && <p className="text-green-600 font-semibold text-center mt-4">{successMessage}</p>}
                    {status === "error" && <p className="text-red-600 font-semibold text-center mt-4">Submission failed. Please try again.</p>}
                </form>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
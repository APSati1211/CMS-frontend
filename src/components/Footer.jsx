import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, Twitter, Linkedin, Instagram, 
  ArrowUpRight, Mail, MapPin, Phone, 
  Loader2, CheckCircle, MessageSquare, Ticket, FileText 
} from "lucide-react";
import axios from "axios";

export default function Footer({ logo }) {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/";
      await axios.post(`${API_URL}subscribers/`, { email });
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // --- DATA STRUCTURE AS PER DOCUMENT ---
  
  const companyLinks = [
    { name: "About Us", path: "/about" },
    { name: "Our Team", path: "/about" }, // Mapped to About page
    { name: "Careers", path: "/careers" },
    { name: "Advisory Board", path: "/about" }, // Mapped to About page
  ];

  const resourceLinks = [
    { name: "All from Resources", path: "/resources" }
  ];

  const serviceLinks = [
    { name: "Virtual CFO", path: "/services/virtual-cfo" },
    { name: "Audit & Assurance", path: "/services/audit-assurance" },
    { name: "Taxation Services", path: "/services/taxation-services" },
    { name: "All from Services", path: "/services" },
  ];

  const solutionLinks = [
    { name: "Tech-Enabled Solutions", path: "/solutions" },
    { name: "Startup Support", path: "/solutions" },
    { name: "Wealth Management", path: "/solutions" },
    { name: "All from Solutions", path: "/solutions" },
  ];

  const usefulLinks = [
    { name: "All Acts and Rules", path: "/resources" }
  ];

  const otherLinks = [
    { name: "Contact Us", path: "/contact", icon: Phone },
    { name: "Live Chat", path: "/contact", icon: MessageSquare }, // Or trigger chatbot
    { name: "Raise a Ticket", path: "/contact", icon: Ticket },
    { name: "Offices Address", path: "/contact", icon: MapPin },
    { name: "View on Map", path: "https://maps.google.com", icon: ArrowUpRight, external: true },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Use", path: "/terms-and-conditions" },
    { name: "Refund Policy", path: "/refund-policy" }, // New page link
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-white/5 relative overflow-hidden font-sans">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        
        {/* TOP ROW: LOGO & NEWSLETTER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-white/5 pb-12">
            <div className="max-w-md">
                {logo ? (
                  <img src={logo} alt="XpertAI Global" className="h-10 mb-4 object-contain" />
                ) : (
                  <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    XpertAI <span className="text-blue-500">Global</span>
                  </h2>
                )}
                <p className="text-slate-400 text-sm leading-relaxed">
                  Empowering global enterprises with next-gen financial intelligence, automated auditing, and strategic foresight.
                </p>
            </div>

            <div className="w-full md:w-auto">
                <p className="text-xs text-slate-500 mb-2 uppercase font-bold tracking-wider">Subscribe to Updates</p>
                <form onSubmit={handleSubscribe} className="flex">
                  <input 
                    type="email" 
                    placeholder="Enter email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2.5 text-sm text-white w-full md:w-64 focus:outline-none focus:border-blue-500 transition"
                    disabled={status === "sending" || status === "success"}
                  />
                  <button 
                    type="submit" 
                    disabled={status === "sending" || status === "success"}
                    className={`px-4 py-2.5 rounded-r-lg text-white transition flex items-center justify-center ${
                      status === "success" ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {status === "sending" ? <Loader2 size={18} className="animate-spin" /> : status === "success" ? <CheckCircle size={18} /> : <ArrowUpRight size={18} />}
                  </button>
                </form>
            </div>
        </div>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          
          {/* COLUMN 1: Company & Resources */}
          <div className="space-y-8">
            <div>
                <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-blue-500 pl-3">Company</h3>
                <ul className="space-y-3 text-sm">
                  {companyLinks.map((item) => (
                    <li key={item.name}>
                      <Link to={item.path} className="hover:text-blue-400 transition-colors block">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
            <div>
                <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-purple-500 pl-3">Resources</h3>
                <ul className="space-y-3 text-sm">
                  {resourceLinks.map((item) => (
                    <li key={item.name}>
                      <Link to={item.path} className="hover:text-blue-400 transition-colors block text-blue-300">
                        {item.name} →
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
          </div>

          {/* COLUMN 2: Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-blue-500 pl-3">Services</h3>
            <ul className="space-y-3 text-sm">
              {serviceLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-blue-400 transition-colors block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Solutions & Useful Links */}
          <div className="space-y-8">
            <div>
                <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-blue-500 pl-3">Solutions</h3>
                <ul className="space-y-3 text-sm">
                  {solutionLinks.map((item) => (
                    <li key={item.name}>
                      <Link to={item.path} className="hover:text-blue-400 transition-colors block">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
            <div>
                <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-green-500 pl-3">Useful Links</h3>
                <ul className="space-y-3 text-sm">
                  {usefulLinks.map((item) => (
                    <li key={item.name}>
                      <Link to={item.path} className="hover:text-blue-400 transition-colors block flex items-center gap-2">
                        <FileText size={14} /> {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
          </div>

          {/* COLUMN 4: Others (Contact & Legal) */}
          <div className="space-y-8">
            <div>
                <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-blue-500 pl-3">Others</h3>
                <ul className="space-y-3 text-sm">
                  {otherLinks.map((item) => (
                    <li key={item.name}>
                        {item.external ? (
                            <a href={item.path} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                {item.icon && <item.icon size={14} className="text-slate-500 group-hover:text-blue-400" />}
                                {item.name}
                            </a>
                        ) : (
                            <Link to={item.path} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                {item.icon && <item.icon size={14} className="text-slate-500 group-hover:text-blue-400" />}
                                {item.name}
                            </Link>
                        )}
                    </li>
                  ))}
                </ul>
            </div>
            
            <div className="pt-4 border-t border-white/5">
                <ul className="space-y-2 text-xs text-slate-500">
                    {legalLinks.map((item) => (
                        <li key={item.name}>
                            <Link to={item.path} className="hover:text-slate-300 transition-colors">
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & SOCIALS */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {currentYear} XpertAI Global. All rights reserved.</p>
          <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="bg-white/5 hover:bg-blue-600 p-2 rounded-full text-white transition-all hover:-translate-y-1">
                  <Icon size={16} />
                </a>
              ))}
            </div>
        </div>
      </div>
    </footer>
  );
}
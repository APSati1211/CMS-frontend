import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { getBrandingSettings } from "../api"; // API import

export default function Navbar({ logo: propLogo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [branding, setBranding] = useState(null); // State for dynamic names
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    // Fetch Header Names from Backend
    getBrandingSettings().then(res => {
        setBranding(res.data);
    }).catch(err => console.log("Header load error", err));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Dynamic Links from Backend or Fallback ---
  const mainLinks = [
    { name: branding?.nav_about_label || "About", path: "/about" },
    { name: branding?.nav_services_label || "Services", path: "/services" },
    { name: branding?.nav_solutions_label || "Solutions", path: "/solutions" },
    { name: branding?.nav_careers_label || "Careers", path: "/careers" },
    { name: branding?.nav_resources_label || "Resources", path: "/resources" },
  ];

  const ctaLabel = branding?.nav_cta_label || "Get Started";
  const displayLogo = branding?.logo || propLogo;

  return (
    <>
      {/* 🔹 ANNOUNCEMENT BAR (Optional) */}
      {branding?.show_announcement && (
        <div className="bg-purple-600 text-white text-xs md:text-sm font-bold text-center py-2 px-4 relative z-[61]">
            {branding.announcement_text}
            {branding.announcement_link && (
                <Link to={branding.announcement_link} className="ml-2 underline hover:text-purple-200">Learn More</Link>
            )}
        </div>
      )}

      {/* 🔹 NAVBAR HEADER */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed ${branding?.show_announcement ? 'top-[36px] md:top-[40px]' : 'top-0'} w-full z-[60] transition-all duration-300 border-b border-transparent ${
          isOpen 
            ? "bg-white border-slate-200" 
            : scrolled 
              ? "bg-white/90 backdrop-blur-xl border-slate-200 shadow-sm py-3" 
              : "bg-transparent py-4 md:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="relative z-50" onClick={() => setIsOpen(false)}>
            {displayLogo ? (
              <motion.img 
                src={displayLogo} 
                alt="Logo" 
                whileHover={{ scale: 1.05 }}
                className="h-8 md:h-12 object-contain" 
              />
            ) : (
              <motion.div className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  {branding?.site_title || "XpertAI"}
                </span>
              </motion.div>
            )}
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8">
            {mainLinks.map((link) => (
              <Link key={link.path} to={link.path} className="relative group py-2">
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  location.pathname === link.path ? "text-blue-600" : "text-slate-600 group-hover:text-slate-900"
                }`}>
                  {link.name}
                </span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                  location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
            ))}

            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg ml-2 hover:bg-slate-800 transition-colors"
              >
                {ctaLabel}
              </motion.button>
            </Link>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button 
            className="lg:hidden p-2 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* 🔹 MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-white z-[50] lg:hidden flex flex-col pt-24 px-6 pb-10 overflow-y-auto"
          >
            <div className="flex flex-col space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Menu</div>
              
              {mainLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-xl text-lg font-medium transition-all ${
                      location.pathname === link.path 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                    <ExternalLink size={18} className="opacity-30" />
                  </Link>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 pt-8 border-t border-slate-100"
              >
                <Link 
                  to="/contact" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-slate-900 text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg"
                >
                  {ctaLabel}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
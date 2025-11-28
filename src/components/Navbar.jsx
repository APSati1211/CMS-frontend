import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Navbar({ logo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [dynamicPages, setDynamicPages] = useState([]);
  const location = useLocation();

  // --- Scroll Logic ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // Fetch dynamic pages
    axios.get("http://127.0.0.1:8000/api/pages/")
      .then(res => setDynamicPages(res.data))
      .catch(err => console.error("Menu fetch error", err));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Body Lock ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const mainLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Careers", path: "/careers" },
    { name: "Resources", path: "/resources" },
  ];

  const dropdownLinks = [
    { name: "Stakeholders", path: "/stakeholders" },
    { name: "Blog", path: "/blog" },
    { name: "Lead System", path: "/lead-system" },
    ...dynamicPages.map(page => ({ name: page.title, path: `/${page.slug}` }))
  ];

  return (
    <>
      {/* 🔹 NAVBAR HEADER (Fixed "Old Look" - Slate 900) */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className={`fixed top-0 w-full z-[60] transition-all duration-300 border-b border-transparent ${
          isOpen 
            ? "bg-slate-900 border-white/10" 
            : scrolled 
              ? "bg-slate-900/90 backdrop-blur-xl border-white/10 shadow-2xl py-3" 
              : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="relative z-50" onClick={() => setIsOpen(false)}>
            {logo ? (
              <motion.img 
                src={logo} 
                alt="XpertAI Global" 
                whileHover={{ scale: 1.05 }}
                className="h-10 md:h-12 object-contain" 
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-extrabold tracking-tighter flex items-center gap-2"
              >
                {/* Fixed Gradient Text */}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">
                  XpertAI
                </span>
                <span className="text-white">Global</span>
              </motion.div>
            )}
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {mainLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="relative group py-2"
              >
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  location.pathname === link.path ? "text-blue-400" : "text-slate-300 group-hover:text-white"
                }`}>
                  {link.name}
                </span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 shadow-[0_0_10px_#3b82f6] ${
                  location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
            ))}

            {/* DROPDOWN */}
            <div 
              className="relative group"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors py-2">
                More <ChevronDown size={14} className={`transition-transform duration-300 ${hovered ? "rotate-180 text-blue-400" : ""}`} />
              </button>

              <AnimatePresence>
                {hovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] overflow-hidden ring-1 ring-white/20"
                  >
                    <div className="p-2 space-y-1">
                      <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Explore More
                      </div>
                      {dropdownLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/10 rounded-xl transition-all group/item"
                        >
                          {link.name}
                          <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-blue-400" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(59, 130, 246, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                // Fixed Gradient Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-bold text-sm border border-white/20 shadow-lg ml-2"
              >
                Get Started
              </motion.button>
            </Link>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button 
            className="md:hidden text-white p-2 relative focus:outline-none hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} className="text-red-400" /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* 🔹 MOBILE MENU OVERLAY (Fixed "Old Look" Colors) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed inset-0 bg-slate-900 z-[50] md:hidden flex flex-col pt-24 px-6 overflow-y-auto"
          >
            <div className="flex flex-col space-y-2 pb-10">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Menu</div>
              
              {[...mainLinks, ...dropdownLinks].map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Link 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-xl text-lg font-medium transition-all border border-transparent ${
                      location.pathname === link.path 
                        ? "bg-blue-600/20 text-blue-400 border-blue-500/30" 
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.name}
                    <ExternalLink size={18} className="opacity-30 group-hover:opacity-100" />
                  </Link>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 pt-8 border-t border-white/10"
              >
                <Link 
                  to="/contact" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
                >
                  Get Started Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
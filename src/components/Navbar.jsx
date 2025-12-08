import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ logo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // --- Scroll Logic ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Body Lock (Prevent scroll when menu is open) ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const mainLinks = [
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Solutions", path: "/solutions" },
    { name: "Careers", path: "/careers" },
    { name: "Resources", path: "/resources" },
  ];

  return (
    <>
      {/* 🔹 NAVBAR HEADER */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className={`fixed top-0 w-full z-[60] transition-all duration-300 border-b border-transparent ${
          isOpen 
            ? "bg-slate-900 border-white/10" 
            : scrolled 
              ? "bg-slate-900/90 backdrop-blur-xl border-white/10 shadow-2xl py-3" 
              : "bg-transparent py-4 md:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="relative z-50" onClick={() => setIsOpen(false)}>
            {logo ? (
              <motion.img 
                src={logo} 
                alt="XpertAI Global" 
                whileHover={{ scale: 1.05 }}
                className="h-8 md:h-12 object-contain" 
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-xl md:text-2xl font-extrabold tracking-tighter flex items-center gap-2"
              >
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">
                  XpertAI
                </span>
                <span className="text-white">Global</span>
              </motion.div>
            )}
          </Link>

          {/* DESKTOP MENU (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-8">
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

            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(59, 130, 246, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-bold text-sm border border-white/20 shadow-lg ml-2"
              >
                Get Started
              </motion.button>
            </Link>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button 
            className="lg:hidden text-white p-2 relative focus:outline-none hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} className="text-red-400" /> : <Menu size={28} />}
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
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-slate-900 z-[50] lg:hidden flex flex-col pt-24 px-6 pb-10 overflow-y-auto"
          >
            <div className="flex flex-col space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Menu</div>
              
              {mainLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
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
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSolutionsPageData } from "../api"; 
import * as LucideIcons from "lucide-react";
import { ArrowRight, CheckCircle2, Sparkles, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export default function Solutions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSolutionsPageData()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Solutions fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Helper for dynamic icons
  const renderIcon = (iconName, size=24, className="") => {
    const IconComponent = LucideIcons[iconName] || LucideIcons.Layers;
    return <IconComponent size={size} className={className} />;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-950 text-blue-500 font-bold tracking-widest animate-pulse">
        LOADING EXPERIENCE...
    </div>
  );

  // Destructure content and solutions list
  const { content, solutions } = data || {};

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      {/* 1. HERO SECTION (Redesigned) */}
      <div className="relative bg-slate-900 text-white pt-48 pb-40 px-6 text-center overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[80px] animate-blob"></div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <Sparkles size={16} className="text-yellow-400" />
            <span className="text-sm font-medium text-slate-300">Intelligent Ecosystems</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400">
              {content?.hero_title || "Our Solutions"}
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {content?.hero_subtitle || "Tailored ecosystems for every stakeholder in the financial world."}
          </p>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex justify-center gap-4"
          >
             <button onClick={() => document.getElementById('cards-grid').scrollIntoView({behavior: 'smooth'})} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-900/50 transition-all hover:scale-105 flex items-center gap-2">
                Explore Now <ArrowRight size={20} />
             </button>
          </motion.div>
        </motion.div>
      </div>

      {/* 2. SOLUTIONS GRID (Glassmorphism Cards) */}
      <div id="cards-grid" className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {solutions?.map((card, i) => (
            <motion.div 
              key={card.id} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }} 
              className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] hover:border-blue-200 transition-all duration-300 group flex flex-col relative overflow-hidden"
            >
              {/* Decorative Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm ring-1 ring-slate-100 group-hover:ring-blue-500 group-hover:rotate-3">
                  {renderIcon(card.icon_name, 32)}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors">
                  {card.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed mb-8 min-h-[80px]">
                  {card.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {/* Mock Features list for visual density */}
                  <li className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 size={16} className="text-green-500" /> Dedicated Dashboard
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 size={16} className="text-green-500" /> AI Insights
                  </li>
                </ul>

                {/* UPDATED LINK: Changed from "/register" to "/contact" 
                   Also added logic to use 'card.link' if it exists in your API data 
                */}
                <Link 
                    to={card.link || "/contact"} 
                    className="inline-flex items-center text-slate-900 font-bold group-hover:text-blue-600 transition-colors mt-auto"
                >
                    Get Started <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}

        </div>
      </div>

      {/* 3. CTA SECTION (Dark Modern) */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="relative bg-slate-900 rounded-[2.5rem] p-12 md:p-20 overflow-hidden text-center shadow-2xl">
              {/* Abstract shapes */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>

              <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    {content?.cta_title || "Ready to join the ecosystem?"}
                  </h2>
                  <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                    {content?.cta_text || "Whether you are a client looking for experts or a professional seeking work, XpertAI has a place for you."}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                      <Link to="/contact" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg hover:shadow-white/20 transform hover:-translate-y-1">
                          Sign Up Now
                      </Link>
                      <Link to="/contact" className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition backdrop-blur-sm">
                          Contact Sales
                      </Link>
                      {/* LEAD SYSTEM LINK */}
                      <Link to="/lead-system" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-600/40 transition border border-white/10">
                          Explore Lead System
                      </Link>
                  </div>
              </div>
          </div>
      </section>

    </div>
  );
}
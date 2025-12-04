import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStakeholders } from "../api"; // Assuming this API call exists from previous setup
import * as LucideIcons from "lucide-react";
import { ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Solutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStakeholders()
      .then((res) => {
        setSolutions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Solutions fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Helper for dynamic icons
  const renderIcon = (iconName, size=24, className="") => {
    const IconComponent = LucideIcons[iconName] || LucideIcons.Users;
    return <IconComponent size={size} className={className} />;
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-600 animate-pulse">Loading Solutions...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white pt-40 pb-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
          className="text-5xl md:text-6xl font-bold mb-6 relative z-10"
        >
          Our Solutions
        </motion.h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto relative z-10">
          Tailored ecosystems for every stakeholder in the financial world.
        </p>
      </div>

      {/* 2. SOLUTIONS GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          
          {solutions.length > 0 ? (
            solutions.map((card, i) => (
              <motion.div 
                key={card.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }} 
                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                  {renderIcon(card.icon_name, 40)}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8 flex-grow">{card.description}</p>
                
                <Link to="/register" className="mt-auto inline-flex items-center text-blue-600 font-bold hover:underline">
                    Get Started <ArrowRight size={18} className="ml-2" />
                </Link>
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-400">Loading Solutions...</p>
          )}

        </div>
      </div>

      {/* 3. CTA SECTION */}
      <section className="mt-24 max-w-5xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-4">Ready to join the ecosystem?</h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                  Whether you are a client looking for experts or a professional seeking work, XpertAI has a place for you.
              </p>
              <div className="flex gap-4 justify-center">
                  <Link to="/register" className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition">
                      Sign Up Now
                  </Link>
                  <Link to="/contact" className="border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition">
                      Contact Sales
                  </Link>
              </div>
          </div>
      </section>

    </div>
  );
}
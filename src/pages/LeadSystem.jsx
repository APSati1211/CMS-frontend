import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLeadSystemData } from "../api";
import * as LucideIcons from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function LeadSystem() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeadSystemData()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const { hero, features, dashboard, cta } = data || {};

  const renderIcon = (name) => {
    const Icon = LucideIcons[name] || LucideIcons.Star;
    return <Icon size={32} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white pt-32 pb-24 text-center px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-6">
            CRM & Automation
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {hero?.title}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {hero?.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-16 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features?.map((item, i) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 hover:shadow-2xl transition-all"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                {renderIcon(item.icon_name)}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Section with Dashboard Image */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose Our System?</h2>
            <ul className="space-y-4">
              {["Centralized Lead Database", "Automated Email Sequences", "Performance Analytics Dashboard", "Seamless Integration with Existing Tools"].map((point, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-green-500" size={20} /> {point}
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* DASHBOARD PREVIEW */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="bg-slate-100 rounded-3xl p-4 border border-slate-200 shadow-inner h-64 md:h-80 flex items-center justify-center overflow-hidden relative"
          >
            {dashboard?.image ? (
              <img 
                src={dashboard.image} 
                alt={dashboard.placeholder_text} 
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <p className="text-slate-400 font-medium text-lg text-center px-4">
                {dashboard?.placeholder_text || "Dashboard Preview (Upload in Admin)"}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      {cta && (
        <div className="max-w-5xl mx-auto px-6 mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-12 md:p-16 rounded-3xl text-center shadow-2xl relative overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">{cta.title}</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">{cta.text}</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg relative z-10">
              {cta.button_text} <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServicesPageData } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ArrowRight, Plus, Minus, Star, Briefcase, ChevronRight } from "lucide-react";

export default function Services() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    getServicesPageData()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Services data error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Services...</div>;

  const { hero, process, features, testimonials, faq, cta, services_list } = data || {};

  // Helper for dynamic icons with fallback
  const renderIcon = (iconName, size=24, className="") => {
    const Icon = LucideIcons[iconName] || LucideIcons.Briefcase;
    return <Icon size={size} className={className} />;
  };

  return (
    <div className="bg-slate-50 overflow-x-hidden">
      
      {/* 1. HERO */}
      <div className="relative pt-40 pb-32 bg-slate-900 text-white overflow-hidden text-center px-6">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <motion.h1 
           initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
           className="text-5xl md:text-6xl font-bold mb-6 relative z-10"
         >
           {hero?.title || "Our Expertise"}
         </motion.h1>
         <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 relative z-10">
           {hero?.subtitle || "Comprehensive financial solutions tailored for your growth."}
         </p>
      </div>

      {/* 2. SERVICES GRID (Main List) - Updated to 4 Columns */}
      <div className="max-w-[90rem] mx-auto px-6 py-24 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services_list?.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 group flex flex-col hover:shadow-2xl transition-all h-full"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {renderIcon(service.icon, 28)}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
              <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">{service.short_description}</p>
              
              <Link 
                to={`/services/${service.slug}`} 
                className="inline-flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-2 transition-transform mt-auto"
              >
                View Details <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. PROCESS - Updated to 4 Columns */}
      <section className="py-20 bg-white">
        <div className="max-w-[90rem] mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {process?.map((step, i) => (
                    <div key={i} className="text-center relative px-4">
                        <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600 shadow-md">
                            {renderIcon(step.icon_name, 32)}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{step.step_number}. {step.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 4. FEATURES */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            {features?.map((feat, i) => (
                <div key={i} className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                    {renderIcon(feat.icon_name, 32, "text-blue-400 mb-4")}
                    <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                    <p className="text-slate-400">{feat.description}</p>
                </div>
            ))}
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
            {faq?.map((item, index) => (
                <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <button 
                        onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                        className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 hover:bg-slate-50 transition"
                    >
                        {item.question}
                        {activeAccordion === index ? <Minus size={20} className="text-blue-600" /> : <Plus size={20} />}
                    </button>
                    <AnimatePresence>
                        {activeAccordion === index && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="px-5 pb-5 text-slate-600">
                                {item.answer}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
      </section>

      {/* 6. CTA */}
      {cta && (
        <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-12 text-center shadow-2xl">
                <h2 className="text-3xl font-bold mb-4">{cta.title}</h2>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto">{cta.text}</p>
                <Link to="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition shadow-lg">
                    {cta.button_text}
                </Link>
            </div>
        </section>
      )}
    </div>
  );
}
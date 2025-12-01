import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getHomeData } from "../api"; // <--- Updated Import
import * as LucideIcons from "lucide-react";
import { ArrowRight, Plus, Minus, Star } from "lucide-react";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    // Direct API function use kar rahe hain (No process.env here)
    getHomeData()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Home data fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-600 animate-pulse">
        Loading XpertAI Experience...
    </div>
  );

  const { content, clients, stats, process, features, testimonials, faq } = data || {};

  const renderIcon = (iconName, size=24, className="") => {
    const IconComponent = LucideIcons[iconName] || LucideIcons.Star;
    return <IconComponent size={size} className={className} />;
  };

  return (
    <div className="bg-slate-50 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-32 bg-slate-900 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-6 tracking-wide">
                    Future of Financial Intelligence
                </span>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400 drop-shadow-sm">
                    {content?.hero_title || "Next-Gen Financial Intelligence"}
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                    {content?.hero_subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/contact" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:scale-105">
                        {content?.hero_cta_text || "Get Started"} <ArrowRight size={20} />
                    </Link>
                    <Link to="/services" className="px-8 py-4 rounded-full font-bold border border-slate-600 hover:border-white text-slate-300 hover:text-white transition-all hover:bg-white/5">
                        Explore Services
                    </Link>
                </div>
            </motion.div>

            {content?.hero_image && (
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-16 relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20"></div>
                    <img src={content.hero_image} alt="Dashboard" className="relative rounded-xl shadow-2xl border border-slate-700/50 mx-auto w-full max-w-4xl" />
                </motion.div>
            )}
        </div>
      </section>

      {/* 2. TRUSTED CLIENTS */}
      {content?.clients_title && clients?.length > 0 && (
        <section className="py-12 bg-white border-b border-slate-100 overflow-hidden">
            <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">{content.clients_title}</p>
            <div className="flex gap-12 animate-scroll w-max items-center">
                {[...clients, ...clients].map((client, i) => (
                    <div key={i} className="flex-shrink-0 opacity-60 hover:opacity-100 transition grayscale hover:grayscale-0">
                        {client.logo ? (
                            <img src={client.logo} alt={client.name} className="h-12 w-auto object-contain" />
                        ) : (
                            <span className="text-xl font-bold text-slate-400">{client.name}</span>
                        )}
                    </div>
                ))}
            </div>
        </section>
      )}

      {/* 3. STATS */}
      <section className="py-20 bg-slate-50 container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats?.map((stat, i) => (
                <motion.div 
                    key={stat.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.1 }}
                    className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
                >
                    <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                        {stat.value}
                    </h3>
                    <p className="text-slate-500 font-medium">{stat.label}</p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* 4. PROCESS */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{content?.process_title || "How It Works"}</h2>
                <p className="text-slate-500 text-lg">{content?.process_subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 z-0"></div>
                {process?.map((step, i) => (
                    <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="relative z-10 text-center group"
                    >
                        <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-slate-50 shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                            {renderIcon(step.icon_name, 32, "text-blue-600")}
                        </div>
                        <span className="block text-6xl font-black text-slate-100 absolute top-0 left-1/2 -translate-x-1/2 -z-10 select-none">
                            {step.step_number}
                        </span>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                        <p className="text-slate-500 leading-relaxed px-4">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* 5. FEATURES */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{content?.features_title || "Why Choose Us"}</h2>
                    <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
                </div>
                <Link to="/services" className="text-blue-300 hover:text-white flex items-center gap-2 transition">
                    View All Features <ArrowRight size={18} />
                </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features?.map((feat, i) => (
                    <motion.div 
                        key={feat.id}
                        whileHover={{ y: -5 }}
                        className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/50 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 text-blue-400 group-hover:text-white transition">
                            {renderIcon(feat.icon_name, 24)}
                        </div>
                        <h3 className="text-lg font-bold mb-3">{feat.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      {testimonials?.length > 0 && (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">{content?.reviews_title || "Client Stories"}</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {testimonials.map((testi, i) => (
                        <div key={testi.id} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative">
                            <div className="text-blue-500 mb-4 flex gap-1">
                                {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-slate-700 text-lg italic mb-6">"{testi.quote}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                                    {testi.image ? (
                                        <img src={testi.image} alt={testi.author_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">{testi.author_name?.[0]}</span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{testi.author_name}</h4>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">{testi.role}, {testi.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* 7. FAQ */}
      {faq?.length > 0 && (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">{content?.faq_title || "FAQ"}</h2>
                <div className="space-y-4">
                    {faq.map((item, index) => (
                        <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden">
                            <button 
                                onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition text-left"
                            >
                                <span className="font-semibold text-slate-800">{item.question}</span>
                                {activeAccordion === index ? <Minus size={20} className="text-blue-600" /> : <Plus size={20} className="text-slate-400" />}
                            </button>
                            <AnimatePresence>
                                {activeAccordion === index && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }} 
                                        animate={{ height: "auto", opacity: 1 }} 
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-200"
                                    >
                                        <div className="p-5 text-slate-600 leading-relaxed bg-white">
                                            {item.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* 8. CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto bg-slate-900 rounded-[2.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-30"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{content?.cta_title}</h2>
                <p className="text-lg md:text-xl text-slate-300 mb-10">{content?.cta_text}</p>
                <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-slate-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-transform hover:scale-105 shadow-lg">
                    {content?.cta_btn_text || "Get Started"} <ArrowRight size={20} />
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getHomeData } from "../api";
import * as LucideIcons from "lucide-react";
import { 
  ArrowRight, Minus, Plus, Star, 
  Cpu, Link as LinkIcon, Bot, ArrowDownCircle, 
  User, CheckCircle, Briefcase, UserPlus, Search 
} from "lucide-react";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [selectorStep, setSelectorStep] = useState(0);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
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

  const handleSelectorClick = (role) => {
    setUserRole(role);
    setSelectorStep(1);
  };

  const getRecommendation = () => {
    if (userRole === "client") return { text: "Explore our Virtual CFO & Audit Services", link: "/services" };
    if (userRole === "professional") return { text: "Join as a Verified Partner", link: "/careers" };
    return { text: "Get Started", link: "/contact" };
  };

  const renderIcon = (iconName, size=24, className="") => {
    if (iconName === "Link") return <LinkIcon size={size} className={className} />;
    const IconComponent = LucideIcons[iconName] || LucideIcons.Star;
    return <IconComponent size={size} className={className} />;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-blue-400 font-mono animate-pulse">
        Initializing XpertAI Global...
    </div>
  );

  const { content, clients, services, case_studies, testimonials, faq, process } = data || {};

  const stepColors = [
      "bg-blue-50 text-blue-600",
      "bg-purple-50 text-purple-600",
      "bg-green-50 text-green-600",
      "bg-orange-50 text-orange-600"
  ];

  return (
    <div className="bg-slate-50 overflow-x-hidden font-sans">
      
      {/* 1. HERO BANNER - Optimized for Mobile */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 bg-slate-900 text-white overflow-hidden px-4">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto relative z-10 text-center max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                
                <div className="inline-flex flex-wrap justify-center items-center gap-2 py-1 px-4 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] md:text-sm font-semibold mb-6 md:mb-8 backdrop-blur-md">
                    <span className="flex items-center gap-1"><Cpu size={12} /> AI-Powered</span> <span className="opacity-30">|</span> 
                    <span className="flex items-center gap-1"><Bot size={12} /> Automated</span> <span className="opacity-30">|</span> 
                    <span className="flex items-center gap-1"><LinkIcon size={12} /> Blockchain</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400 drop-shadow-sm">
                    {content?.hero_title || "Future of Financial Outsourcing"}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
                    {content?.hero_subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto px-4 sm:px-0">
                    <Link to="/contact" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 group">
                        {content?.hero_cta_text || "Get Started"} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-4 rounded-full font-bold border border-slate-600 hover:border-white text-slate-300 hover:text-white transition-all hover:bg-white/5 active:scale-95 flex items-center justify-center gap-2">
                        How It Works <ArrowDownCircle size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
      </section>

      {/* 2. HOW IT WORKS - Stacked on Mobile */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{content?.process_title || "Automation Flow"}</h2>
                <p className="text-slate-500 max-w-2xl mx-auto px-4">{content?.process_subtitle || "Seamlessly connecting your needs to verified experts."}</p>
            </div>

            {process && process.length > 0 ? (
                <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                    {/* Connecting Line (Hidden on Mobile) */}
                    <div className="hidden md:block absolute top-12 left-[12%] w-[76%] h-1 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 -z-10"></div>

                    {process.map((step, i) => (
                        <motion.div 
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center text-center group bg-slate-50 md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none border md:border-0 border-slate-100"
                        >
                            <div className={`w-20 h-20 md:w-24 md:h-24 ${stepColors[i % stepColors.length]} rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300 relative`}>
                                {renderIcon(step.icon_name, 32, "stroke-[1.5]")}
                                
                                {i < process.length - 1 && (
                                    <div className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2 text-slate-300">
                                        <ArrowRight size={24} />
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-lg md:text-xl font-bold text-slate-800">{step.title}</h3>
                            <p className="text-sm text-slate-500 mt-2 font-medium leading-snug">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400">Loading process steps...</p>
            )}
        </div>
      </section>

      {/* 3. KEY SERVICES - Grid Updated */}
      {services && services.length > 0 && (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-12 text-center md:text-left">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Our Key Services</h2>
                        <p className="text-slate-500">End-to-end financial solutions for modern enterprises.</p>
                    </div>
                    <Link to="/services" className="mt-4 md:mt-0 flex items-center text-blue-600 font-bold hover:translate-x-1 transition-transform">
                        View All Services <ArrowRight size={20} className="ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, i) => (
                        <motion.div 
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 group"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {renderIcon(service.icon, 24)}
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                            <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">{service.short_description}</p>
                            <Link to={`/services/${service.slug}`} className="text-blue-600 font-bold text-sm flex items-center group-hover:underline">
                                Explore <ArrowRight size={16} className="ml-1" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* 4. AI SERVICE SELECTOR - Responsive */}
      <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="text-center lg:text-left">
                    <span className="text-blue-400 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">AI Recommendation Engine</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Not sure where to start?</h2>
                    <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
                        Let our AI-powered selector guide you to the perfect financial solution tailored to your role and needs.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Instant Match</span>
                        <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Personalized</span>
                    </div>
                </div>

                <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-6 md:p-10 border border-slate-200">
                    <AnimatePresence mode="wait">
                        {selectorStep === 0 ? (
                            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h3 className="text-xl md:text-2xl font-bold mb-6">I am a...</h3>
                                <div className="space-y-4">
                                    <button onClick={() => handleSelectorClick('client')} className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition flex items-center gap-4 group">
                                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 flex-shrink-0"><User size={24} /></div>
                                        <div>
                                            <div className="font-bold text-sm md:text-base group-hover:text-blue-700">Business / Client</div>
                                            <div className="text-xs text-slate-500">Looking for financial services</div>
                                        </div>
                                        <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" size={20}/>
                                    </button>
                                    <button onClick={() => handleSelectorClick('professional')} className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition flex items-center gap-4 group">
                                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600 flex-shrink-0"><Briefcase size={24} /></div>
                                        <div>
                                            <div className="font-bold text-sm md:text-base group-hover:text-purple-700">Professional / Freelancer</div>
                                            <div className="text-xs text-slate-500">Looking for work opportunities</div>
                                        </div>
                                        <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" size={20}/>
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 animate-bounce">
                                    <Bot size={32} />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold mb-2">We Recommend:</h3>
                                <p className="text-slate-600 mb-8 px-4">{getRecommendation().text}</p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link to={getRecommendation().link} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition w-full sm:w-auto">Proceed</Link>
                                    <button onClick={() => setSelectorStep(0)} className="text-slate-500 font-medium hover:text-slate-800 py-3 sm:py-0">Back</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS & CASE STUDIES */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
             <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 md:mb-8 border-l-4 border-blue-500 pl-4">What Our Clients Say</h3>
                    <div className="space-y-6">
                        {testimonials?.slice(0,2).map((testi, i) => (
                            <div key={i} className="bg-slate-50 p-6 md:p-8 rounded-2xl relative">
                                <div className="text-yellow-400 flex mb-4"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                                <p className="text-slate-700 italic mb-6 text-base md:text-lg">"{testi.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                                        {testi.author_name[0]}
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-900 block text-sm md:text-base">{testi.author_name}</span>
                                        <span className="text-xs text-slate-500 uppercase font-semibold">{testi.role}, {testi.company}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 md:mb-8 border-l-4 border-green-500 pl-4">Success Stories</h3>
                    <div className="space-y-4">
                        {case_studies?.map((study, i) => (
                            <Link key={i} to="/resources" className="flex items-center gap-4 md:gap-6 p-4 rounded-xl hover:bg-slate-50 transition group border border-transparent hover:border-slate-100">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-xl flex-shrink-0 flex flex-col items-center justify-center text-green-700 border border-green-100">
                                    <span className="font-bold text-lg md:text-xl">{study.result_stat.split(' ')[0]}</span>
                                    <span className="text-[9px] md:text-[10px] uppercase font-semibold">Growth</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-base md:text-lg text-slate-800 group-hover:text-green-700 transition">{study.title}</h4>
                                    <p className="text-xs md:text-sm text-slate-500 font-medium mb-1">{study.client_name}</p>
                                    <p className="text-xs md:text-sm text-slate-400 line-clamp-1">{study.summary}</p>
                                </div>
                                <ArrowRight className="ml-auto text-slate-300 group-hover:text-green-600 opacity-0 group-hover:opacity-100 transition-all hidden sm:block" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 6. QUICK LINKS - Stacked on Mobile */}
      <section className="py-16 md:py-20 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 md:mb-12">Get Started Today</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Link to="/contact" className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/20 hover:bg-white hover:text-blue-700 transition-all group hover:-translate-y-1">
                    <div className="bg-white/20 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <UserPlus size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Sign Up</h3>
                    <p className="text-blue-100 group-hover:text-slate-600 text-sm">Create your client account and start outsourcing.</p>
                </Link>
                <Link to="/services" className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/20 hover:bg-white hover:text-blue-700 transition-all group hover:-translate-y-1">
                    <div className="bg-white/20 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <Search size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Explore Services</h3>
                    <p className="text-blue-100 group-hover:text-slate-600 text-sm">Browse our AI-driven financial solutions.</p>
                </Link>
                <Link to="/careers" className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/20 hover:bg-white hover:text-blue-700 transition-all group hover:-translate-y-1">
                    <div className="bg-white/20 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <Briefcase size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Join as Professional</h3>
                    <p className="text-blue-100 group-hover:text-slate-600 text-sm">Apply to become a verified expert partner.</p>
                </Link>
            </div>
        </div>
      </section>

      {/* 7. FAQ */}
      {faq && faq.length > 0 && (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12 text-slate-900">{content?.faq_title || "Frequently Asked Questions"}</h2>
                <div className="space-y-4">
                    {faq.map((item, index) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <button onClick={() => setActiveAccordion(activeAccordion === index ? null : index)} className="w-full flex items-center justify-between p-5 md:p-6 text-left font-semibold text-slate-800 hover:bg-slate-50 transition text-sm md:text-base">
                                {item.question}
                                {activeAccordion === index ? <Minus size={20} className="text-blue-600 flex-shrink-0" /> : <Plus size={20} className="text-slate-400 flex-shrink-0" />}
                            </button>
                            <AnimatePresence>
                                {activeAccordion === index && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="px-5 md:px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                                        {item.answer}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}

    </div>
  );
}
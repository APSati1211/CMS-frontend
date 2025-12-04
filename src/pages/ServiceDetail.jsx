import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceBySlug } from "../api";
import { ArrowLeft, CheckCircle2, Calendar, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getServiceBySlug(slug)
      .then((res) => {
        setService(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-600 animate-pulse">
        Loading Service Details...
    </div>
  );
  
  if (!service) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
        <Link to="/services" className="text-blue-600 hover:underline">Back to Services</Link>
    </div>
  );

  const renderIcon = (iconName) => {
    const Icon = LucideIcons[iconName] || LucideIcons.Briefcase;
    return <Icon size={40} className="text-blue-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-32 bg-slate-900 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
        
        <div className="container mx-auto px-6 relative z-10">
            <Link to="/services" className="inline-flex items-center text-blue-300 hover:text-white mb-8 transition-colors group">
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Services
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <div className="mb-6 inline-block p-3 bg-slate-800 rounded-2xl border border-slate-700">
                        {renderIcon(service.icon)}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400">
                        {service.title}
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed mb-8 border-l-4 border-blue-500 pl-4">
                        {service.short_description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/contact" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 flex items-center gap-2">
                            Get Started <ArrowRight size={18} />
                        </Link>
                    </div>
                </motion.div>

                {/* Hero Visual */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20"></div>
                    <div className="relative bg-slate-800 rounded-2xl border border-slate-700 p-8 aspect-video flex flex-col justify-center items-center text-center">
                        <LucideIcons.Layers size={64} className="text-slate-600 mb-4" />
                        <p className="text-slate-500 font-mono">Service Visual Placeholder</p>
                    </div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA (DYNAMIC SUB-SERVICES) */}
      <section className="py-20 px-6">
        <div className="container mx-auto grid lg:grid-cols-3 gap-12">
            
            {/* Left Content: Sub-Services List */}
            <div className="lg:col-span-2 space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <ShieldCheck className="text-blue-600" /> What We Offer
                    </h2>
                    
                    {/* Optional Intro Text */}
                    {service.full_description && (
                        <div className="prose prose-lg text-slate-600 mb-8" dangerouslySetInnerHTML={{ __html: service.full_description }} />
                    )}

                    {/* DYNAMIC LIST RENDERED HERE */}
                    <div className="space-y-6">
                        {service.sub_services && service.sub_services.length > 0 ? (
                            service.sub_services.map((sub, index) => (
                                <motion.div 
                                    key={sub.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{sub.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{sub.description}</p>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-slate-500 italic">Detailed service breakdown coming soon.</p>
                        )}
                    </div>

                </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                    <h3 className="text-xl font-bold mb-6">Why Choose XpertAI?</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="text-blue-400 shrink-0 mt-1" size={20} />
                            <span className="text-slate-300 text-sm">AI-Driven Precision & Speed</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="text-blue-400 shrink-0 mt-1" size={20} />
                            <span className="text-slate-300 text-sm">Bank-Grade Data Security</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="text-blue-400 shrink-0 mt-1" size={20} />
                            <span className="text-slate-300 text-sm">24/7 Expert Support</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-100 text-center">
                    <Calendar size={48} className="text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Book a Consultation</h3>
                    <p className="text-slate-500 mb-6 text-sm">Speak with our financial experts to tailor this service for you.</p>
                    <Link to="/contact" className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl transition">
                        Schedule Call
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* 3. BOTTOM CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Optimize Your Workflow?</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                    Take the first step towards financial automation with XpertAI.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-lg transform hover:-translate-y-1">
                    Get Custom Quote <ArrowRight size={20} />
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
}
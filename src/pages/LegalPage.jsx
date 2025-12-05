import { useEffect, useState } from "react";
import { getLegalPageData } from "../api"; 
import { motion } from "framer-motion";
import { Calendar, ShieldCheck, ArrowLeft, Loader2, AlertCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function LegalPage({ slug }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLegalPageData(slug)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 size={40} className="text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading Policy...</p>
    </div>
  );

  if (error || !data) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
        <Link to="/" className="text-blue-600 hover:underline flex items-center gap-2">
            <ArrowLeft size={20} /> Back to Home
        </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. HERO HEADER */}
      <div className="relative bg-slate-900 text-white pt-40 pb-32 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        {/* Animated Blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]"></div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-4xl mx-auto"
        >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
                <ShieldCheck size={14} /> Official Document
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              {data.title}
            </h1>
            
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Calendar size={16} />
                <span>Last Updated: <span className="text-white font-medium">{new Date(data.last_updated).toLocaleDateString()}</span></span>
            </div>
        </motion.div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20 pb-24 space-y-8">
        
        {/* Intro / Description Card */}
        {data.description && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
            >
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    {data.description}
                </p>
            </motion.div>
        )}

        {/* Dynamic Sections Loop */}
        <div className="space-y-6">
            {data.sections && data.sections.length > 0 ? (
                data.sections.map((section, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                        {/* Section Header */}
                        <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-start gap-4">
                            <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{section.heading}</h3>
                        </div>

                        {/* Section Content */}
                        <div className="p-6 md:p-8">
                            <article className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-blue-600">
                                {/* Agar content me line breaks hain to unhe preserve karne ke liye */}
                                <div className="whitespace-pre-line">{section.content}</div>
                            </article>
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <FileText size={48} className="mx-auto mb-2 opacity-50"/>
                    <p>No content sections available.</p>
                </div>
            )}
        </div>

        {/* Footer Link */}
        <div className="text-center pt-8">
            <Link to="/contact" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition flex items-center justify-center gap-2">
                Questions about these terms? Contact Us <ArrowLeft size={14} className="rotate-180" />
            </Link>
        </div>

      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { getResourcesPageData } from "../api";
import { motion } from "framer-motion";
import { FileText, Download, ArrowRight, ExternalLink, BookOpen, BarChart3 } from "lucide-react";

export default function Resources() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResourcesPageData()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Resources data fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Resources...</div>;

  const { hero, titles, case_studies, downloads } = data || {};

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="bg-slate-900 text-white pt-40 pb-32 text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6 relative z-10"
        >
          {hero?.title}
        </motion.h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto relative z-10">
          {hero?.subtitle}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        
        {/* 2. CASE STUDIES */}
        {case_studies?.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <BarChart3 size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">{titles?.case_studies_title || "Success Stories"}</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {case_studies.map((cs, i) => (
                <motion.div 
                  key={cs.id} 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} 
                  className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <FileText size={100} />
                  </div>

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{cs.title}</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">{cs.client_name}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200">
                        {cs.result_stat}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 mb-8 leading-relaxed relative z-10">{cs.summary}</p>
                  
                  {cs.pdf_file && (
                    <a 
                        href={cs.pdf_file} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 transition relative z-10 group/link"
                    >
                      Read Full Story <ArrowRight size={18} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 3. DOWNLOADS & GUIDES */}
        {downloads?.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <BookOpen size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">{titles?.downloads_title || "Downloads"}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {downloads.map((res, i) => (
                <motion.div 
                  key={res.id} 
                  whileHover={{ y: -8 }} 
                  className="bg-white rounded-2xl shadow-md border border-slate-200 flex flex-col overflow-hidden"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                        {res.resource_type}
                        </span>
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-slate-800">{res.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{res.description}</p>
                  </div>
                  
                  <div className="p-6 pt-0 mt-auto border-t border-slate-100 bg-slate-50/50">
                    {res.file ? (
                        <a 
                        href={res.file} 
                        download 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-md active:scale-95"
                        >
                        <Download size={18} /> Download Now
                        </a>
                    ) : res.external_link ? (
                        <a 
                        href={res.external_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95"
                        >
                        <ExternalLink size={18} /> Read More
                        </a>
                    ) : (
                        <button disabled className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl cursor-not-allowed text-sm font-medium">
                        Coming Soon
                        </button>
                    )}
                  </div>

                </motion.div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
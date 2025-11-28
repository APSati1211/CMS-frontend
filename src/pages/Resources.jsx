import { useEffect, useState } from "react";
import { getResourcesPageData } from "../api";
import { motion } from "framer-motion";
import { FileText, Download, ArrowRight } from "lucide-react";

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

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // Destructure safely
  const { hero, titles, case_studies, downloads } = data || {};

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Section */}
      {hero && (
        <div className="bg-slate-900 text-white py-32 text-center px-6">
          <h1 className="text-4xl font-bold mb-4">{hero.title}</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">{hero.subtitle}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 mt-16 space-y-20">
        
        {/* Case Studies Section */}
        {case_studies && case_studies.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <FileText className="text-blue-600" /> 
              {titles?.case_studies_title || "Success Stories"}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {case_studies.map((cs, i) => (
                <motion.div 
                  key={cs.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }} 
                  className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-500"
                >
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800">{cs.title}</h3>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{cs.result_stat}</span>
                  </div>
                  <p className="text-slate-600 mb-6">{cs.summary}</p>
                  {cs.pdf_file && (
                    <a href={cs.pdf_file} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                      Read Case Study <ArrowRight size={16} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Downloads Section */}
        {downloads && downloads.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <Download className="text-purple-600" /> 
              {titles?.downloads_title || "Downloads"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {downloads.map((res, i) => (
                <motion.div 
                  key={res.id} 
                  whileHover={{ y: -5 }} 
                  className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded uppercase">
                      {res.resource_type}
                    </span>
                    <h3 className="font-bold text-lg mt-3 mb-2 text-slate-800">{res.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{res.description}</p>
                  </div>
                  
                  {res.file ? (
                    <a 
                      href={res.file} 
                      download 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-all shadow-md active:scale-95"
                    >
                      <Download size={18} /> Download Now
                    </a>
                  ) : (
                    <button disabled className="w-full bg-gray-200 text-gray-400 py-2 rounded-lg cursor-not-allowed text-sm">
                      File Not Available
                    </button>
                  )}

                </motion.div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
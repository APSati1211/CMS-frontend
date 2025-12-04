import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Link import for navigation
import { getResourcesPageData } from "../api";
import { motion } from "framer-motion";
import { 
    FileText, Download, ArrowRight, ExternalLink, 
    BookOpen, BarChart3, Link as LinkIcon, Newspaper 
} from "lucide-react";

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

  const { hero, titles, latest_blogs, case_studies, downloads, useful_links } = data || {};

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="bg-slate-900 text-white pt-40 pb-32 text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6 relative z-10"
        >
          {hero?.title || "Knowledge Hub"}
        </motion.h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto relative z-10">
          {hero?.subtitle || "Insights, templates, and tools to empower your financial journey."}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        
        {/* --- SECTION 1: LATEST BLOGS (New) --- */}
        {latest_blogs?.length > 0 && (
            <section>
                <div className="flex justify-between items-end mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                            <Newspaper size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Latest Insights</h2>
                            <p className="text-slate-500 text-sm mt-1">Updates on Tax, Compliance & Finance</p>
                        </div>
                    </div>
                    <Link to="/blog" className="hidden md:flex items-center text-blue-600 font-bold hover:translate-x-1 transition-transform">
                        View All Articles <ArrowRight size={20} className="ml-1" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latest_blogs.map((blog, i) => (
                        <motion.div 
                            key={blog.id}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-full group"
                        >
                            {/* Image Area */}
                            <div className="h-40 bg-slate-200 overflow-hidden relative">
                                {blog.image ? (
                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                                        <Newspaper size={32} />
                                    </div>
                                )}
                            </div>
                            
                            {/* Content Area */}
                            <div className="p-5 flex flex-col flex-grow">
                                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 block">
                                    {blog.category?.name || "Update"}
                                </span>
                                <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                                    {blog.short_description}
                                </p>
                                <Link to={`/blog/${blog.slug}`} className="text-blue-600 font-semibold text-sm flex items-center mt-auto">
                                    Read More <ArrowRight size={16} className="ml-1" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link to="/blog" className="inline-block bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-full font-bold hover:bg-slate-50 transition">
                        View All Articles
                    </Link>
                </div>
            </section>
        )}

        {/* --- SECTION 2: CASE STUDIES --- */}
        {case_studies?.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <BarChart3 size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">{titles?.case_studies_title || "Success Stories"}</h2>
                    <p className="text-slate-500 text-sm mt-1">Real results from our partners.</p>
                </div>
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

        {/* --- SECTION 3: DOWNLOADS (TEMPLATES) --- */}
        {downloads?.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <BookOpen size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">{titles?.downloads_title || "Templates & Guides"}</h2>
                    <p className="text-slate-500 text-sm mt-1">Ready-to-use resources for compliance.</p>
                </div>
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

        {/* --- SECTION 4: USEFUL LINKS --- */}
        {useful_links?.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-teal-100 rounded-lg text-teal-600">
                    <LinkIcon size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Useful Links</h2>
                    <p className="text-slate-500 text-sm mt-1">Quick access to government and regulatory portals.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {useful_links.map((link, i) => (
                        <a 
                            key={link.id} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-6 flex items-center justify-between hover:bg-slate-50 transition group border-b border-slate-100 md:border-b-0 last:border-b-0"
                        >
                            <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors pr-4">
                                {link.title}
                            </span>
                            <ExternalLink size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                        </a>
                    ))}
                </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
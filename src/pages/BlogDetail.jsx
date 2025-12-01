import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogBySlug } from "../api";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlogBySlug(slug)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog post:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-600 animate-pulse text-xl font-medium">
        Loading Article...
    </div>
  );

  if (!blog) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
        <Link to="/blog" className="text-blue-600 hover:underline flex items-center gap-2">
            <ArrowLeft size={20} /> Back to Blog
        </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. HERO HEADER */}
      <div className="bg-slate-900 text-white pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
            <Link to="/blog" className="inline-flex items-center text-blue-300 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Articles
            </Link>
            
            {blog.category && (
                <span className="block mb-6">
                    <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                        {blog.category.name}
                    </span>
                </span>
            )}

            <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            >
                {blog.title}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm md:text-base">
                <span className="flex items-center gap-2"><User size={18} className="text-blue-500"/> XpertAI Team</span>
                <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-500"/> {new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="flex items-center gap-2"><Clock size={18} className="text-blue-500"/> 5 min read</span>
            </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT CONTAINER */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
        <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
        >
            {/* Featured Image */}
            {blog.image && (
                <div className="w-full h-64 md:h-96 relative">
                    <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Content Body */}
            <div className="p-8 md:p-16">
                <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-xl">
                    <div dangerouslySetInnerHTML={{ __html: blog.body }} />
                </article>
            </div>
        </motion.div>
      </div>

    </div>
  );
}
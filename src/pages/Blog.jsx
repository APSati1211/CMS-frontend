import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // <--- Import Link
import { getBlogs, getCategories } from "../api"; 
import { motion } from "framer-motion";
import { Calendar, User, List, Search, ArrowRight } from "lucide-react"; 
import usePageContent from "../hooks/usePageContent"; 

export default function Blog() {
  const { getField } = usePageContent("blog"); 
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  
  const [loading, setLoading] = useState(true);

  const handleCategoryClick = (slug) => {
    setSelectedCategory(currentSlug => currentSlug === slug ? null : slug);
  };

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
        getBlogs(selectedCategory, searchQuery)
          .then((res) => { 
            setPosts(res.data); 
          })
          .catch(err => {
              console.error("Error fetching blogs:", err);
          })
          .finally(() => {
            setLoading(false);
          });
    }, 500); 
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]); 
  
  const currentFilterName = categories.find(cat => cat.slug === selectedCategory)?.name;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-24 text-center px-6">
        <h1 className="text-5xl font-bold mb-4">{getField("hero_title", "title") || "Latest Insights"}</h1>
        {searchQuery ? (
            <p className="text-blue-400 font-semibold text-lg mb-2">Searching for: "{searchQuery}"</p>
        ) : selectedCategory ? (
            <p className="text-blue-400 font-semibold text-lg mb-2">Filtered by: {currentFilterName}</p>
        ) : (
            <p className="text-slate-400">{getField("hero_text") || "Trends, news, and expert analysis from XpertAI."}</p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 grid lg:grid-cols-4 gap-12">

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
              <h4 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Search className="text-blue-600" size={28} />
                  {getField("search_placeholder", "title") || "Search"}
              </h4>
              <div className="relative">
                <input 
                    type="text" 
                    placeholder="Type to search..." 
                    className="w-full p-4 pl-5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition text-lg shadow-sm placeholder:text-slate-400 text-slate-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <List size={20} className="text-blue-600"/> 
                {getField("category_title", "title") || "Filter Categories"}
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === null ? 'bg-slate-800 text-white shadow-md' : 'hover:bg-gray-100 text-slate-600'
                  }`}
                >
                  All Articles
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat.slug ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-100 text-slate-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="lg:col-span-3">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">{getField("latest_posts_title", "title") || "Latest Posts"}</h2>
          
          {loading ? (
             <div className="text-center py-20">
                 <p className="text-2xl text-blue-600 font-semibold animate-pulse">Loading articles...</p>
             </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
                <p className="text-xl text-slate-500 font-medium">No articles found matching your criteria.</p>
                {(searchQuery || selectedCategory) && (
                    <button 
                        onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                        className="mt-4 text-blue-600 font-bold hover:underline"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              {posts.map((blog, i) => (
                <motion.div 
                  key={blog.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group border border-slate-100 h-full flex flex-col hover:shadow-2xl transition-all duration-300"
                >
                  {/* LINK 1: Image Click */}
                  <Link to={`/blog/${blog.slug}`} className="h-52 overflow-hidden relative block">
                      {blog.image ? (
                          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                      ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500"></div>
                  </Link>

                  <div className="p-8 flex flex-col flex-grow">
                    {blog.category && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 w-fit border border-blue-100">
                            {blog.category.name || blog.category}
                        </span>
                    )}
                    
                    {/* LINK 2: Title Click */}
                    <Link to={`/blog/${blog.slug}`}>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                            {blog.title}
                        </h3>
                    </Link>

                    <p className="text-slate-500 text-base mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {blog.short_description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs font-medium text-slate-400 border-t border-slate-100 pt-5 mt-auto">
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(blog.created_at).toLocaleDateString()}</span>
                      
                      {/* LINK 3: Text Click */}
                      <Link to={`/blog/${blog.slug}`} className="flex items-center gap-1 text-blue-600 font-bold hover:underline">
                          Read Full Story <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
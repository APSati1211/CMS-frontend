import React, { useEffect, useState } from 'react';
import * as API from '../../../api'; // Ensure this points to src/api/index.js
import { Plus, Edit2, Trash2, Loader2, Save, X, Image as ImageIcon } from 'lucide-react';

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [blogRes, catRes] = await Promise.all([API.getBlogs(), API.getCategories()]);
      // Handle pagination result or direct array
      setBlogs(blogRes.data.results || blogRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error("Failed to load blog data", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this post?")) return;
    try {
        await API.deleteBlog(id);
        // Optimistic update
        setBlogs(prev => prev.filter(b => b.id !== id));
        alert("Blog deleted successfully.");
    } catch (err) { 
        alert("Failed to delete blog."); 
        console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Fix Checkbox: If unchecked, send 'False'
    if (!formData.has('published')) formData.append('published', 'False');
    else formData.set('published', 'True');

    try {
      if (editingBlog.id) {
        await API.updateBlog(editingBlog.id, formData);
      } else {
        await API.createBlog(formData);
      }
      alert("Blog Post Saved!");
      setEditingBlog(null);
      loadData(); // Refresh list to see changes
    } catch (err) {
      console.error(err);
      alert("Error saving blog. Check console for details.");
    }
  };

  if (loading && !editingBlog) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  // --- EDITOR VIEW ---
  if (editingBlog) {
    return (
      <div className="max-w-5xl mx-auto pb-20 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">{editingBlog.id ? 'Edit Blog Post' : 'New Blog Post'}</h2>
          <button onClick={() => setEditingBlog(null)} className="bg-white p-2 rounded-full shadow-sm hover:bg-slate-100 transition"><X size={24} className="text-slate-600"/></button>
        </div>

        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          
          {/* Title & Category */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Post Title</label>
              <input name="title" defaultValue={editingBlog.title} required className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg" placeholder="Enter title..."/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
              <select name="category_id" defaultValue={editingBlog.category?.id} className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">-- Select Category --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cover Image</label>
              <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {editingBlog.image ? (
                      <img src={editingBlog.image} alt="Preview" className="h-24 w-32 object-cover rounded-lg shadow-sm bg-white"/>
                  ) : (
                      <div className="h-24 w-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400"><ImageIcon size={24}/></div>
                  )}
                  <input type="file" name="image" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer"/>
              </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Short Description</label>
            <textarea name="short_description" rows="2" defaultValue={editingBlog.short_description} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Brief summary for the card view..."/>
          </div>

          {/* Main Body */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Content (HTML Supported)</label>
            <textarea name="body" rows="12" defaultValue={editingBlog.body} required className="w-full p-4 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Write your blog content here..."/>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <input type="checkbox" id="published" name="published" defaultChecked={editingBlog.published} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"/>
            <label htmlFor="published" className="font-bold text-slate-700 cursor-pointer select-none">Publish this post immediately?</label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
             <button type="button" onClick={() => setEditingBlog(null)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition">Cancel</button>
             <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg transition transform active:scale-95">
                <Save size={20}/> Save Post
             </button>
          </div>
        </form>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Blog Posts</h1>
            <p className="text-slate-500 mt-1">Manage your articles, news, and updates.</p>
        </div>
        <button onClick={() => setEditingBlog({})} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg transition">
          <Plus size={20}/> Create New Post
        </button>
      </div>

      <div className="grid gap-4">
        {blogs.map(blog => (
          <div key={blog.id} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition group">
            <div className="flex items-center gap-5">
              <img src={blog.image || '/placeholder.png'} alt={blog.title} className="w-20 h-20 rounded-lg object-cover bg-slate-100 border border-slate-100"/>
              <div>
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition">{blog.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-600 border border-slate-200">
                    {blog.category?.name || 'Uncategorized'}
                  </span>
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  <span className={`flex items-center gap-1 font-bold ${blog.published ? "text-emerald-600" : "text-amber-500"}`}>
                    <span className={`w-2 h-2 rounded-full ${blog.published ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0 pl-0 md:pl-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
              <button onClick={() => setEditingBlog(blog)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                <Edit2 size={18}/>
              </button>
              <button onClick={() => handleDelete(blog.id)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                <Trash2 size={18}/>
              </button>
            </div>
          </div>
        ))}
        
        {blogs.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                <p className="text-slate-400 font-medium">No blog posts found.</p>
                <button onClick={() => setEditingBlog({})} className="text-blue-600 font-bold mt-2 hover:underline">Write your first article</button>
            </div>
        )}
      </div>
    </div>
  );
}
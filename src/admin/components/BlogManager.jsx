import React, { useState, useEffect } from 'react';
import { getBlogs, deleteBlog, createBlog } from '../../api';
import { Plus, Edit, Trash2, Search, ExternalLink } from 'lucide-react';

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      setBlogs(res.data);
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this post?")) {
        await deleteBlog(id);
        fetchBlogs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Blog Management</h2>
          <p className="text-slate-500">Publish and manage articles across the site.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">
          <Plus size={20} /> New Article
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase">Article</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase">Category</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase">Date</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{blog.title}</div>
                  <div className="text-xs text-slate-400">slug: {blog.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">
                    {blog.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {new Date(blog.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(blog.id)} className="p-2 text-slate-400 hover:text-red-600 transition"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
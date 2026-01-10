import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as API from '../../api';
import { 
  Users, FileText, MousePointer2, ExternalLink, 
  TrendingUp, MessageSquare, Clock, AlertCircle,
  ArrowRight, Edit3, UploadCloud, Settings, RefreshCw, Layers
} from 'lucide-react';
import { 
  ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Line 
} from 'recharts';

// ============================================================================
// HELPER: DATE & DATA PROCESSING
// ============================================================================

/**
 * Groups leads by date to create chart data.
 * @param {Array} leads - Array of lead objects
 * @param {String} range - '1W' | '1M' | '3M' | '1Y'
 */
const processChartData = (leads, range) => {
  const now = new Date();
  const dataMap = new Map();
  let daysToSubtract = 7;
  let dateFormat = 'weekday'; // 'weekday' | 'day' | 'month'

  // Configure Range
  if (range === '1W') { daysToSubtract = 7; dateFormat = 'weekday'; }
  else if (range === '1M') { daysToSubtract = 30; dateFormat = 'day'; }
  else if (range === '3M') { daysToSubtract = 90; dateFormat = 'week'; }
  else if (range === '1Y') { daysToSubtract = 365; dateFormat = 'month'; }

  // Initialize Map with 0 values for the range to ensure continuous line
  for (let i = daysToSubtract; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    
    let key;
    if (dateFormat === 'weekday') key = d.toLocaleDateString('en-US', { weekday: 'short' });
    else if (dateFormat === 'day') key = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    else if (dateFormat === 'month') key = d.toLocaleDateString('en-US', { month: 'short' });
    else key = `W${Math.ceil(d.getDate() / 7)}`; // Rough week approx

    if (!dataMap.has(key)) {
      dataMap.set(key, { name: key, website: 0, chatbot: 0, total: 0 });
    }
  }

  // Populate with Real Data
  leads.forEach(lead => {
    const leadDate = new Date(lead.created_at);
    // Filter out old data
    const diffTime = Math.abs(now - leadDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= daysToSubtract) {
        let key;
        if (dateFormat === 'weekday') key = leadDate.toLocaleDateString('en-US', { weekday: 'short' });
        else if (dateFormat === 'day') key = leadDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        else if (dateFormat === 'month') key = leadDate.toLocaleDateString('en-US', { month: 'short' });
        else key = `W${Math.ceil(leadDate.getDate() / 7)}`;

        if (dataMap.has(key)) {
            const entry = dataMap.get(key);
            if (lead.source === 'chatbot') entry.chatbot += 1;
            else entry.website += 1;
            entry.total += 1;
        }
    }
  });

  return Array.from(dataMap.values());
};

/**
 * Calculates generic statistics from the data arrays.
 */
const calculateRealStats = (leads, blogs) => {
  // 1. Total Leads
  const totalLeads = leads.length;
  
  // 2. Leads Growth (Last 7 days vs Previous 7 days)
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const thisWeekLeads = leads.filter(l => new Date(l.created_at) >= oneWeekAgo).length;
  const lastWeekLeads = leads.filter(l => new Date(l.created_at) >= twoWeeksAgo && new Date(l.created_at) < oneWeekAgo).length;
  
  let growth = 0;
  if (lastWeekLeads > 0) growth = ((thisWeekLeads - lastWeekLeads) / lastWeekLeads) * 100;
  else if (thisWeekLeads > 0) growth = 100;

  // 3. Blog Count
  const activePages = blogs.length; // Using blogs as a proxy for content activity

  return [
    { 
        label: 'Total Leads', 
        value: totalLeads.toString(), 
        change: `${growth.toFixed(1)}%`, 
        isPositive: growth >= 0,
        icon: Users, 
        color: 'text-indigo-600', 
        bg: 'bg-indigo-50', 
        border: 'border-indigo-100' 
    },
    { 
        label: 'Published Blogs', 
        value: activePages.toString(), 
        change: 'Stable', 
        isPositive: true,
        icon: FileText, 
        color: 'text-pink-600', 
        bg: 'bg-pink-50', 
        border: 'border-pink-100' 
    },
    { 
        label: 'Recent Inquiries', 
        value: thisWeekLeads.toString(), 
        change: 'This Week', 
        isPositive: true,
        icon: MessageSquare, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-100' 
    },
  ];
};

/**
 * Merges Leads and Blogs to create a unified Activity Log
 */
const generateActivityLog = (leads, blogs) => {
    const leadActivities = leads.map(l => ({
        id: `lead-${l.id}`,
        type: 'lead',
        user: l.name || 'Anonymous',
        action: 'submitted a lead',
        target: l.service || 'General Inquiry',
        time: new Date(l.created_at),
        icon: MessageSquare,
        color: 'text-purple-600 bg-purple-50'
    }));

    const blogActivities = blogs.map(b => ({
        id: `blog-${b.id}`,
        type: 'blog',
        user: 'Admin', // Assuming admin creates blogs
        action: 'published post',
        target: b.title,
        time: new Date(b.created_at),
        icon: UploadCloud,
        color: 'text-blue-600 bg-blue-50'
    }));

    // Combine and Sort Descending
    const combined = [...leadActivities, ...blogActivities];
    combined.sort((a, b) => b.time - a.time);

    return combined.slice(0, 10); // Return top 10
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Dashboard() {
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // To force re-render on refresh
  
  // Data State
  const [leadsData, setLeadsData] = useState([]);
  const [blogsData, setBlogsData] = useState([]);
  
  // Filter State
  const [timeRange, setTimeRange] = useState('1W'); // 1W, 1M, 3M, 1Y

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch relevant data in parallel
            const [leadsRes, blogsRes] = await Promise.all([
                API.getLeads(),
                API.getBlogs()
            ]);

            setLeadsData(leadsRes.data || []);
            // Handle pagination structure if exists (e.g. results array) or direct array
            setBlogsData(Array.isArray(blogsRes.data) ? blogsRes.data : (blogsRes.data.results || []));

        } catch (err) {
            console.error("Dashboard Load Error:", err);
            setError("Failed to load dashboard metrics. Check server connection.");
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [refreshKey]);

  // --- MEMOIZED COMPUTATIONS ---
  
  // 1. Chart Data
  const chartData = useMemo(() => {
      return processChartData(leadsData, timeRange);
  }, [leadsData, timeRange]);

  // 2. Stats Cards
  const stats = useMemo(() => {
      return calculateRealStats(leadsData, blogsData);
  }, [leadsData, blogsData]);

  // 3. Activity Feed
  const recentActivity = useMemo(() => {
      return generateActivityLog(leadsData, blogsData);
  }, [leadsData, blogsData]);

  // 4. Time formatting helper for "time ago"
  const timeAgo = (date) => {
      const seconds = Math.floor((new Date() - date) / 1000);
      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + " years ago";
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + " months ago";
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + " days ago";
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + " hours ago";
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + " mins ago";
      return "Just now";
  };

  // --- RENDER ---

  if (loading) return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
          <RefreshCw className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 font-medium">Analyzing data...</p>
      </div>
  );

  if (error) return (
      <div className="p-10 text-center bg-red-50 rounded-2xl border border-red-100 m-8">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={40}/>
          <h3 className="text-red-800 font-bold text-lg">Dashboard Error</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button onClick={() => setRefreshKey(prev => prev + 1)} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition">
              Retry Connection
          </button>
      </div>
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h2>
          <p className="text-slate-500 mt-1 font-medium">
            Real-time overview of your platform performance.
          </p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setRefreshKey(p => p + 1)}
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-600 font-bold text-sm shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >
                <RefreshCw size={16}/> Refresh
            </button>
            <a 
                href="/" 
                target="_blank" 
                rel="noreferrer" 
                className="group flex items-center gap-2 bg-indigo-600 border border-transparent px-4 py-2 rounded-xl text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition-all"
            >
                Live Site 
                <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
            </a>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden`}>
            {/* Background pattern */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-current opacity-5 rounded-bl-full -mr-4 -mt-4 ${stat.color}`}></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2 group-hover:scale-105 transition-transform origin-left">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium relative z-10">
              <span className={stat.isPositive ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded-md' : 'text-red-500 bg-red-50 px-2 py-0.5 rounded-md'}>
                {stat.change}
              </span>
              <span className="text-slate-400">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (2/3) - CHART & ACTIONS */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* CHART SECTION */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="text-indigo-600" size={20}/> Lead Acquisition
                </h3>
                <p className="text-slate-400 text-sm mt-1">Comparision of Chatbot vs Website interaction over time</p>
              </div>
              
              {/* Chart Filters */}
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                {['1W', '1M', '3M', '1Y'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      timeRange === range 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorChatbot" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWebsite" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle"/>
                  
                  {/* Website Leads - Bar Graph */}
                  <Bar 
                    name="Website Forms" 
                    dataKey="website" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                  
                  {/* Chatbot Leads - Area Graph */}
                  <Area 
                    type="monotone" 
                    name="Chatbot Interactions" 
                    dataKey="chatbot" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    fill="url(#colorChatbot)" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* QUICK ACTIONS BANNER */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group">
            <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-bold mb-2">Unread Leads Management</h3>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                   You have <span className="text-white font-bold">{leadsData.filter(l => !l.status || l.status === 'new').length} new leads</span> that need attention.
                   Reviewing them promptly increases conversion rates by up to 40%.
                </p>
                <div className="flex gap-4">
                    <Link to="/admin/leads" className="inline-flex items-center gap-2 bg-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/50">
                        Process Leads <ArrowRight size={18}/>
                    </Link>
                    <Link to="/admin/subscribers" className="inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition backdrop-blur-sm">
                        Email Marketing
                    </Link>
                </div>
            </div>
            {/* Abstract Decorative Icon */}
            <Users size={180} className="absolute -bottom-10 -right-10 text-slate-800 opacity-30 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>

        {/* RIGHT COLUMN (1/3) - ACTIVITY & LINKS */}
        <div className="space-y-8">
          
          {/* RECENT ACTIVITY (Timeline) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full max-h-[600px] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <Clock size={18} className="text-orange-500"/> Live Activity
               </h3>
               <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
               </span>
            </div>

            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
              {recentActivity.length > 0 ? recentActivity.map((item) => (
                <div key={item.id} className="relative pl-8 group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-1 h-5 w-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${item.color}`}>
                    <item.icon size={10} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">{timeAgo(item.time)}</span>
                    <p className="text-sm text-slate-800 font-semibold group-hover:text-indigo-600 transition-colors">
                      {item.user} <span className="font-normal text-slate-500">{item.action}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{item.target}</p>
                  </div>
                </div>
              )) : (
                  <div className="text-center py-10 text-slate-400">
                      <p>No recent activity found.</p>
                  </div>
              )}
              
              {recentActivity.length > 0 && (
                  <Link to="/admin/leads" className="block ml-8 text-xs font-bold text-indigo-600 hover:underline mt-4">
                      View Full Lead History
                  </Link>
              )}
            </div>
          </div>

          {/* CONTENT QUICK LINKS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Edit3 size={18} className="text-blue-500"/> Quick Edit
            </h3>
            <div className="flex flex-wrap gap-2">
                {[
                    {name: 'Home', link: 'home'}, 
                    {name: 'About', link: 'about'}, 
                    {name: 'Services', link: 'services'}, 
                    {name: 'Contact', link: 'contact'}, 
                    {name: 'Careers', link: 'careers'}, 
                    {name: 'Blog', link: 'blog'} // Note: Blog usually has its own manager
                ].map(page => (
                    <Link 
                      key={page.name} 
                      to={page.name === 'Blog' ? '/admin/blogs' : `/admin/content/${page.link}`} 
                      className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition"
                    >
                        {page.name}
                    </Link>
                ))}
                
                <Link 
                    to="/admin/header"
                    className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-800 hover:text-white hover:border-slate-800 transition flex items-center gap-2"
                >
                    <Settings size={12}/> Global Settings
                </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
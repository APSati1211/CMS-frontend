import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Layers, Users, ChevronDown, 
  ChevronRight, LogOut, Menu, X, FileText, Settings, UserCircle, 
  Mail, PenTool
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({ content: true });
  const location = useLocation();
  const { logout } = useAuth(); 

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const pages = [
    { name: "Home Page", slug: "home" },
    { name: "About Us", slug: "about" },
    { name: "Services", slug: "services" },
    { name: "Solutions", slug: "solutions" },
    { name: "Careers", slug: "careers" },
    { name: "Resources", slug: "resources" },
    { name: "Contact", slug: "contact" },
    { name: "Legal & Terms", slug: "legal" }
  ];

  // Helper for 3D Active State Styles
  const getLinkClasses = (isActive) => {
    if (isActive) {
      // 3D Active State: White card, subtle border, colored shadow, slight lift
      return "bg-white text-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.15)] border border-blue-100/50 translate-x-1 font-bold";
    }
    // Inactive State: Transparent, hover effect
    return "text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm hover:translate-x-0.5 border border-transparent font-medium";
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-sans text-slate-600">
      
      {/* --- SIDEBAR BACKDROP (Mobile) --- */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 
          bg-[#F9FAFB] /* Off-White Background */
          border-r border-slate-200/80
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 
          transition-transform duration-300 ease-in-out
          shadow-[4px_0_24px_rgba(0,0,0,0.03)] /* 3D Depth Shadow */
          flex flex-col h-full
        `}
      >
        {/* Header / Branding */}
        <div className="p-8 pb-6 flex justify-between items-center relative shrink-0">
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm">
              XpertAI <span className="text-blue-600">Admin</span>
            </h2>
            {/* Decorative Underline */}
            <div className="h-1 w-10 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mt-1.5 shadow-sm"></div>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm border border-slate-100" 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20}/>
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 overflow-y-auto px-5 space-y-3 py-2 custom-scrollbar">
          
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-2">Main Menu</div>

          {/* Dashboard */}
          <Link 
            to="/admin" 
            className={`flex items-center gap-3.5 p-3.5 rounded-xl transition-all duration-200 text-sm ${getLinkClasses(location.pathname === '/admin')}`}
          >
            <LayoutDashboard size={20} className={location.pathname === '/admin' ? 'text-blue-600' : 'text-slate-400'} />
            <span>Dashboard</span>
          </Link>
          
          {/* Profile */}
          <Link 
            to="/admin/profile" 
            className={`flex items-center gap-3.5 p-3.5 rounded-xl transition-all duration-200 text-sm ${getLinkClasses(location.pathname === '/admin/profile')}`}
          >
            <UserCircle size={20} className={location.pathname === '/admin/profile' ? 'text-blue-600' : 'text-slate-400'} />
            <span>My Profile</span>
          </Link>

          {/* Header & Branding */}
          <Link 
            to="/admin/header" 
            className={`flex items-center gap-3.5 p-3.5 rounded-xl transition-all duration-200 text-sm ${getLinkClasses(location.pathname === '/admin/header')}`}
          >
            <Settings size={20} className={location.pathname === '/admin/header' ? 'text-blue-600' : 'text-slate-400'} />
            <span>Header & Branding</span>
          </Link>

          {/* Content Dropdown */}
          <div className="space-y-2 pt-2">
            <button 
              onClick={() => toggleMenu('content')} 
              className={`
                w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-200
                font-medium text-sm
                ${openMenus.content 
                  ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 text-slate-700' 
                  : 'text-slate-500 hover:bg-white/60 hover:text-blue-600'}
              `}
            >
              <div className="flex items-center gap-3.5">
                <Layers size={20} className={openMenus.content ? 'text-blue-500' : 'text-slate-400'} />
                <span>Page Content</span>
              </div>
              <div className={`transition-transform duration-200 ${openMenus.content ? 'rotate-180 text-blue-500' : 'text-slate-400'}`}>
                <ChevronDown size={16}/>
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenus.content ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="ml-5 border-l-2 border-slate-200 pl-3 space-y-1 my-2">
                {pages.map(page => (
                  <Link 
                    key={page.slug} 
                    to={`/admin/content/${page.slug}`} 
                    className={`
                      block py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 relative
                      ${location.pathname.includes(`/content/${page.slug}`) 
                        ? 'text-blue-600 bg-blue-50/50 translate-x-1 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}
                    `}
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-6">Management</div>

          {/* Leads System */}
          <Link 
            to="/admin/leads" 
            className={`flex items-center gap-3.5 p-3.5 rounded-xl transition-all duration-200 text-sm ${getLinkClasses(location.pathname.startsWith('/admin/leads'))}`}
          >
            <Users size={20} className={location.pathname.startsWith('/admin/leads') ? 'text-blue-600' : 'text-slate-400'} />
            <span>Leads System</span>
          </Link>

          {/* Subscribers */}
          <Link 
            to="/admin/subscribers" 
            className={`flex items-center gap-3.5 p-3.5 rounded-xl transition-all duration-200 text-sm ${getLinkClasses(location.pathname.startsWith('/admin/subscribers'))}`}
          >
            <Mail size={20} className={location.pathname.startsWith('/admin/subscribers') ? 'text-blue-600' : 'text-slate-400'} />
            <span>Subscribers</span>
          </Link>
          
          {/* Blog Posts (Blog Manager) */}
           <Link 
            to="/admin/blogs" 
            className={`flex items-center gap-3.5 p-3.5 rounded-xl transition-all duration-200 text-sm ${getLinkClasses(location.pathname.startsWith('/admin/blogs'))}`}
          >
            <PenTool size={20} className={location.pathname.startsWith('/admin/blogs') ? 'text-blue-600' : 'text-slate-400'} />
            <span>Blog Posts</span>
          </Link>

          {/* Spacer for scrolling */}
          <div className="h-4"></div>
        </nav>

        {/* Footer / Logout - Stuck to Bottom */}
        <div className="p-5 border-t border-slate-200 bg-[#F9FAFB] shrink-0">
          <button 
            onClick={logout}
            className="group flex items-center justify-center gap-3 p-3.5 w-full text-slate-600 hover:text-red-600 bg-white border border-slate-200 hover:border-red-100 hover:bg-red-50 rounded-2xl transition-all shadow-sm hover:shadow-md"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform text-slate-400 group-hover:text-red-500"/> 
            <span className="font-bold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 lg:ml-72 p-6 md:p-10 transition-all duration-300">
        <button 
          className="lg:hidden mb-6 p-3 bg-white text-slate-700 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-slate-100 active:scale-95 transition" 
          onClick={() => setSidebarOpen(true)}
        >
            <Menu size={24}/>
        </button>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

    </div>
  );
}
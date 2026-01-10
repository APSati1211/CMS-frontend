import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Layout, Home, Info, Briefcase, Users, 
  BookOpen, Phone, Layers, Database, Shield, FileText 
} from 'lucide-react';

// Child Components
import HomeManager from './content/HomeManager';
import AboutManager from './content/AboutManager';
import ServicesManager from './content/ServicesManager';
import CareersManager from './content/CareersManager';
import ContactManager from './content/ContactManager';
import ResourcesManager from './content/ResourcesManager';
import SolutionsManager from './content/SolutionsManager';
import LeadSystemManager from './content/LeadSystemManager';
import LegalManager from './content/LegalManager';
import BlogManager from './content/BlogManager';

// --- CONFIGURATION ---
const PAGE_CONFIG = {
  'home': { 
    title: 'Home Page', // Changed from 'Home Page Manager' to just 'Home Page'
    icon: Home,
    color: 'text-blue-600'
  },
  'about': { 
    title: 'About Us', 
    icon: Info,
    color: 'text-emerald-600'
  },
  'services': { 
    title: 'Services', 
    icon: Briefcase,
    color: 'text-purple-600'
  },
  'careers': { 
    title: 'Careers', 
    icon: Users,
    color: 'text-orange-600'
  },
  'resources': { 
    title: 'Resources', 
    icon: BookOpen,
    color: 'text-cyan-600'
  },
  'contact': { 
    title: 'Contact', 
    icon: Phone,
    color: 'text-indigo-600'
  },
  'solutions': { 
    title: 'Solutions', 
    icon: Layers,
    color: 'text-pink-600'
  },
  'lead-system': { 
    title: 'Leads System', 
    icon: Database,
    color: 'text-red-600'
  },
  'legal': { 
    title: 'Legal', 
    icon: Shield,
    color: 'text-slate-600'
  },
  'blog': { 
    title: 'Blog', 
    icon: FileText,
    color: 'text-amber-600'
  },
};

export default function ContentManager() {
  const { pageName } = useParams();
  const activePage = PAGE_CONFIG[pageName];

  // Logic to render the correct component
  const renderManager = () => {
    switch (pageName) {
      case 'home': return <HomeManager />;
      case 'about': return <AboutManager />;
      case 'services': return <ServicesManager />;
      case 'careers': return <CareersManager />;
      case 'resources': return <ResourcesManager />;
      case 'contact': return <ContactManager />;
      case 'solutions': return <SolutionsManager />;
      case 'lead-system': return <LeadSystemManager />;
      case 'legal': return <LegalManager />;
      case 'blog': return <BlogManager />;
      default: 
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <Layout size={48} className="mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-slate-600">Page Not Found</h2>
            <p>Please select a valid section from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- SIMPLIFIED HEADER START --- */}
      {activePage ? (
        <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          
          {/* Left Side: Icon + Title Only */}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm ${activePage.color}`}>
              <activePage.icon size={24} strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {activePage.title}
            </h1>
          </div>

          {/* Right Side: Action Button (Only for Home Page) */}
          {pageName === 'home' && (
             <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                View Live Site
             </a>
          )}
        </div>
      ) : null}
      {/* --- SIMPLIFIED HEADER END --- */}

      {/* Render the actual content editor */}
      <div className="min-h-[500px]">
        {renderManager()}
      </div>

    </div>
  );
}
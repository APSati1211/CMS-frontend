import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import usePageContent from "../hooks/usePageContent";
import { getStakeholders } from "../api"; // New API Function
import { Users } from "lucide-react"; // Fallback Icon

export default function Stakeholders() {
  const { getField, loading: cmsLoading } = usePageContent("stakeholders");
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Stakeholders Data from New App
  useEffect(() => {
    getStakeholders()
      .then((res) => {
        setStakeholders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (cmsLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const hero = {
    title: getField("hero_title", "title") || "Our Ecosystem",
    text: getField("hero_text") || "Connecting clients, professionals, and partners in one unified platform.",
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Section (Managed via CMS) */}
      <div className="bg-slate-900 text-white py-24 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
          className="text-5xl font-bold mb-4 relative z-10"
        >
          {hero.title}
        </motion.h1>
        <p className="text-slate-400 max-w-2xl mx-auto relative z-10">{hero.text}</p>
      </div>

      {/* Dynamic Cards Grid (Managed via Stakeholders App) */}
      <div className="max-w-6xl mx-auto px-6 mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {loading ? (
          <p className="text-center col-span-full text-gray-500">Loading Stakeholders...</p>
        ) : stakeholders.length > 0 ? (
          stakeholders.map((card, i) => (
            <motion.div 
              key={card.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }} 
              className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-500 text-center hover:shadow-2xl transition-all"
            >
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                {card.icon ? (
                  <img src={card.icon} alt={card.title} className="w-full h-full object-cover" />
                ) : (
                  <Users size={32} className="text-blue-500" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3">{card.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{card.description}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">No stakeholders added yet.</p>
        )}

      </div>
    </div>
  );
}
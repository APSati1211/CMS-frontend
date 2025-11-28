import { motion } from "framer-motion";
import usePageContent from "../hooks/usePageContent";
import { Target, Eye, Heart } from "lucide-react";

export default function About() {
  const { getField, loading } = usePageContent("about");

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const hero = {
    title: getField("hero_title", "title") || "About XpertAI Global",
    text: getField("hero_text") || "Pioneering the future of financial intelligence.",
  };

  const sections = [
    {
      title: getField("mission_title", "title") || "Our Mission",
      text: getField("mission_text") || "To empower businesses with AI-driven financial clarity.",
      icon: <Target size={40} className="text-blue-500" />,
    },
    {
      title: getField("vision_title", "title") || "Our Vision",
      text: getField("vision_text") || "A world where finance is automated, accurate, and strategic.",
      icon: <Eye size={40} className="text-purple-500" />,
    },
    {
      title: getField("values_title", "title") || "Our Values",
      text: getField("values_text") || "Integrity, Innovation, and Impact.",
      icon: <Heart size={40} className="text-pink-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section 
          - pt-32: Added top padding for Fixed Navbar.
          - pb-20: Bottom padding for internal spacing.
      */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
          className="text-5xl font-bold mb-4 relative z-10"
        >{hero.title}</motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xl text-slate-300 max-w-2xl mx-auto relative z-10"
        >{hero.text}</motion.p>
      </div>

      {/* Mission/Vision Cards 
          - Removed '-mt-20' (negative margin) to stop overlap.
          - Added 'mt-8' to create spacing between Banner and Cards.
      */}
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8 mt-8 relative z-20">
        {sections.map((section, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="mb-4 bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center">
              {section.icon}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">{section.title}</h2>
            <p className="text-slate-600 leading-relaxed">{section.text}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Section (CMS Data) */}
      <div className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{getField("cta_title", "title") || "Join Our Journey"}</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">{getField("cta_text") || "Let's build something great together."}</p>
      </div>
    </div>
  );
}
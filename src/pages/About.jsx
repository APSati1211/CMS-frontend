import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAboutPageData } from "../api"; 
import { Target, Eye, Heart, Award, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react"; 
import { Link } from "react-router-dom";

export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutPageData()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("About data error:", err);
        setLoading(false);
      });
  }, []);

  const renderDynamicIcon = (iconName) => {
    const IconComponent = LucideIcons[iconName] || LucideIcons.Cpu;
    return <IconComponent size={40} className="mb-4 text-blue-600" />;
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white text-slate-600 animate-pulse">Loading About Page...</div>;

  const { content, team, awards, tech_stack } = data || {};

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* HERO SECTION - MATCHING HOME THEME */}
      <div className="relative pt-32 pb-20 md:pt-44 md:pb-32 bg-slate-50 text-slate-900 overflow-hidden px-4 text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-purple-200/50 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>

        <motion.h1 
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-bold mb-6 relative z-10"
        >
          {content?.hero_title || "About XpertAI"}
        </motion.h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto relative z-10">
          {content?.hero_subtitle}
        </p>
      </div>

      {/* i. COMPANY OVERVIEW */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">{content?.story_title || "Company Overview"}</h2>
          <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
            {content?.story_text}
          </p>
        </motion.div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="relative">
            {content?.story_image ? (
                <img src={content.story_image} alt="Overview" className="rounded-2xl shadow-2xl border border-slate-200" />
            ) : (
                <div className="bg-blue-50 rounded-2xl h-80 flex items-center justify-center border-2 border-dashed border-blue-200 text-blue-400 font-bold">Infographic Area</div>
            )}
        </motion.div>
      </section>

      {/* ii. MISSION, VISION & VALUES */}
      <div className="bg-white py-24 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: content?.mission_title, text: content?.mission_text, icon: Target, color: "text-blue-500" },
            { title: content?.vision_title, text: content?.vision_text, icon: Eye, color: "text-purple-500" },
            { title: content?.values_title, text: content?.values_text, icon: Heart, color: "text-pink-500" },
          ].map((item, i) => (
            <motion.div 
              key={i} whileHover={{ y: -10 }} 
              className="p-10 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center"
            >
              <item.icon size={56} className={`${item.color} mx-auto mb-6`} />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* iii. LEADERSHIP */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Leadership & Advisory Team</h2>
            <p className="text-slate-500">The experts driving our AI & Financial revolution.</p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {team?.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                    <div className="h-64 overflow-hidden bg-slate-100 relative">
                        {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">No Photo</div>
                        )}
                    </div>
                    <div className="p-6 text-center">
                        <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                        <p className="text-sm text-blue-600 font-medium uppercase tracking-wide mt-1">{member.role}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* iv. TECH STACK */}
      {tech_stack && tech_stack.length > 0 && (
        <section className="py-24 px-6 bg-slate-50 text-slate-900 relative overflow-hidden border-t border-slate-200">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Technology Stack</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Built on the pillars of AI, Automation, and Blockchain.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {tech_stack.map((tech, index) => (
                        <motion.div 
                            key={tech.id}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all hover:-translate-y-2 group"
                        >
                            <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {renderDynamicIcon(tech.icon_name)}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">{tech.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{tech.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* EXTRA: AWARDS */}
      {awards && awards.length > 0 && (
        <section className="py-20 bg-blue-50 px-6">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-12 flex items-center justify-center gap-3">
                    <Award className="text-yellow-600" /> {content?.awards_title || "Recognition"}
                </h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {awards.map((award) => (
                        <div key={award.id} className="bg-white px-8 py-6 rounded-xl shadow-sm border border-blue-100 flex flex-col items-center">
                            <span className="text-3xl font-bold text-blue-200 block mb-2">{award.year}</span>
                            <span className="font-bold text-slate-800">{award.title}</span>
                            <span className="text-xs text-slate-500">{award.description}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">{content?.cta_title}</h2>
        <p className="mb-10 text-blue-100 text-lg">{content?.cta_text}</p>
        <Link to="/contact" className="inline-flex items-center bg-white text-blue-600 px-10 py-4 rounded-full font-bold transition shadow-lg hover:bg-slate-50">
            Contact Us <ArrowRight size={20} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
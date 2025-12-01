import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAboutPageData } from "../api"; // <--- Updated Import
import { Target, Eye, Heart, Globe, Award, Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API Function Call (No manual axios)
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

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Experience...</div>;

  const { content, team, awards } = data || {};

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white pt-40 pb-32 px-6 text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.h1 
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-bold mb-6 relative z-10"
        >
          {content?.hero_title || "About XpertAI"}
        </motion.h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto relative z-10">
          {content?.hero_subtitle}
        </p>
      </div>

      {/* 2. OUR STORY */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">{content?.story_title || "Our Story"}</h2>
          <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
            {content?.story_text || "It started with a vision to automate finance..."}
          </p>
        </motion.div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="relative">
            {content?.story_image && (
                <img src={content.story_image} alt="Our Story" className="rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition duration-500" />
            )}
        </motion.div>
      </section>

      {/* 3. MISSION, VISION, VALUES */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: content?.mission_title, text: content?.mission_text, icon: Target, color: "text-blue-500" },
            { title: content?.vision_title, text: content?.vision_text, icon: Eye, color: "text-purple-500" },
            { title: content?.values_title, text: content?.values_text, icon: Heart, color: "text-pink-500" },
          ].map((item, i) => (
            <motion.div 
              key={i} whileHover={{ y: -10 }} 
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-lg text-center"
            >
              <item.icon size={48} className={`${item.color} mx-auto mb-6`} />
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
              <p className="text-slate-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. GLOBAL PRESENCE */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
            <Globe size={64} className="text-blue-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-bold mb-4">{content?.global_title || "Global Reach"}</h2>
            <p className="text-2xl text-blue-200 font-light">{content?.global_stats || "Serving clients in 20+ Countries"}</p>
        </div>
      </section>

      {/* 5. TEAM SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">Meet The Leadership</h2>
            <p className="text-slate-500 mt-4">The minds behind the machine.</p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {team?.map((member) => (
                <div key={member.id} className="group relative overflow-hidden rounded-2xl">
                    <img src={member.image || "https://via.placeholder.com/300"} alt={member.name} className="w-full h-80 object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 text-white translate-y-4 group-hover:translate-y-0 transition">
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-sm text-blue-300">{member.role}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 6. AWARDS */}
      <section className="bg-blue-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
                <Award className="text-yellow-500" /> {content?.awards_title || "Awards"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
                {awards?.map((award) => (
                    <div key={award.id} className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex items-start gap-4">
                        <div className="text-4xl font-bold text-blue-200">#{award.year}</div>
                        <div>
                            <h4 className="font-bold text-lg">{award.title}</h4>
                            <p className="text-sm text-slate-500">{award.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 7. SUSTAINABILITY / CSR */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <Leaf size={48} className="text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-slate-900 mb-6">{content?.csr_title || "Commitment to Sustainability"}</h2>
        <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {content?.csr_text || "We believe in green computing and sustainable financial practices..."}
        </p>
      </section>

      {/* 8. CTA */}
      <div className="bg-slate-900 text-white py-20 text-center px-6">
        <h2 className="text-4xl font-bold mb-6">{content?.cta_title}</h2>
        <p className="mb-8 text-slate-400">{content?.cta_text}</p>
        <Link to="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition flex items-center gap-2 mx-auto w-fit">
            Contact Us <ArrowRight size={20} />
        </Link>
      </div>

    </div>
  );
}
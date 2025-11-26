import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import { ArrowRight } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ServiceDetail from "./pages/ServiceDetail";

// 📄 Pages added pages
import Home from "./pages/Home"; 
import About from "./pages/About";
import Services from "./pages/Services";  
import Contact from "./pages/Contact";
import Stakeholders from "./pages/Stakeholders";
import Features from "./pages/Features";
import LeadSystem from "./pages/LeadSystem";
import Blog from "./pages/Blog";
import Resources from "./pages/Resources";
import Careers from "./pages/Careers";

function App() {
  const [themeData, setThemeData] = useState(null); // Store full theme object

  useEffect(() => {
    fetch("/api/theme-settings/")
      .then((response) => response.json())
      .then((data) => {
        if (data) {
            setThemeData(data); // Store all data for usage in components

            // CSS Variables
            document.documentElement.style.setProperty('--primary-color', data.primary_color);
            document.documentElement.style.setProperty('--secondary-color', data.secondary_color);
            document.documentElement.style.setProperty('--accent-color', data.accent_color);
            document.documentElement.style.setProperty('--background-color', data.background_color);
            document.documentElement.style.setProperty('--text-color', data.text_color);
            
            document.body.classList.remove("dark");
        }
      })
      .catch(err => console.error("Failed to fetch theme settings:", err));
  }, []);

  return (
    <Router>
      <div className="bg-light min-h-screen flex flex-col">
        {/* 🔹 Navbar: Passes Logo */}
        <Navbar logo={themeData?.logo} />

        {/* 🔹 Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stakeholders" element={<Stakeholders />} />
          <Route path="/features" element={<Features />} />
          <Route path="/lead-system" element={<LeadSystem />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
        </Routes>

        {/* 🔹 Footer: Passes Social Links & Contact Info */}
        <Footer data={themeData} logo={themeData?.logo} />
        
        {/* 🔹 Chatbot: Passes Welcome Message */}
        <Chatbot welcomeMessage={themeData?.chatbot_welcome_message} />
      </div>
    </Router>
  );
}

export default App;

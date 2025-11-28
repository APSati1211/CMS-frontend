import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { getThemeSettings } from "./api"; // Updated import

// 📄 Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";  
import Contact from "./pages/Contact";
import Stakeholders from "./pages/Stakeholders";
// Features page removed
import LeadSystem from "./pages/LeadSystem";
import Blog from "./pages/Blog";
import Resources from "./pages/Resources";
import Careers from "./pages/Careers";
import ServiceDetail from "./pages/ServiceDetail";

function App() {
  const [themeData, setThemeData] = useState(null);

  useEffect(() => {
    getThemeSettings()
      .then((res) => {
        if (res.data) {
            setThemeData(res.data);
            // CSS Variables update
            document.documentElement.style.setProperty('--primary-color', res.data.primary_color);
            document.documentElement.style.setProperty('--secondary-color', res.data.secondary_color);
            document.documentElement.style.setProperty('--accent-color', res.data.accent_color);
            document.documentElement.style.setProperty('--background-color', res.data.background_color);
            document.documentElement.style.setProperty('--text-color', res.data.text_color);
            
            document.body.classList.remove("dark");
        }
      })
      .catch(err => console.error("Failed to fetch theme settings:", err));
  }, []);

  return (
    <Router>
      <div className="bg-light min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar logo={themeData?.logo} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stakeholders" element={<Stakeholders />} />
          
          {/* Features Route Removed */}
          
          <Route path="/lead-system" element={<LeadSystem />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
        </Routes>

        {/* Footer */}
        <Footer logo={themeData?.logo} />
        
        {/* Chatbot */}
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
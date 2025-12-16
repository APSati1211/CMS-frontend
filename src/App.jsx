import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import ScrollToTop from "./components/ScrollToTop"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext"; // 👈 IMPORT THIS

// 📄 Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";  
import Contact from "./pages/Contact";
import LeadSystem from "./pages/LeadSystem";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Resources from "./pages/Resources";
import Careers from "./pages/Careers";
import ServiceDetail from "./pages/ServiceDetail";
import LegalPage from "./pages/LegalPage";
import Solutions from "./pages/Solutions";
import SolutionDetail from "./pages/SolutionDetail"; 

function App() {
  return (
    <Router>
      <ChatProvider> {/* 👈 WRAP APPLICATION HERE */}
        <ScrollToTop />

        <div className="bg-light min-h-screen flex flex-col">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/lead-system" element={<LeadSystem />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            
            <Route path="/resources" element={<Resources />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            
            {/* 🔥 SOLUTIONS ROUTES */}
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/:slug" element={<SolutionDetail />} />

            {/* --- LEGAL PAGES --- */}
            <Route path="/terms-and-conditions" element={<LegalPage slug="terms-and-conditions" />} />
            <Route path="/privacy-policy" element={<LegalPage slug="privacy-policy" />} />
            <Route path="/refund-policy" element={<LegalPage slug="refund-policy" />} /> 
          </Routes>

          <Footer />
          <Chatbot />
        </div>
      </ChatProvider>
    </Router>
  );
}

export default App;
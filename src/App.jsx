import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import ScrollToTop from "./components/ScrollToTop"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 📄 Pages (Same imports)
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

function App() {
  // Theme state aur useEffect hata diya gaya hai.
  // Ab website seedha CSS variables use karegi.

  return (
    <Router>
      <ScrollToTop />

      <div className="bg-light min-h-screen flex flex-col">
        {/* Logo prop hata diya, ab default text logo dikhega */}
        <Navbar />

        {/* Routes */}
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
          <Route path="/terms-and-conditions" element={<LegalPage slug="terms-and-conditions" />} />
          <Route path="/privacy-policy" element={<LegalPage slug="privacy-policy" />} />
          <Route path="/solutions" element={<Solutions />} />
        </Routes>

        {/* Footer */}
        <Footer />
        
        {/* Chatbot */}
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
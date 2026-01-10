import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
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

import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import HeaderManager from "./admin/pages/HeaderManager";   
import ContentManager from "./admin/pages/ContentManager"; 
import LeadsManager from "./admin/pages/LeadsManager";
import Login from "./admin/pages/Login";
import Profile from "./admin/pages/Profile"; 
import SubscribersManager from "./admin/pages/SubscribersManager"; // <--- NEW IMPORT
import BlogManager from "./admin/pages/content/BlogManager"; // <--- Added BlogManager for standalone route

function PublicLayout({ children }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <Navbar />}
      {children}
      {!isAdminPath && (
        <>
          <Footer />
          <Chatbot />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ChatProvider>
          <ScrollToTop />
          <div className="bg-light min-h-screen flex flex-col">
            <PublicLayout>
              <Routes>
                {/* --- PUBLIC ROUTES --- */}
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
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/solutions/:slug" element={<SolutionDetail />} />
                <Route path="/terms-and-conditions" element={<LegalPage slug="terms-and-conditions" />} />
                <Route path="/privacy-policy" element={<LegalPage slug="privacy-policy" />} />
                <Route path="/refund-policy" element={<LegalPage slug="refund-policy" />} />

                {/* --- ADMIN LOGIN ROUTE --- */}
                <Route path="/admin/login" element={<Login />} />

                {/* --- PROTECTED ADMIN ROUTES --- */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin/*" element={
                    <AdminLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/subscribers" element={<SubscribersManager />} /> {/* <--- NEW ROUTE */}
                        <Route path="/header" element={<HeaderManager />} />   
                        <Route path="/content/:pageName" element={<ContentManager />} /> 
                        <Route path="/leads" element={<LeadsManager />} />     
                        <Route path="/blogs" element={<BlogManager />} /> {/* <--- Standalone Blog Route */}
                      </Routes>
                    </AdminLayout>
                  } />
                </Route>
              </Routes>
            </PublicLayout>
          </div>
        </ChatProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
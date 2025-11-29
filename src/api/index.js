import axios from "axios";

// Agar .env file me URL nahi hai, to default localhost use karega.
// Agar tumhe live server (13.233...) use karna hai, to niche URL change kar lena.
const BASE_URL = process.env.REACT_APP_API_URL || "http://15.206.207.118:8000/api/";

const API = axios.create({
    baseURL: BASE_URL, 
    withCredentials: true, // Ye Chatbot aur Session maintain karne ke liye zaroori hai
});

// --- 1. CMS & Pages (Legacy & New) ---

// Dynamic content fetch karne ke liye (Old CMS)
export const getPageContent = (page) => {
    if (page === "home") {
        return API.get("home-page-content/");
    }
    return API.get(`sitecontent/?page=${page}`);
};

// --- 2. New App Data Fetchers (Dedicated Pages) ---
export const getHomeData = () => API.get("homepage-data/");
export const getResourcesPageData = () => API.get("resources-page-data/");
export const getLeadSystemData = () => API.get("lead-system-data/");
export const getServicesPageData = () => API.get("services-page-data/");
export const getLegalPageData = (slug) => API.get(`legal/pages/${slug}/`);

// --- 3. Blog ---
// Blogs fetch karne ke liye (category filter ke saath)
export const getBlogs = (categorySlug = '') => {
    let url = "blogs/";
    if (categorySlug) {
        url += `?category=${categorySlug}`; 
    }
    return API.get(url);
};

// Categories fetch karne ke liye
export const getCategories = () => API.get("blog-categories/");

// --- 4. Leads & Contact ---
// Leads submit karne ke liye
export const submitLead = (data) => API.post("leads/", data);

// Contact form submit karne ke liye
export const sendContact = (data) => API.post("contact/", data);

// --- 5. Careers ---
// Jobs fetch karne ke liye
export const getJobs = () => API.get("jobs/");

// Job Application submit karne ke liye
export const applyForJob = (data) => API.post("apply/", data);

// --- 6. Resources & Services Lists (Cards) ---
// Case Studies fetch karne ke liye
export const getCaseStudies = () => API.get("case-studies/");

// Resources fetch karne ke liye
export const getResources = () => API.get("resources/");

// Services List fetch karne ke liye
export const getServices = () => API.get("services/");

// Specific Service Detail fetch karne ke liye
export const getServiceBySlug = (slug) => API.get(`services/${slug}/`);

// --- 7. Stakeholders ---
// Stakeholders fetch karne ke liye
export const getStakeholders = () => API.get("stakeholders/");

// --- 8. Theme & Chatbot ---
// Theme Settings fetch karne ke liye
export const getThemeSettings = () => API.get("theme-settings/"); 

// Chatbot Flow handle karne ke liye
export const chatFlowHandler = (data) => API.post("chatbot-flow/", data);

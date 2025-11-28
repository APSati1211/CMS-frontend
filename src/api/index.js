import axios from "axios";

// Agar .env file me URL nahi hai, to default localhost use karega.
// Agar tumhe live server (13.233...) use karna hai, to niche URL change kar lena.
const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/";

const API = axios.create({
    baseURL: BASE_URL, 
    withCredentials: true, // Ye Chatbot aur Session maintain karne ke liye zaroori hai
});

// Dynamic content fetch karne ke liye
export const getPageContent = (page) => {
    if (page === "home") {
        return API.get("home-page-content/");
    }
    return API.get(`sitecontent/?page=${page}`);
};

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

// Leads submit karne ke liye
export const submitLead = (data) => API.post("leads/", data);

// Contact form submit karne ke liye
export const sendContact = (data) => API.post("contact/", data);

// Careers / Jobs fetch karne ke liye
export const getJobs = () => API.get("jobs/");
export const applyForJob = (data) => API.post("apply/", data);

// Resources aur Case Studies fetch karne ke liye
export const getCaseStudies = () => API.get("case-studies/");
export const getResources = () => API.get("resources/");

// Services fetch karne ke liye
export const getServices = () => API.get("services/");
export const getServiceBySlug = (slug) => API.get(`services/${slug}/`);

// Theme Settings fetch karne ke liye
export const getThemeSettings = () => API.get("theme-settings/"); 

// Chatbot Flow handle karne ke liye
export const chatFlowHandler = (data) => API.post("chatbot-flow/", data);

export const getStakeholders = () => API.get("stakeholders/");

// --- Home Page ---
export const getHomeData = () => API.get("homepage-data/");

// --- Resources Page ---
export const getResourcesPageData = () => API.get("resources-page-data/");

// --- Lead System Page ---
export const getLeadSystemData = () => API.get("lead-system-data/");
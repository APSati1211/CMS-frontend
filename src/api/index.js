import axios from "axios";

// --- CSRF helper ---
function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return match ? decodeURIComponent(match.pop()) : null;
}

// --- CONFIGURATION ---
const LOCAL_API_URL = "/api";
const BASE_URL = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) 
    ? process.env.REACT_APP_API_URL 
    : LOCAL_API_URL;

const API = axios.create({
    baseURL: BASE_URL, 
    withCredentials: true, // Yeh zaroori hai
});

// Attach CSRF token (if present) to every request
API.interceptors.request.use((config) => {
  const csrftoken = getCookie('csrftoken'); // Django default cookie name
  if (csrftoken) {
    config.headers['X-CSRFToken'] = csrftoken;
  }
  return config;
}, (error) => Promise.reject(error));


// --- 1. CMS & Pages ---
export const getPageContent = (page) => {
    if (page === "home") {
        return API.get("home-page-content/");
    }
    return API.get(`sitecontent/?page=${page}`);
};

// --- 2. Dedicated Page Data ---
export const getHomeData = () => API.get("homepage-data/");
export const getAboutPageData = () => API.get("about-page-data/");
export const getResourcesPageData = () => API.get("resources-page-data/");
export const getLeadSystemData = () => API.get("lead-system-data/");
export const getServicesPageData = () => API.get("services-page-data/");
export const getLegalPageData = (slug) => API.get(`legal/pages/${slug}/`);
export const getCareersPageData = () => API.get("careers-page-data/");
export const getContactPageData = () => API.get("contact-page-data/");

// --- 3. Blog (UPDATED) ---
export const getBlogs = (categorySlug = '', searchQuery = '') => {
    let url = "blogs/?";
    if (categorySlug && categorySlug !== 'all') {
        url += `category=${categorySlug}&`; 
    }
    if (searchQuery) {
        url += `search=${searchQuery}&`;
    }
    return API.get(url);
};

// NEW: Fetch single blog by slug
export const getBlogBySlug = (slug) => API.get(`blogs/${slug}/`);

export const getCategories = () => API.get("blog-categories/");

// --- 4. Leads & Contact ---
export const submitLead = (data) => API.post("leads/", data);
export const sendContact = (data) => API.post("contact/", data);
export const submitTicket = (data) => API.post("tickets/", data); // <--- ADDED THIS

// --- 5. Careers ---
export const getJobs = () => API.get("jobs/");
export const applyForJob = (data) => API.post("apply/", data);

// --- 6. Resources & Services Lists ---
export const getCaseStudies = () => API.get("case-studies/");
export const getResources = () => API.get("resources/");
export const getServices = () => API.get("services/");
export const getServiceBySlug = (slug) => API.get(`services/${slug}/`);

// --- 7. Stakeholders (Updated) ---
export const getStakeholders = () => API.get("stakeholders/");
export const getSolutionsPageData = () => API.get("solutions-page-data/"); // NEW FUNCTION

// --- 8. Theme & Chatbot ---
export const getThemeSettings = () => API.get("theme-settings/"); 
export const chatFlowHandler = (data) => API.post("chatbot-flow/", data);
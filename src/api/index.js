import axios from "axios";

// --- CSRF Helper ---
function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return match ? decodeURIComponent(match.pop()) : null;
}

// --- CONFIGURATION ---
// Step 1: .env se URL fetch karna. Agar .env mein nahi hai to localhost use karega.
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

console.log("Current API Base URL:", BASE_URL); // Debugging ke liye check kar sakte ho

const API = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Attach CSRF token & Auth Token
API.interceptors.request.use((config) => {
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) config.headers['X-CSRFToken'] = csrftoken;
  
  const token = localStorage.getItem('authToken');
  if (token) config.headers['Authorization'] = `Token ${token}`;

  return config;
}, (error) => Promise.reject(error));

const configMultipart = { headers: { "Content-Type": "multipart/form-data" } };


// ==========================================
//  🔐 AUTHENTICATION
// ==========================================
export const loginUser = (credentials) => API.post("login/", credentials);
export const registerUser = (data) => API.post("register/", data);
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Token ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete API.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};
export const getProfile = () => API.get("profile/");
export const updateProfile = (data) => API.put("profile/", data, configMultipart);


// ==========================================
//  🛠️ GENERIC CRUD
// ==========================================
export const fetchList = (resource) => API.get(`${resource}/`);

export const createItem = (resource, data) => {
    if (['team-members', 'awards', 'tech-stack'].includes(resource)) {
        return API.post(`about/${resource}/`, data, configMultipart);
    }
    if (['office-addresses', 'messages', 'tickets'].includes(resource)) {
        return API.post(`contact/${resource}/`, data, configMultipart);
    }
    return API.post(`${resource}/`, data, configMultipart);
};

export const updateItem = (resource, id, data) => {
    if (['team-members', 'awards', 'tech-stack'].includes(resource)) {
        return API.put(`about/${resource}/${id}/`, data, configMultipart);
    }
    if (['office-addresses', 'messages', 'tickets'].includes(resource)) {
        return API.put(`contact/${resource}/${id}/`, data, configMultipart);
    }
    return API.put(`${resource}/${id}/`, data, configMultipart);
};

export const deleteItem = (resource, id) => {
    if (['team-members', 'awards', 'tech-stack'].includes(resource)) {
        return API.delete(`about/${resource}/${id}/`);
    }
    if (['office-addresses', 'messages', 'tickets'].includes(resource)) {
        return API.delete(`contact/${resource}/${id}/`);
    }
    return API.delete(`${resource}/${id}/`);
};


// ==========================================
//  1. CMS & PAGES
// ==========================================
export const getPageContent = (page) => {
    if (page === "home") return API.get("home-page-content/");
    return API.get(`sitecontent/?page=${page}`);
};
export const updatePageContent = (id, data) => API.put(`sitecontent/${id}/`, data);

export const getHomeData = () => API.get("homepage-data/"); 
export const updateHomeData = (id, data) => API.put(`homepage-content/${id}/`, data, configMultipart); 

export const getAboutPageData = () => API.get("about/about-page-data/");
export const updateAboutPageData = (id, data) => API.put(`about/about-content/${id}/`, data, configMultipart);

export const getServicesPageData = () => API.get("services-page-data/");
export const updateServicesPageData = (id, data) => API.put(`services-page-data/${id}/`, data, configMultipart);

export const getCareersPageData = () => API.get("careers-page-data/");
export const updateCareersPageData = (id, data) => API.put(`careers-content/${id}/`, data, configMultipart);

export const getResourcesPageData = () => API.get("resources-page-data/");
export const updateResourcesPageData = (id, data) => API.put(`resources-page-data/${id}/`, data, configMultipart);

export const getSolutionsPageData = () => API.get("solutions-page-data/");
export const updateSolutionsPageData = (id, data) => API.put(`solutions-page-data/${id}/`, data, configMultipart);

export const getLeadSystemData = () => API.get("lead-system-data/");
export const updateLeadSystemData = (id, data) => API.put(`lead-system-data/${id}/`, data, configMultipart);

export const getLegalPageData = (slug) => API.get(`legal/pages/${slug}/`);
export const updateLegalPageData = (slug, data) => API.put(`legal/pages/${slug}/`, data);


// ==========================================
//  2. CONTACT & TICKETS
// ==========================================
export const getContactPageData = () => API.get("contact/page-data/");
export const updateContactPageData = (id, data) => API.put(`contact/contact-content/${id}/`, data, configMultipart);

export const sendContact = (data) => API.post("contact/", data);
export const submitTicket = (data) => API.post("contact/tickets/", data);

export const getContactMessages = () => API.get("contact/messages/");
export const deleteContact = (id) => API.delete(`contact/messages/${id}/`);

export const getTickets = () => API.get("contact/tickets/");
export const updateTicket = (id, data) => API.put(`contact/tickets/${id}/`, data);


// ==========================================
//  3. BLOG & RESOURCES
// ==========================================
export const getBlogs = (categorySlug = '', searchQuery = '') => {
    let url = "blogs/?";
    if (categorySlug && categorySlug !== 'all') url += `category=${categorySlug}&`; 
    if (searchQuery) url += `search=${searchQuery}&`;
    return API.get(url);
};
export const getBlogBySlug = (slug) => API.get(`blogs/${slug}/`);
export const getCategories = () => API.get("blog-categories/");
export const createBlog = (data) => API.post("blogs/", data, configMultipart); 
export const updateBlog = (id, data) => API.put(`blogs/${id}/`, data, configMultipart);
export const deleteBlog = (id) => API.delete(`blogs/${id}/`);

export const getServices = () => API.get("services/");
export const getServiceBySlug = (slug) => API.get(`services/${slug}/`);
export const updateService = (id, data) => API.put(`services/${id}/`, data);
export const deleteService = (id) => API.delete(`services/${id}/`);

export const getJobs = () => API.get("jobs/");
export const applyForJob = (data) => API.post("apply/", data, configMultipart);
export const createJob = (data) => API.post("jobs/", data);
export const updateJob = (id, data) => API.put(`jobs/${id}/`, data);
export const deleteJob = (id) => API.delete(`jobs/${id}/`);

export const getCaseStudies = () => API.get("case-studies/");
export const getResources = () => API.get("resources/");
export const getStakeholders = () => API.get("stakeholders/");
export const getSolutionBySlug = (slug) => API.get(`solutions/${slug}/`);


// ==========================================
//  4. LEADS & MARKETING
// ==========================================
export const submitLead = (data) => API.post("leads/", data);
export const getLeads = () => API.get("leads/");
export const deleteLead = (id) => API.delete(`leads/${id}/`);
export const logLeadShare = (id, data) => API.post(`leads/${id}/share/`, data);
export const getLeadShareHistory = (id) => API.get(`leads/${id}/share-history/`);
export const getPreviousRecipients = () => API.get(`leads/previous-recipients/`);

export const getSubscribers = () => API.get("subscribers/");
export const deleteSubscriber = (id) => API.delete(`subscribers/${id}/`);

export const getEmailTemplates = () => API.get("email-templates/");
export const createEmailTemplate = (data) => API.post("email-templates/", data);
export const updateEmailTemplate = (id, data) => API.put(`email-templates/${id}/`, data);
export const deleteEmailTemplate = (id) => API.delete(`email-templates/${id}/`);
export const sendBulkEmail = (data) => API.post("subscribers/send-email/", data);


// ==========================================
//  5. SYSTEM SETTINGS
// ==========================================
export const getThemeSettings = () => API.get("theme-settings/"); 
export const chatFlowHandler = (data) => API.post("chatbot-flow/", data);
export const getBrandingSettings = () => API.get("branding/config/active/");
export const updateBrandingSettings = (id, formData) => API.put(`branding/config/${id}/`, formData, configMultipart);

export default API;
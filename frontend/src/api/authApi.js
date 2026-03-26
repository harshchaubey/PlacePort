import axios from "axios";

const API = axios.create({
baseURL: "https://placement-portal-full-production.up.railway.app"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const getCurrentUser = () => API.get("/auth/me");


export const createStudentProfile = (data) => API.post("/students/profile", data);
export const createCompanyProfile = (data) => API.post("/companies/profile", data);
export const getStudentProfile = () => API.get("/students/me");
export const getCompanyProfile = () => API.get("/companies/me");

export const createJob = (data) => API.post("/jobs/post", data);
export const getApplicationsByJob = (jobId) => API.get(`/applications/job/${jobId}`);

export const getAllJobs = () => {
  return API.get("/jobs/All");
};

export default API;

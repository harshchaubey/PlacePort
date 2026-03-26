import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ✅ LOGIN
export const loginUser = (data) =>
  API.post("/auth/login", data);

// ✅ REGISTER (AUTH)
export const registerUser = (data) =>
  API.post("/auth/register", data);

// ✅ CURRENT USER
export const getCurrentUser = () =>
  API.get("/auth/me");

// ✅ STUDENT PROFILE
export const createStudentProfile = (data) =>
  API.post("/students/profile", data);

// ✅ COMPANY PROFILE
export const createCompanyProfile = (data) =>
  API.post("/companies/profile", data);
export default API;

export const getStudentProfile = () =>
  API.get("/students/me");

export const getCompanyProfile = () =>
  API.get("/companies/me");

  export const createJob = (data) =>
  API.post("/jobs/post", data);

  export const getApplicationsByJob = (jobId) => {
    return API.get(`/applications/job/${jobId}`);
  };


export const getAllJobs = () => {
  return axios.get("/jobs/All");
};



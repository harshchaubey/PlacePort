import axios from "axios";
import { getToken } from "../auth/auth";
import API from "./authApi";


API.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export const getAllJobs = () => API.get("/jobs/All");

export const getAppliedJobs = () => API.get("/applications/my");








export const createJob = (data) =>
  API.post("/jobs/post", data);



  export const applyJob = async (jobId, formData) => {
       API.post(`/applications/apply/${jobId}`,formData);
    };
export const getCompanyJobs = () =>
    API.get(`/jobs/company`);

    export const getApplicationsByJob = (jobId) => {
      return axios.get(`/applications/job/${jobId}`);
    };



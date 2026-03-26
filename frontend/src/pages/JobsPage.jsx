// src/pages/JobsPage.jsx

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllJobs } from "../api/jobApi"; // your API
import { useNavigate } from "react-router-dom";
function JobsPage() {
  const [jobs, setJobs] = useState([]);
const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword") || "";
  const locationParam = params.get("location") || "";

const handleApply = async (jobId) => {

  const token = localStorage.getItem("token");

  // 🔥 NOT LOGGED IN
  if (!token) {
    navigate("/login");   // ✅ redirect
    return;
  }

  // ✅ LOGGED IN
  try {
    await applyToJob(jobId);
    alert("Applied successfully ✅");
  } catch (err) {
    alert("Already applied ❌");
  }
};

  useEffect(() => {
    getAllJobs().then((res) => {
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.jobs || [];

      setJobs(data);
    });
  }, []);

  useEffect(() => {
    console.log("UPDATED JOBS STATE:", jobs);
  }, [jobs]);

const search = (keyword || "").toLowerCase().trim();
const locSearch = (locationParam || "").toLowerCase().trim();

const filteredJobs = jobs.filter((job) => {
  const title = (job.title || "").toLowerCase();
  const desc = (job.description || "").toLowerCase();
  const loc = (job.location || job.companyName || "").toLowerCase();

  // ✅ separate conditions
  if (search && locSearch) {
    return (
      (title.includes(search) || desc.includes(search)) &&
      loc.includes(locSearch)
    );
  }

  if (search) {
    return title.includes(search) || desc.includes(search);
  }

  if (locSearch) {
    return loc.includes(locSearch);
  }

  return true; // show all if nothing typed
});
  console.log("Keyword:", keyword);
  console.log("Filtered Jobs:", filteredJobs);
return (
  <div className="jobs-container">

    {/* 🔝 HEADER */}
    <div className="jobs-header">
      <h2>💼 Find Your Dream Job</h2>

      <p className="results-text">
        Showing <b>{filteredJobs.length}</b> jobs
        {keyword && <> for "<b>{keyword}</b>"</>}
        {locationParam && <> in "<b>{locationParam}</b>"</>}
      </p>
    </div>

    {/* ❌ NO JOBS */}
    {filteredJobs.length === 0 ? (
      <div className="no-jobs">
        <h3>No jobs found 😔</h3>
        <p>Try different keywords or location</p>
      </div>
    ) : (

      /* 🔲 JOB GRID */
      <div className="jobs-grid">

        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">

            {/* 🔝 TOP */}
            <div className="job-top">
              <div>
                <h3>{job.title || "No Title"}</h3>
                <p className="company">
                  🏢 {job.companyName || "Company"}
                </p>
                <p className="location">
                  📍 {job.location || "Location"}
                </p>
              </div>

              <span className="badge">
                CGPA ≥ {job.minCgpa}
              </span>
            </div>

            {/* 📄 DESCRIPTION */}
            <p className="job-desc">
              {job.description || "No description available"}
            </p>

            {/* 🔽 DETAILS */}
            <div className="job-details">
              <span>📚 {job.eligibleBranch || "All Branches"}</span>
              <span>📅 {job.lastDate || "Open"}</span>
            </div>

            {/* 🔘 ACTIONS */}
            <div className="job-actions">

              <button
                className="apply-btn"
                onClick={() => handleApply(job.id)}
              >
                Apply Now 🚀
              </button>

              <button className="view-btn">
                View Details
              </button>

            </div>

          </div>
        ))}

      </div>
    )}

  </div>
);
}export default JobsPage;
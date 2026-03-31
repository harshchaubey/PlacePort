// src/pages/JobsPage.jsx

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllJobs, applyJob, getAppliedJobs } from "../api/jobApi";
import { GraduationCap, MapPin, ArrowRight, ArrowLeft, Search, Bookmark, CheckCircle } from "lucide-react";
import "./landing.css";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword") || "";
  const locationParam = params.get("location") || "";

  // Filter state — seeded from URL params passed by landing page search
  const [filterType, setFilterType] = useState(params.get("type") || "");
  const [filterCgpa, setFilterCgpa] = useState(params.get("cgpa") || "");
  const [filterLoc, setFilterLoc] = useState("");

  const getJobStatus = (jobId) => {
    const app = applications.find(a => (a.jobId || a.job?.id) === jobId);
    return app?.status || 'APPLIED';
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");

    // NOT LOGGED IN → redirect to login
    if (!token) {
      alert("🔒 Please login first to apply for this position!");
      navigate(`/login?redirect=/jobs&applyJobId=${jobId}`);
      return;
    }

    if (appliedJobs.includes(jobId)) {
      alert("You have already applied for this job.");
      return;
    }

    // LOGGED IN → call real API
    try {
      await applyJob(jobId);
      setAppliedJobs(prev => [...prev, jobId]);
      alert("Applied successfully ✅");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to apply.";
      alert(`Error: ${msg}`);
    }
  };

  // Auto-apply logic for returning users after authentication
  useEffect(() => {
    const applyJobId = params.get("applyJobId");
    const token = localStorage.getItem("token");
    
    if (applyJobId && token) {
      // Execute the apply flow automatically
      handleApply(applyJobId);
      
      // Clean up the URL so it doesn't trigger again on refresh
      params.delete("applyJobId");
      params.delete("redirect");
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [location.search]);

  // Load already-applied jobs on mount (if logged in)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getAppliedJobs()
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
          setApplications(data);
          setAppliedJobs(data.map(app => app.jobId || app.job?.id));
        })
        .catch(() => {}); // silently fail if not student
    }
  }, []);

  useEffect(() => {
    getAllJobs().then((res) => {
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.jobs || [];
      setJobs([...data].reverse());
    });
  }, []);

  const search = (keyword || "").toLowerCase().trim();
  const locSearch = (locationParam || filterLoc || "").toLowerCase().trim();

  const filteredJobs = jobs.filter((job) => {
    const title = (job.title || "").toLowerCase();
    const desc = (job.description || "").toLowerCase();
    const loc = (job.location || job.companyLocation || job.companyName || "").toLowerCase();
    const type = (job.jobType || "").toLowerCase();
    const cgpa = parseFloat(job.minCgpa) || 0;

    if (search && !(title.includes(search) || desc.includes(search))) return false;
    if (locSearch && !loc.includes(locSearch)) return false;
    if (filterType && type !== filterType.toLowerCase()) return false;
    if (filterCgpa && cgpa > parseFloat(filterCgpa)) return false;

    return true;
  });

  return (
    <div className="landing-wrapper" style={{ minHeight: "100vh" }}>
      {/* 🔮 Background Glow */}
      <div className="landing-bg-glow"></div>

      <div className="landing-content">
        {/* 🔝 GLASS NAVBAR */}
        <nav className="glass-nav">
          <div className="brand-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <GraduationCap className="text-primary" size={32} />
            PlacePort
          </div>
          <div className="nav-buttons">
            <button className="btn-login" onClick={() => navigate("/")}>
              <ArrowLeft size={16} style={{ marginRight: "0.5rem", verticalAlign: "sub" }} />
              Back to Home
            </button>
          </div>
        </nav>

        {/* 📋 HEADER SUMMARY */}
        <div style={{ padding: "4rem 5rem 2rem", textAlign: "center", position: "relative", zIndex: 10 }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem" }}>
            <span className="text-gradient">Explore Opportunities</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
            Showing <b>{filteredJobs.length}</b> matches
            {keyword && <> for "<span style={{ color: "var(--text-main)" }}>{keyword}</span>"</>}
            {locationParam && <> in "<span style={{ color: "var(--text-main)" }}>{locationParam}</span>"</>}
          </p>
        </div>

        {/* 🔽 FILTER BAR */}
        <div style={{ padding: "0 5rem 2rem", display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.9rem', cursor: 'pointer', outline: 'none' }}
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Part-time">Part-time</option>
          </select>

          <select
            value={filterCgpa}
            onChange={e => setFilterCgpa(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.9rem', cursor: 'pointer', outline: 'none' }}
          >
            <option value="">Any CGPA</option>
            <option value="6">Up to 6.0</option>
            <option value="7">Up to 7.0</option>
            <option value="8">Up to 8.0</option>
            <option value="9">Up to 9.0</option>
          </select>

          <input
            placeholder="Filter by location..."
            value={filterLoc}
            onChange={e => setFilterLoc(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
          />

          {(filterType || filterCgpa || filterLoc) && (
            <button
              onClick={() => { setFilterType(""); setFilterCgpa(""); setFilterLoc(""); }}
              style={{ background: 'rgba(255,77,77,0.15)', border: '1px solid rgba(255,77,77,0.3)', color: '#ff6b6b', padding: '0.6rem 1.2rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              ✕ Clear Filters
            </button>
          )}
        </div>
        {filteredJobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)", background: "var(--glass-bg)", margin: "0 5rem", borderRadius: "20px", border: "1px solid var(--glass-border)", backdropFilter: "blur(12px)" }}>
            <Search size={48} style={{ opacity: 0.5, marginBottom: "1rem" }} />
            <h3 style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>No jobs found</h3>
            <p>Try different keywords or adjusting your location filters.</p>
            <button className="btn-gradient mt-4" onClick={() => navigate("/jobs")}>Clear Filters</button>
          </div>
        ) : (
          /* 🔲 JOB GRID USING PREMIUM CARDS */
          <div className="jobs-grid" style={{ padding: "0 5rem 5rem" }}>
            {filteredJobs.map((job) => (
              <div className="job-preview-card" style={{ height: "100%" }} key={job._id || job.id}>
                
                <div className="job-header-row">
                  <h3>{job.title || "No Title"}</h3>
                  <span className="job-type-badge">{job.jobType || "Full-time"}</span>
                </div>
                
                <div className="job-salary">
                  {job.salary ? `💰 ${job.salary}` : "💰 Not Disclosed"}
                </div>

                <div className="job-skills">
                  {(job.requirements || job.skills || ["React.js", "Node.js", "MongoDB", "Express"]).slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-chip">{skill}</span>
                  ))}
                  {(job.requirements || job.skills || ["React.js", "Node", "Mongo", "Express"]).length > 3 && <span className="skill-chip">+</span>}
                </div>

                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                  <span style={{ marginRight: "1rem" }}>📚 CGPA ≥ {job.minCgpa || "N/A"}</span>
                  <span>📅 {job.lastDate || "Open Deadline"}</span>
                </div>

                <div className="job-footer-row" style={{ marginTop: "auto" }}>
                  <span className="job-company">{job.company?.name || job.companyName || "Premium Partner"}</span>
                  <div className="job-location">
                    <MapPin size={14} />
                    {job.companyLocation || job.location || "Remote / Hybrid"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button 
                    className="btn-apply" 
                    style={{ 
                      flex: 1, 
                      background: appliedJobs.includes(job.id) 
                        ? "linear-gradient(135deg, #00e676, #00b248)" 
                        : "linear-gradient(135deg, var(--primary), var(--secondary))", 
                      borderColor: "transparent", color: "white"
                    }}
                    onClick={() => handleApply(job.id)}
                    disabled={appliedJobs.includes(job.id)}
                  >
                    {appliedJobs.includes(job.id) 
                      ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                          <CheckCircle size={16}/>
                          {getJobStatus(job.id) === 'APPLIED' ? 'Applied' : getJobStatus(job.id)}
                        </div>
                      )
                      : <>Apply Now <ArrowRight size={16} style={{marginLeft: "5px", verticalAlign: "sub"}}/></>}
                  </button>
                  <button 
                    className="btn-apply"
                    style={{ flex: 1 }}
                  >
                    <Bookmark size={16} style={{marginRight: "5px", verticalAlign: "middle"}}/> Details
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default JobsPage;
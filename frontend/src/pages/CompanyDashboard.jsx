import { useEffect, useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth/auth";
import { getCurrentUser } from "../api/authApi";
import{ getCompanyProfile } from "../api/authApi";
import { createJob } from "../api/jobApi";
import { getCompanyJobs } from "../api/jobApi";
import { getApplicationsByJob } from "../api/authApi";
import { createPortal } from "react-dom";

function CompanyDashboard() {

  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [profile, setProfile] = useState({});
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [showApplicants, setShowApplicants] = useState(false);

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    minCgpa: ""
  });

  const navigate = useNavigate();

  const menuItems = [
    "Dashboard",
    "Post Job",
    "My Jobs",
    "Profile"
  ];



  const handleLogout = () => {
    logout();
    navigate("/login");
  };

 const handlePostJob = async () => {
   try {
     await createJob(jobData);  // ✅ no id
     alert("Job posted successfully ✅");
     setJobData({
       title: "",
       description: "",
       minCgpa: ""
     });
     setActiveMenu("Jobs"); // optional
   } catch (err) {
     console.error(err);
     alert("Error posting job ❌");
   }
 };
const handleViewApplicants = async (jobId) => {
  console.log("Function called with jobId:", jobId); // 👈 ADD

  try {
    const res = await getApplicationsByJob(jobId);
    console.log("Applications:", res.data);

    setJobApplications(
      Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.applications || []
    );

    setShowApplicants(true);

  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  const fetchData = async () => {
    try {
      const userRes = await getCurrentUser();
      setUser(userRes.data);

      const profileRes = await getCompanyProfile();
      setProfile(profileRes.data);

      // ✅ directly call applications API
      const res = await getCompanyJobs();
       console.log("Jobs:", res.data);
      setJobs(res.data);

    } catch (err) {
      console.error(err);
      alert("Error fetching data ❌");
    }
  };

  fetchData(); // ✅ VERY IMPORTANT

}, []);
console.log("showApplicants:", showApplicants);
  return (
    <div className="dashboard">

      {/* 🔵 SIDEBAR */}
      <div className="sidebar">
        <div className="logo">🏢</div>

        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={activeMenu === item ? "active" : ""}
              onClick={() => setActiveMenu(item)}
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="logout" onClick={handleLogout}>
          Logout
        </div>
      </div>

      {/* 🔷 MAIN */}
      <div
        className="main"
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#f5f7fb",
          minHeight: "100vh"
        }}
      >

        {/* 🔝 TOPBAR */}
        <div className="topbar">
          <h5>{user?.name || "Company"}</h5>
        </div>

        {/* 🔥 DASHBOARD */}
        {activeMenu === "Dashboard" && (
          <>
            <div className="welcome">
              <div>
                <h2>Welcome, {user?.name}</h2>
                <p>Manage your job postings</p>
              </div>
            </div>

            <div className="stats">
              <div className="card">
                <h3>{jobs.length}</h3>
                <p>Total Jobs Posted</p>
              </div>
            </div>
          </>
        )}

      {/* 🟢 POST JOB */}
      {activeMenu === "Post Job" && (
        <div
          className="card shadow"
          style={{
            borderRadius: "15px",
            padding: "25px",
            maxWidth: "500px",
            margin: "auto"
          }}
        >
          <h4 className="mb-4 text-center">🚀 Post a Job</h4>

          {/* Job Title */}
          <div className="mb-3">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter job title"
              value={jobData.title}
              onChange={(e) =>
                setJobData({ ...jobData, title: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter job description"
              value={jobData.description}
              onChange={(e) =>
                setJobData({ ...jobData, description: e.target.value })
              }
            />
          </div>

          {/* CGPA */}
          <div className="mb-3">
            <label className="form-label">Minimum CGPA</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 7.5"
              value={jobData.minCgpa}
              onChange={(e) =>
                setJobData({ ...jobData, minCgpa: e.target.value })
              }
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handlePostJob}
            className="btn btn-primary w-100"
            style={{
              borderRadius: "20px",
              fontWeight: "500"
            }}
          >
            ➕ Post Job
          </button>
        </div>
      )}


        {/* 🔵 MY JOBS */}
    {activeMenu === "My Jobs" && (
      <div className="jobs-container">
        <div className="jobs-header">
          <h2>My Jobs</h2>
          <span>{jobs.length} Jobs Posted</span>
        </div>

        {jobs.length === 0 ? (
          <div className="no-jobs">
            <p>No jobs posted yet 🚫</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div className="job-card" key={job.id}>

                <div className="job-top">
                  <h3>{job.title}</h3>
                  <span className="cgpa">CGPA ≥ {job.minCgpa}</span>
                </div>

                <p className="job-desc">{job.description}</p>

                <div className="job-actions">
                 <button
                   className="view-btn"
                   onClick={() => {
                     console.log("Clicked job:", job.id); // 👈 ADD THIS
                     handleViewApplicants(job.id);
                   }}
                 >
                   View Applicants
                 </button>
                  <button className="delete-btn">Delete</button>
                </div>

              </div>
            ))}
          </div>
        )}



      </div>
    )}

       {activeMenu === "Profile" && (
         <div className="animate__animated animate__fadeIn">
           {/* Header Section */}
           <div className="d-flex align-items-center mb-4">
             <div
               className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white shadow-sm"
               style={{ width: '64px', height: '64px', fontSize: '24px', fontWeight: 'bold' }}
             >
               {profile?.companyName?.charAt(0) || "C"}
             </div>
             <div className="ms-3">
               <h4 className="mb-0 fw-bold text-dark">Company Profile</h4>
               <p className="text-muted small mb-0">Manage your organization details</p>
             </div>
           </div>

           <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
             <div className="card-body p-4">
               <div className="row g-4">

                 {/* Company Name Tile */}
                 <div className="col-md-6">
                   <label className="text-uppercase text-muted fw-bold small mb-1 d-block" style={{ letterSpacing: '1px' }}>
                     Company Name
                   </label>
                   <div className="p-3 bg-light rounded-3 border-start border-primary border-4">
                     <span className="fw-semibold text-dark">{profile?.companyName || "Not Set"}</span>
                   </div>
                 </div>

                 {/* Email Tile */}
                 <div className="col-md-6">
                   <label className="text-uppercase text-muted fw-bold small mb-1 d-block" style={{ letterSpacing: '1px' }}>
                     Registered Email
                   </label>
                   <div className="p-3 bg-light rounded-3 border-start border-info border-4">
                     <span className="fw-semibold text-dark">{profile?.email}</span>
                   </div>
                 </div>

                 {/* Location Tile */}
                 <div className="col-12">
                   <label className="text-uppercase text-muted fw-bold small mb-1 d-block" style={{ letterSpacing: '1px' }}>
                     Headquarters / Location
                   </label>
                   <div className="p-3 bg-light rounded-3 border-start border-success border-4 d-flex align-items-center">
                     <i className="bi bi-geo-alt-fill text-success me-2"></i>
                     <span className="fw-semibold text-dark">{profile?.location || "Address not provided"}</span>
                   </div>
                 </div>

               </div>

               {/* Action Button */}
               <div className="mt-4 pt-3 border-top">
                 <button className="btn btn-outline-primary btn-sm rounded-pill px-4">
                   Edit Profile
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

{showApplicants &&
  createPortal(
    <div className="modal">
      <div className="modal-content">

        <h2>Applicants</h2>

        {jobApplications.length > 0 ? (
          jobApplications.map((app) => (
            <div key={app.id} className="app-card">
              <h3>{app.studentName}</h3>
              <p>Job: {app.jobTitle}</p>
              <p>Status: {app.status}</p>
            </div>
          ))
        ) : (
          <p>No applicants</p>
        )}

        <button onClick={() => setShowApplicants(false)}>
          Close
        </button>



      </div>
    </div>,
    document.body   // 🔥 THIS FIXES EVERYTHING
  )
}
      </div>
    </div>
  );
}

export default CompanyDashboard;
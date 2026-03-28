import { useEffect, useState } from "react";
import "./dashboard.css";
import { getAllJobs, getAppliedJobs } from "../api/jobApi";
import { getCurrentUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth/auth";
import { getStudentProfile} from "../api/authApi";
import { applyJob } from "../api/jobApi";


function StudentDashboard() {


  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [resumeFiles, setResumeFiles] = useState({});
  const [applications, setApplications] = useState([]);
    const navigate = useNavigate();
  // Sidebar menu (dynamic)

  const handleLogout = () => {
    logout();          // remove token
    navigate("/login"); // redirect
  };

  const handleFileChange = (jobId, file) => {
    setResumeFiles(prev => ({
      ...prev,
      [jobId]: file
    }));
  };


   const handleApply = async (jobId) => {
     try {
       const file = resumeFiles[jobId];

       if (!file) {
         alert("Please upload resume first ❗");
         return;
       }

       // ✅ only PDF
       if (file.type !== "application/pdf") {
         alert("Only PDF allowed ❌");
         return;
       }

       const formData = new FormData();
       formData.append("resume", file);

       await applyJob(jobId, formData);

       setAppliedJobs(prev =>
         prev.includes(jobId) ? prev : [...prev, jobId]
       );

       alert("Applied successfully ✅");

     } catch (err) {
       console.error(err);
       alert("Error applying ❌");
     }
   };
  const menuItems = [
    "Dashboard",
    "Jobs",
    "Applications",
    "Profile",
    "Settings"
  ];

  // Load user + dummy jobs
useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔥 fetch from backend
        const userRes = await getCurrentUser();
        const jobsRes = await getAllJobs();
        const appliedRes = await getAppliedJobs();
        const ProfileRes = await getStudentProfile();

        setUser(userRes.data);
        setJobs(jobsRes.data);
        setApplications(appliedRes.data); // ✅ full data
        setAppliedJobs(appliedRes.data.map(app => app.jobId));
        setProfile(ProfileRes.data);

      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">

      {/* 🔵 SIDEBAR */}
      <div className="sidebar">
        <div className="logo">🎓</div>

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

        <div
          className="logout"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
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
       //minHeight: "100vh"
     }}
   >

     {/* 🔝 TOPBAR */}
  <div
    className="topbar"
    style={{
      background: "linear-gradient(0deg, rgba(34, 195, 155, 1) 0%, rgba(255, 178, 13, 1) 100%)",
      padding: "10px 20px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      marginBottom: "20px",
      color: "white"
    }}
  >
       <input placeholder="Search jobs..." />

       <div className="profile">

         <div>
           <h6>{user?.name || "User"}</h6>
           <span>{user?.branch || "Branch"}</span>
         </div>
       </div>
     </div>

     {/* 🔥 CONDITIONAL UI */}

     {/* 🟢 DASHBOARD */}
     {activeMenu === "Dashboard" && (
       <>
         <div
           className="welcome"
           style={{
             background: "#4facfe",
             color: "white",
             borderRadius: "15px",
             padding: "20px",
             display: "flex",
             justifyContent: "space-between",
             alignItems: "center",
             marginBottom: "20px"
           }}
         >
           <div>
             <p>{new Date().toDateString()}</p>
             <h2>Welcome back, {user?.name || "User"}!</h2>
             <span>Stay updated with your placement portal</span>
           </div>

           <img
             src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
             width="120"
           />
         </div>

         <div className="stats" style={{ display: "flex", gap: "20px" }}>

           <div className="card p-3 shadow-sm">
             <h3>{jobs.length}</h3>
             <p>Available Jobs</p>
           </div>

           <div className="card p-3 shadow-sm">
             <h3>{appliedJobs.length}</h3>
             <p>Applied Jobs</p>
           </div>

           <div className="card p-3 shadow-sm">
             <h3>{user?.cgpa || 0}</h3>
             <p>CGPA</p>
           </div>

         </div>
       </>
     )}

     {/* 🔵 JOBS */}
{activeMenu==="Jobs" &&
    <div className="container py-4">
  <div className="row">
    {jobs.map((job) => (
      <div key={job.id} className="col-12 col-md-6 col-lg-4 mb-4">
        <div
          className="job-card h-100"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            padding: "24px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
            border: "1px solid rgba(79, 172, 254, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "transform 0.2s ease-in-out"
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          {/* 🔹 HEADER */}
          <div>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5 style={{ fontWeight: "700", color: "#2d3436", margin: 0 }}>
                {job.title}
              </h5>
              <span
                style={{
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  textTransform: "uppercase"
                }}
              >
                {job.companyName}
              </span>
            </div>

            {/* 🔹 DETAILS */}
            <div className="mt-3">
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#f0f7ff",
                  padding: "6px 12px",
                  borderRadius: "10px"
                }}
              >
                <span style={{ fontSize: "14px", color: "#4facfe" }}>
                  🎓 Min CGPA: <strong>{job.minCgpa}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 🔹 FOOTER/BUTTON */}
         <div className="mt-4">

           {/* 📄 Upload Resume */}
           <input
             type="file"
             accept="application/pdf"
             onChange={(e) => handleFileChange(job.id, e.target.files[0])}
             style={{ marginBottom: "10px" }}
           />
             {/* 🚀 Apply Button */}
             <button
               type="button"
               onClick={() => handleApply(job.id)}
               disabled={appliedJobs.includes(job.id)}
               className="btn"
               style={{
                 background: appliedJobs.includes(job.id) ? "#27ae60" : "#4facfe",
                 color: "white",
                 borderRadius: "12px",
                 padding: "8px 20px",
                 fontWeight: "600",
                 border: "none"
               }}
             >
               {appliedJobs.includes(job.id) ? "Applied ✓" : "Apply Now →"}
             </button>

            <span style={{ fontSize: "11px", color: "#b2bec3", fontWeight: "500" }}>
              ID: #{job.id}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>}

 {/* 🟡 APPLICATIONS */}
 {/* 🟡 APPLICATIONS */}
 {activeMenu === "Applications" && (
   <div>
     <h4>Applied Jobs</h4>

     {applications.length === 0 ? (
       <p>No applications yet</p>
     ) : (
       applications.map((app) => (

         <div
           key={app.id}
           style={{
             background: "#fff",
             padding: "15px",
             borderRadius: "10px",
             marginBottom: "10px",
             boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
           }}
         >
           <h5>{app.jobTitle}</h5>
           <p>{app.companyName}</p>

           <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

             {/* ✅ STATUS */}
             <span style={{ color: "#27ae60", fontWeight: "bold" }}>
               {app.status}
             </span>

           {/* 📄 VIEW RESUME */}
<a
  href={
    app.resumePath?.startsWith("http") 
      ? app.resumePath                                // Use Cloudinary link directly
      : `https://placement-portal-full-production.up.railway.app/uploads/${app.resumePath}` // Use Railway Backend for old files
  }
  target="_blank"
  rel="noreferrer"
  style={{
    color: "#4facfe",
    textDecoration: "none",
    fontWeight: "600"
  }}
>
  View Resume 📄
</a>

           </div>
         </div>
       ))
     )}
   </div>
 )}

     {/* 🟣 PROFILE */}
{activeMenu === "Profile" && (
  <div
    className="card shadow"
    style={{
      borderRadius: "15px",
      padding: "25px",
      background: "linear-gradient(135deg, #fdfbfb, #ebedee)"
    }}
  >
    <h4 className="mb-4 text-center" style={{ fontWeight: "bold" }}>
      👤 My Profile
    </h4>

    {/* Profile Avatar */}
    <div className="text-center mb-4">
      <img
       // src="https://i.pravatar.cc/100"
        alt="profile"
        style={{
          borderRadius: "50%",
          border: "3px solid #4facfe"
        }}
      />
    </div>

    {/* Info Grid */}
    <div className="row">

      <div className="col-md-6 mb-3">
        <div className="p-3 bg-white rounded shadow-sm">
          <strong>Email</strong>
          <p className="mb-0 text-muted">{user?.email}</p>
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <div className="p-3 bg-white rounded shadow-sm">
          <strong>Name</strong>
          <p className="mb-0 text-muted">{profile?.name}</p>
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <div className="p-3 bg-white rounded shadow-sm">
          <strong>Roll No</strong>
          <p className="mb-0 text-muted">{profile?.rollNo}</p>
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <div className="p-3 bg-white rounded shadow-sm">
          <strong>Branch</strong>
          <p className="mb-0 text-muted">{profile?.branch}</p>
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <div className="p-3 bg-white rounded shadow-sm">
          <strong>CGPA</strong>
          <p className="mb-0 text-muted">{profile?.cgpa}</p>
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <div className="p-3 bg-white rounded shadow-sm">
          <strong>Year</strong>
          <p className="mb-0 text-muted">{profile?.year}</p>
        </div>
      </div>

    </div>

    {/* Edit Button */}
    <div className="text-center mt-3">
      <button className="btn btn-primary px-4">
        ✏ Edit Profile
      </button>
    </div>

  </div>
)}

   </div>

      </div>

  );
}

export default StudentDashboard;

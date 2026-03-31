import { useEffect, useState, useRef } from "react";
import "./dashboard.css";
import { getAllJobs, getAppliedJobs } from "../api/jobApi";
import { getCurrentUser } from "../api/authApi";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../auth/auth";
import { getStudentProfile } from "../api/authApi";
import { applyJob } from "../api/jobApi";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileCheck, 
  User, 
  Settings, 
  LogOut, 
  GraduationCap, 
  Search, 
  MapPin, 
  CheckCircle,
  FileText,
  Mail,
  ChevronDown
} from "lucide-react";

function StudentDashboard() {
  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?tab= param from URL to set initial active tab
  const initialTab = new URLSearchParams(location.search).get("tab") || "Dashboard";
  const [activeMenu, setActiveMenu] = useState(initialTab);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleApply = async (jobId) => {
    try {
      await applyJob(jobId);

      // Refresh applications from backend secretly to ensure tabs update
      try {
        const appliedRes = await getAppliedJobs();
        const appData = Array.isArray(appliedRes.data) 
          ? appliedRes.data 
          : appliedRes.data.data || appliedRes.data.applications || [];
        setApplications(appData); 
        setAppliedJobs(appData.map(app => app.jobId || app.job?.id));
      } catch(e) {
        console.error("Warning: Could not refresh applications tab automatically.");
      }

      alert("Applied successfully ✅");

    } catch (err) {
      console.error(err);
      alert("Error applying ❌");
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Applications", icon: <FileCheck size={20} /> },
    { name: "Profile", icon: <User size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        setUser(userRes.data);
        
        const jobsRes = await getAllJobs();
        setJobs(jobsRes.data);
      } catch (err) {
        console.error("Error loading core data:", err);
      }

      try {
        const appliedRes = await getAppliedJobs();
        const appData = Array.isArray(appliedRes.data) 
          ? appliedRes.data 
          : appliedRes.data.data || appliedRes.data.applications || [];
          
        setApplications(appData); 
        setAppliedJobs(appData.map(app => app.jobId || app.job?.id));
      } catch (err) {
        console.error("Error loading applications:", err);
      }

      try {
        const ProfileRes = await getStudentProfile();
        setProfile(ProfileRes.data);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchData();
  }, []);

  // Helper to get status by jobId
  const getJobStatus = (jobId) => {
    const app = applications.find(a => (a.jobId || a.job?.id) === jobId);
    return app?.status || null;
  };

  return (
    <div className="dashboard-wrapper">

      {/* 🔮 Background Glow */}
      <div className="landing-bg-glow"></div>

      {/* 🔵 SIDEBAR */}
      <div className="sidebar">
        <div className="brand-logo" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
          <GraduationCap className="icon" size={32} />
          PlacePort
        </div>

        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={activeMenu === item.name ? "active" : ""}
              onClick={() => setActiveMenu(item.name)}
            >
              <span className="icon">{item.icon}</span>
              {item.name}
            </li>
          ))}
        </ul>

        <div className="logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>

      {/* 🔷 MAIN CONTENT */}
      <div className="main-content">

        {/* 🔝 TOPBAR */}
        <div className="topbar">
          <h2>{activeMenu}</h2>
          
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <div className="search-input-group" style={{background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '5px 15px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              <Search size={16} color="var(--text-muted)" />
              <input 
                placeholder="Search jobs..." 
                style={{background: 'transparent', border: 'none', color: 'white', outline: 'none', padding: '5px 0'}} 
              />
            </div>
            
            {/* Profile Dropdown Avatar */}
            <div ref={profileMenuRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setShowProfileMenu(prev => !prev)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'var(--glass-bg)', padding: '8px 15px',
                  borderRadius: '30px', border: '1px solid var(--glass-border)',
                  backdropFilter: 'blur(10px)', cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '1rem'
                }}>
                  {profile?.name?.charAt(0) || user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', lineHeight: '1' }}>
                    {profile?.name?.split(' ')[0] || "Student"}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {profile?.branch || "Student"}
                  </div>
                </div>
                <ChevronDown size={16} color="var(--text-muted)" style={{ transition: 'transform 0.2s', transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </div>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: 'rgba(15, 15, 30, 0.95)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '8px', minWidth: '200px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)',
                  zIndex: 1000, animation: 'fadeSlideDown 0.15s ease-out'
                }}>
                  {/* User info header */}
                  <div style={{ padding: '10px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '6px' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{profile?.name || user?.name || "Student"}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user?.email || ""}</div>
                  </div>

                  {[
                    { label: 'My Profile', icon: <User size={15} />, menu: 'Profile' },
                    { label: 'Applications', icon: <FileCheck size={15} />, menu: 'Applications' },
                    { label: 'Settings', icon: <Settings size={15} />, menu: 'Settings' },
                  ].map(item => (
                    <div
                      key={item.menu}
                      onClick={() => { setActiveMenu(item.menu); setShowProfileMenu(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                        color: 'var(--text-muted)', fontSize: '0.9rem',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,172,254,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ color: '#4facfe' }}>{item.icon}</span>
                      {item.label}
                    </div>
                  ))}

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '6px', paddingTop: '6px' }}>
                    <div
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                        color: '#ff6b6b', fontSize: '0.9rem', transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} /> Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🟢 DASHBOARD */}
        {activeMenu === "Dashboard" && (
          <div className="animate__animated animate__fadeIn">
            <div className="welcome-widget" style={{background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15), rgba(0, 242, 254, 0.15))'}}>
              <h1>Welcome back, <span style={{color: '#4facfe'}}>{user?.name?.split(' ')[0] || "Student"}</span> 👋</h1>
              <p>{new Date().toDateString()} • Stay updated with your placement journey</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{color: '#4facfe', background: 'rgba(79, 172, 254, 0.1)'}}>
                  <Briefcase strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{jobs.length}</h3>
                  <p>Available Jobs</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{color: '#00e676', background: 'rgba(0, 230, 118, 0.1)'}}>
                  <FileCheck strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{appliedJobs.length}</h3>
                  <p>Applied Jobs</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{color: '#ffb20d', background: 'rgba(255, 178, 13, 0.1)'}}>
                  <GraduationCap strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{profile?.cgpa || 0}</h3>
                  <p>Current CGPA</p>
                </div>
              </div>
            </div>

            {/* 🕒 RECENT ACTIVITY */}
            <div style={{marginTop: '3rem'}}>
              <h3 style={{fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px'}}>
                <FileCheck size={20} color="#4facfe" /> Recent Activity
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {applications.slice(0, 3).map(app => {
                  const status = app.status || 'APPLIED';
                  const isPositive = ['HIRED', 'SHORTLISTED', 'INTERVIEW'].includes(status);
                  return (
                    <div key={app.id} style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                      borderRadius: '16px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '12px',
                          background: isPositive ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPositive ? '#00e676' : '#aaa'
                        }}>
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <div style={{fontWeight: '600', fontSize: '0.95rem'}}>{app.jobTitle}</div>
                          <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{app.companyName}</div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.8rem', fontWeight: '700', padding: '4px 12px', borderRadius: '20px',
                        background: isPositive ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        color: isPositive ? '#00e676' : 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {status}
                      </span>
                    </div>
                  );
                })}
                {applications.length === 0 && (
                   <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem'}}>No recent activity yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 🔵 JOBS BROWSER */}
        {activeMenu === "Jobs" && (
          <div className="animate__animated animate__fadeIn">
            <div className="jobs-grid-glass">
              {jobs.map((job) => (
                <div className="job-glass-card" key={job.id}>
                  <div className="job-glass-header">
                    <h3>{job.title}</h3>
                    <span className="glass-badge" style={{background: 'rgba(79, 172, 254, 0.1)', color: '#4facfe', borderColor: 'rgba(79, 172, 254, 0.3)'}}>
                      {job.companyName}
                    </span>
                  </div>
                  
                  <p className="job-glass-desc" style={{marginBottom: "1rem"}}>
                    {job.description || "No description provided by the employer."}
                  </p>
                  
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1.5rem', fontSize: '0.85rem', color: "var(--text-muted)"}}>
                    <div style={{background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
                      🎓 Min CGPA: <strong style={{color: '#4facfe'}}>{job.minCgpa}</strong>
                    </div>
                    {job.salary && (
                      <div style={{background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
                        💰 {job.salary}
                      </div>
                    )}
                    <div style={{background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
                      📍 {job.companyLocation || job.location || "Remote / Hybrid"}
                    </div>
                  </div>
                  


                  <div className="job-glass-actions">
                    <button
                      type="button"
                      onClick={() => handleApply(job.id)}
                      disabled={appliedJobs.includes(job.id)}
                      className="btn-glass-action"
                      style={{
                        background: appliedJobs.includes(job.id) ? 'rgba(0, 230, 118, 0.2)' : 'rgba(79, 172, 254, 0.2)',
                        borderColor: appliedJobs.includes(job.id) ? 'rgba(0, 230, 118, 0.4)' : 'rgba(79, 172, 254, 0.4)',
                        color: appliedJobs.includes(job.id) ? '#00e676' : 'white',
                        width: '100%'
                      }}
                    >
                      {appliedJobs.includes(job.id) ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                          <CheckCircle size={16} /> 
                          {getJobStatus(job.id) === 'APPLIED' ? 'Applied Successfully' : `Status: ${getJobStatus(job.id)}`}
                        </div>
                      ) : "Apply Now →"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🟡 APPLICATIONS */}
        {activeMenu === "Applications" && (
          <div className="animate__animated animate__fadeIn">
            {applications.length === 0 ? (
              <div style={{textAlign: 'center', padding: '5rem', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)'}}>
                <FileCheck size={48} style={{opacity: 0.3, marginBottom: '1rem', color: '#00e676'}} />
                <h3>No applications yet</h3>
                <p style={{color: 'var(--text-muted)'}}>Head over to the Jobs page to start applying!</p>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {applications.map((app) => {
                  const status = app.status || 'APPLIED';
                  const statusConfig = {
                    APPLIED:     { color: '#4facfe', label: 'Applied' },
                    SHORTLISTED: { color: '#ffb20d', label: 'Shortlisted 🌟' },
                    INTERVIEW:   { color: '#c98cff', label: 'Interview Scheduled 📅' },
                    HIRED:       { color: '#00e676', label: 'Hired 🎉' },
                    REJECTED:    { color: '#ff4d4d', label: 'Rejected' },
                  }[status] || { color: '#aaa', label: status };

                  return (
                    <div key={app.id} className="job-glass-card" style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem'}}>
                      <div>
                        <h3 style={{margin: '0 0 0.3rem 0'}}>{app.jobTitle}</h3>
                        <p style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem'}}>{app.companyName}</p>
                      </div>

                      <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                        {/* Color-coded status badge */}
                        <div style={{textAlign: 'right'}}>
                          <div style={{fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px'}}>Status</div>
                          <span style={{
                            background: `${statusConfig.color}22`,
                            color: statusConfig.color,
                            border: `1px solid ${statusConfig.color}55`,
                            borderRadius: '20px', padding: '0.3rem 0.9rem',
                            fontWeight: '700', fontSize: '0.85rem', whiteSpace: 'nowrap'
                          }}>
                            {statusConfig.label}
                          </span>
                        </div>

                        <a
                          href={`https://docs.google.com/viewer?url=${encodeURIComponent(app.resumePath?.startsWith("http") ? app.resumePath : `https://placement-portal-full-production.up.railway.app/uploads/${app.resumePath}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-glass-action"
                          style={{background: 'rgba(255,255,255,0.05)', textDecoration: 'none', padding: '0.6rem 1.2rem', color: 'var(--text-main)'}}
                        >
                          <FileText size={16} /> Resume
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 🟣 PROFILE */}
        {activeMenu === "Profile" && (
          <div className="profile-glass-card animate__animated animate__fadeIn">
            <div className="profile-header" style={{borderBottomColor: 'rgba(79, 172, 254, 0.2)'}}>
              <div className="profile-avatar" style={{background: 'linear-gradient(135deg, #4facfe, #00f2fe)', boxShadow: '0 10px 20px rgba(79, 172, 254, 0.3)'}}>
                 {profile?.name?.charAt(0) || user?.name?.charAt(0) || "S"}
              </div>
              <div>
                <h2 style={{margin: '0 0 0.2rem 0', padding: 0, border: 'none'}}>{profile?.name || user?.name || "Student Name"}</h2>
                <p style={{color: '#4facfe', margin: 0, fontWeight: '500'}}>{profile?.branch || "-"} • Class of {profile?.year || "-"}</p>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-field-glass" style={{borderLeftColor: '#4facfe'}}>
                <div className="profile-field-icon" style={{background: 'rgba(79, 172, 254, 0.1)', color: '#4facfe'}}><User /></div>
                <div className="profile-field-info">
                  <label>Full Name</label>
                  <span>{profile?.name || user?.name || "Not Set"}</span>
                </div>
              </div>

              <div className="profile-field-glass" style={{borderLeftColor: '#4facfe'}}>
                <div className="profile-field-icon" style={{background: 'rgba(79, 172, 254, 0.1)', color: '#4facfe'}}><Mail /></div>
                <div className="profile-field-info">
                  <label>College Email</label>
                  <span>{user?.email || "Not Set"}</span>
                </div>
              </div>

              <div className="profile-field-glass" style={{borderLeftColor: '#00e676'}}>
                <div className="profile-field-icon" style={{background: 'rgba(0, 230, 118, 0.1)', color: '#00e676'}}><CheckCircle /></div>
                <div className="profile-field-info">
                  <label>Roll Number</label>
                  <span>{profile?.rollNo || "Not Set"}</span>
                </div>
              </div>

              <div className="profile-field-glass" style={{borderLeftColor: '#ffb20d'}}>
                <div className="profile-field-icon" style={{background: 'rgba(255, 178, 13, 0.1)', color: '#ffb20d'}}><GraduationCap /></div>
                <div className="profile-field-info">
                  <label>Aggregate CGPA</label>
                  <span>{profile?.cgpa || "0.0"}</span>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', marginBottom: '1rem' }}>Resume</h4>
              {profile?.resumePath ? (() => {
                const rawUrl = profile.resumePath.startsWith("http")
                  ? profile.resumePath
                  : `https://placement-portal-full-production.up.railway.app/uploads/${profile.resumePath}`;
                const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}`;
                return (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(79, 172, 254, 0.07)', border: '1px solid rgba(79, 172, 254, 0.2)',
                    borderRadius: '16px', padding: '1.2rem 1.5rem', borderLeft: '4px solid #4facfe'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(79, 172, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4facfe' }}>
                        <FileText size={22} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'white', fontSize: '0.95rem' }}>resume.pdf</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Uploaded to Cloudinary</div>
                      </div>
                    </div>
                    <a
                      href={viewerUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(79,172,254,0.15)', color: '#4facfe', padding: '0.6rem 1.2rem',
                        borderRadius: '10px', border: '1px solid rgba(79,172,254,0.3)', fontWeight: '600',
                        fontSize: '0.88rem', transition: 'all 0.2s'
                      }}
                    >
                      <FileText size={15} /> View Resume
                    </a>
                  </div>
                );
              })() : (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '1.2rem 1.5rem'
                }}>
                  <FileText size={22} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No resume uploaded yet. Update your profile to upload one.</span>
                </div>
              )}
            </div>

            <button className="btn-glossy" style={{background: 'linear-gradient(135deg, #4facfe, #00f2fe)', marginTop: '3rem', width: 'auto', padding: '1rem 3rem', marginLeft: 'auto', display: 'flex', boxShadow: '0 10px 20px rgba(79, 172, 254, 0.3)'}}>
              Edit Profile details
            </button>
          </div>
        )}
        
        {/* Settings Stub */}
        {activeMenu === "Settings" && (
           <div className="animate__animated animate__fadeIn" style={{textAlign: 'center', padding: '5rem'}}>
             <Settings size={48} style={{opacity: 0.3, marginBottom: '1rem', color: 'var(--text-muted)'}} />
             <h3>Account Settings</h3>
             <p style={{color: 'var(--text-muted)'}}>Password and security settings coming soon.</p>
           </div>
        )}

      </div>
    </div>
  );
}

export default StudentDashboard;

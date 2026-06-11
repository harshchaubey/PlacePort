import { useEffect, useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth/auth";
import { getCurrentUser, getCompanyProfile, getApplicationsByJob, updateApplicationStatus } from "../api/authApi";
import { createJob, getCompanyJobs } from "../api/jobApi";
import { createPortal } from "react-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  User, 
  LogOut, 
  MapPin, 
  Building, 
  Mail, 
  Users, 
  CheckCircle,
  GraduationCap,
  FileText,
  Menu
} from "lucide-react";

function CompanyDashboard() {
  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [profile, setProfile] = useState({});
  const [showApplicants, setShowApplicants] = useState(false);
  const [jobApplications, setJobApplications] = useState([]);
  const [appStatuses, setAppStatuses] = useState({});
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    minCgpa: "",
    salary: "",
    eligibleBranch: "",
    lastDate: "",
    skills: ""
  });

  const [responsibilities, setResponsibilities] = useState([""]);
  const [requirements, setRequirements] = useState([""]);

  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Post Job", icon: <PlusCircle size={20} /> },
    { name: "My Jobs", icon: <Briefcase size={20} /> },
    { name: "Profile", icon: <User size={20} /> }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePostJob = async () => {
    try {
      const payload = {
        ...jobData,
        skills: jobData.skills ? jobData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        responsibilities: responsibilities.filter(r => r.trim() !== ''),
        requirements: requirements.filter(r => r.trim() !== '')
      };
      await createJob(payload);
      showToast("Job posted successfully! 🚀", 'success');
      setJobData({
        title: "",
        description: "",
        minCgpa: "",
        salary: "",
        eligibleBranch: "",
        lastDate: "",
        skills: ""
      });
      setResponsibilities([""]);
      setRequirements([""]);
      
      // refresh jobs
      const res = await getCompanyJobs();
      setJobs(res.data);

      setActiveMenu("My Jobs"); 
    } catch (err) {
      console.error(err);
      showToast("Failed to post job. Please try again.", 'error');
    }
  };

  const handleViewApplicants = async (jobId) => {
    try {
      const res = await getApplicationsByJob(jobId);
      const apps = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.applications || [];
      setJobApplications(apps);
      // Seed the local status map so dropdowns show current status
      const statusMap = {};
      apps.forEach(app => { statusMap[app.id] = app.status; });
      setAppStatuses(statusMap);
      setShowApplicants(true);
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (appId, newStatus) => {
    const prevStatus = appStatuses[appId];
    setAppStatuses(prev => ({ ...prev, [appId]: newStatus }));
    try {
      await updateApplicationStatus(appId, newStatus);
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error("Failed to update status:", err);
      // Revert optimistic update
      setAppStatuses(prev => ({ ...prev, [appId]: prevStatus }));
      showToast('Could not update status. Please try again.', 'error');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        setUser(userRes.data);

        const profileRes = await getCompanyProfile();
        setProfile(profileRes.data);

        const res = await getCompanyJobs();
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
    <div className="dashboard-wrapper">
      
      {/* 🔮 Background Glow */}
      <div className="landing-bg-glow"></div>

      {/* Mobile Overlay */}
      <div className={`overlay ${isMobileMenuOpen ? 'show' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      {/* 🔵 SIDEBAR */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="brand-logo" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
          <GraduationCap className="icon" size={32} />
          PlacePort
        </div>

        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={activeMenu === item.name ? "active" : ""}
              onClick={() => { setActiveMenu(item.name); setIsMobileMenuOpen(false); }}
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

      {/* 🔷 MAIN */}
      <div className="main-content">
        
        {/* 🔝 TOPBAR */}
        <div className="topbar">
          <div className="topbar-header">
            <div className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </div>
            <h2>{activeMenu}</h2>
          </div>
          <div className="profile-badge" style={{display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--glass-bg)', padding: '10px 20px', borderRadius: '30px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)'}}>
            <Building size={18} color="var(--primary)" />
            <span style={{fontWeight: '600'}}>{user?.name || "Company Portal"}</span>
          </div>
        </div>

        {/* 🔥 DASHBOARD */}
        {activeMenu === "Dashboard" && (
          <div className="animate__animated animate__fadeIn">
            <div className="welcome-widget">
              <h1>Welcome back, <span style={{color: '#ff0080'}}>{user?.name?.split(' ')[0] || "Partner"}</span> 👋</h1>
              <p>Here's what's happening with your job postings today.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Briefcase strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{jobs.length}</h3>
                  <p>Active Postings</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{color: '#ff0080', background: 'rgba(255, 0, 128, 0.1)'}}>
                  <Users strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0)}</h3>
                  <p>Total Applicants</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{color: '#00e676', background: 'rgba(0, 230, 118, 0.1)'}}>
                  <CheckCircle strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{jobs.length > 0 ? "—" : 0}</h3>
                  <p>View in Applicants</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === "Post Job" && (
          <div className="glass-form-card animate__animated animate__fadeInUp">
            <h3>🚀 Create New Posting</h3>

            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Select or enter job title"
                list="job-titles"
                value={jobData.title}
                onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              />
              <datalist id="job-titles">
                <option value="Software Engineer" />
                <option value="Frontend Developer" />
                <option value="Backend Developer" />
                <option value="Full Stack Developer" />
                <option value="Android Developer" />
                <option value="Data Analyst" />
                <option value="UI/UX Designer" />
                <option value="Cybersecurity" />
              </datalist>
            </div>

            <div className="form-group">
              <label>Role Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Brief overview of the role..."
                value={jobData.description}
                onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              />
            </div>

            {/* Responsibilities */}
            <div className="form-group">
              <label style={{display:'flex', alignItems:'center', gap:'8px'}}>
                📋 Responsibilities
                <span style={{fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:'400'}}>Add bullet points</span>
              </label>
              <div style={{display:'flex', flexDirection:'column', gap:'0.6rem'}}>
                {responsibilities.map((item, idx) => (
                  <div key={idx} style={{display:'flex', alignItems:'center', gap:'0.6rem'}}>
                    <span style={{color:'var(--primary)', fontSize:'1.1rem', flexShrink:0}}>•</span>
                    <input
                      type="text"
                      className="form-control"
                      style={{margin:0}}
                      placeholder={`Responsibility ${idx + 1}...`}
                      value={item}
                      onChange={(e) => {
                        const updated = [...responsibilities];
                        updated[idx] = e.target.value;
                        setResponsibilities(updated);
                      }}
                    />
                    {responsibilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setResponsibilities(prev => prev.filter((_, i) => i !== idx))}
                        style={{background:'rgba(255,77,77,0.15)', border:'1px solid rgba(255,77,77,0.3)', color:'#ff6b6b', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', flexShrink:0}}
                      >✕</button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setResponsibilities(prev => [...prev, ''])}
                  style={{background:'rgba(79,172,254,0.1)', border:'1px dashed rgba(79,172,254,0.4)', color:'#4facfe', borderRadius:'10px', padding:'0.5rem 1rem', cursor:'pointer', fontSize:'0.88rem', alignSelf:'flex-start', marginTop:'0.2rem'}}
                >+ Add Responsibility</button>
              </div>
            </div>

            {/* Requirements */}
            <div className="form-group">
              <label style={{display:'flex', alignItems:'center', gap:'8px'}}>
                ✅ Requirements
                <span style={{fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:'400'}}>Add bullet points</span>
              </label>
              <div style={{display:'flex', flexDirection:'column', gap:'0.6rem'}}>
                {requirements.map((item, idx) => (
                  <div key={idx} style={{display:'flex', alignItems:'center', gap:'0.6rem'}}>
                    <span style={{color:'#00e676', fontSize:'1.1rem', flexShrink:0}}>•</span>
                    <input
                      type="text"
                      className="form-control"
                      style={{margin:0}}
                      placeholder={`Requirement ${idx + 1}...`}
                      value={item}
                      onChange={(e) => {
                        const updated = [...requirements];
                        updated[idx] = e.target.value;
                        setRequirements(updated);
                      }}
                    />
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setRequirements(prev => prev.filter((_, i) => i !== idx))}
                        style={{background:'rgba(255,77,77,0.15)', border:'1px solid rgba(255,77,77,0.3)', color:'#ff6b6b', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', flexShrink:0}}
                      >✕</button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setRequirements(prev => [...prev, ''])}
                  style={{background:'rgba(0,230,118,0.1)', border:'1px dashed rgba(0,230,118,0.4)', color:'#00e676', borderRadius:'10px', padding:'0.5rem 1rem', cursor:'pointer', fontSize:'0.88rem', alignSelf:'flex-start', marginTop:'0.2rem'}}
                >+ Add Requirement</button>
              </div>
            </div>

            <div style={{display: 'flex', gap: '1.5rem'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>Minimum CGPA</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 7.5"
                  value={jobData.minCgpa}
                  onChange={(e) => setJobData({ ...jobData, minCgpa: e.target.value })}
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label>Salary Range</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 10LPA - 15LPA"
                  value={jobData.salary}
                  onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
                />
              </div>
            </div>

            <div style={{display: 'flex', gap: '1.5rem'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>Eligible Branch</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. CSE, IT, ECE or ALL"
                  value={jobData.eligibleBranch}
                  onChange={(e) => setJobData({ ...jobData, eligibleBranch: e.target.value })}
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label>Last Date to Apply</label>
                <input
                  type="date"
                  className="form-control"
                  value={jobData.lastDate}
                  onChange={(e) => setJobData({ ...jobData, lastDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Required Skills (Comma separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. React.js, Node.js, Mongoose"
                value={jobData.skills}
                onChange={(e) => setJobData({ ...jobData, skills: e.target.value })}
              />
            </div>

            <button onClick={handlePostJob} className="btn-glossy" style={{marginTop: '2rem'}}>
              <PlusCircle size={20} /> Publish Job Posting
            </button>
          </div>
        )}

        {/* 🔵 MY JOBS */}
        {activeMenu === "My Jobs" && (
          <div className="animate__animated animate__fadeIn">
            {jobs.length === 0 ? (
              <div style={{textAlign: 'center', padding: '5rem', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)'}}>
                <Briefcase size={48} style={{opacity: 0.3, marginBottom: '1rem'}} />
                <h3>No active postings yet</h3>
                <p style={{color: 'var(--text-muted)'}}>Head over to 'Post Job' to publish your first role.</p>
                <button onClick={() => setActiveMenu('Post Job')} className="btn-glossy" style={{width: 'auto', padding: '0.8rem 2rem', margin: '2rem auto 0'}}>Create Posting</button>
              </div>
            ) : (
              <div className="jobs-grid-glass">
                {jobs.map((job) => (
                  <div className="job-glass-card" key={job.id}>
                    <div className="job-glass-header">
                      <h3>{job.title}</h3>
                      <span className="glass-badge">CGPA ≥ {job.minCgpa}</span>
                    </div>
                    
                    <p className="job-glass-desc">{job.description?.substring(0, 100)}{job.description?.length > 100 ? '...' : ''}</p>
                    
                    <div style={{marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                      {job.salary && <div style={{marginBottom: '0.3rem'}}>💰 {job.salary}</div>}
                    </div>

                    <div className="job-glass-actions">
                      <button className="btn-glass-action primary" onClick={() => handleViewApplicants(job.id)}>
                        <Users size={16} /> Applicants
                      </button>
                      <button className="btn-glass-action danger">
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🟢 PROFILE */}
        {activeMenu === "Profile" && (
          <div className="profile-glass-card animate__animated animate__fadeIn">
            <div className="profile-header">
              <div className="profile-avatar">
                {profile?.companyName?.charAt(0) || user?.name?.charAt(0) || "C"}
              </div>
              <div>
                <h2 style={{margin: '0 0 0.2rem 0', padding: 0, border: 'none'}}>{profile?.companyName || user?.name || "Company Name"}</h2>
                <p style={{color: 'var(--text-muted)', margin: 0}}>Official Verified Partner</p>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-field-glass">
                <div className="profile-field-icon"><Building /></div>
                <div className="profile-field-info">
                  <label>Company Display Name</label>
                  <span>{profile?.companyName || user?.name || "Not Set"}</span>
                </div>
              </div>

              <div className="profile-field-glass">
                <div className="profile-field-icon" style={{color: '#ff0080', background: 'rgba(255, 0, 128, 0.1)'}}><Mail /></div>
                <div className="profile-field-info">
                  <label>Registered Email</label>
                  <span>{profile?.email || user?.email || "Not Set"}</span>
                </div>
              </div>

              <div className="profile-field-glass" style={{gridColumn: '1 / -1'}}>
                <div className="profile-field-icon" style={{color: '#00e676', background: 'rgba(0, 230, 118, 0.1)'}}><MapPin /></div>
                <div className="profile-field-info">
                  <label>Headquarters / Location</label>
                  <span>{profile?.location || "Location not provided"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🧊 MODAL */}
        {showApplicants &&
          createPortal(
            <div className="glass-modal-overlay animate__animated animate__fadeIn">
              <div className="glass-modal-content animate__animated animate__zoomIn">
                <h2>Applicant Tracking</h2>
                
                {jobApplications.length > 0 ? (
                  jobApplications.map((app) => {
                    const currentStatus = appStatuses[app.id] || app.status || "APPLIED";
                    const statusColor = {
                      APPLIED:    '#4facfe',
                      SHORTLISTED:'#ffb20d',
                      INTERVIEW:  '#c98cff',
                      HIRED:      '#00e676',
                      REJECTED:   '#ff4d4d'
                    }[currentStatus] || '#aaa';

                    return (
                      <div key={app.id} className="applicant-card">
                        {/* Top row: name + status badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                          <div>
                            <h3 style={{ margin: 0 }}>{app.studentName}</h3>
                            <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Applied for: {app.jobTitle}</p>
                          </div>
                          <span style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}55`, borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontWeight: '600' }}>
                            {currentStatus}
                          </span>
                        </div>

                        {/* Bottom row: status dropdown + view resume */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                          <select
                            value={currentStatus}
                            onChange={e => handleStatusChange(app.id, e.target.value)}
                            style={{
                              background: 'rgba(0,0,0,0.4)', color: 'white',
                              border: `1px solid ${statusColor}55`, borderRadius: '8px',
                              padding: '0.4rem 0.8rem', fontSize: '0.85rem', cursor: 'pointer', outline: 'none'
                            }}
                          >
                            <option value="APPLIED">Applied</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="INTERVIEW">Interview Scheduled</option>
                            <option value="HIRED">Hired</option>
                            <option value="REJECTED">Rejected</option>
                          </select>

                          {(app.resumePath || app.ResumePath) && (() => {
                            const rawUrl = (app.resumePath || app.ResumePath)?.startsWith("http")
                              ? (app.resumePath || app.ResumePath)
                              : `https://placement-portal-full-production.up.railway.app/uploads/${app.resumePath || app.ResumePath}`;
                            const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}`;
                            return (
                              <a href={viewerUrl} target="_blank" rel="noreferrer"
                                className="btn-glass-action"
                                style={{ background: 'rgba(255,255,255,0.05)', textDecoration: 'none', padding: '0.4rem 1rem', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                              >
                                <FileText size={14} /> View Resume
                              </a>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{textAlign: 'center', padding: '2rem 0'}}>
                    <Users size={48} style={{opacity: 0.3, marginBottom: '1rem'}} />
                    <p style={{color: 'var(--text-muted)'}}>No applications received yet.</p>
                  </div>
                )}

                {/* In-modal toast */}
                {toast && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '0.8rem 1.2rem', borderRadius: '10px', marginTop: '1.5rem',
                    background: toast.type === 'success' ? 'rgba(0,230,118,0.12)' : 'rgba(255,77,77,0.12)',
                    border: `1px solid ${toast.type === 'success' ? 'rgba(0,230,118,0.35)' : 'rgba(255,77,77,0.35)'}`,
                    color: toast.type === 'success' ? '#00e676' : '#ff6b6b',
                    fontWeight: '600', fontSize: '0.9rem',
                    animation: 'navDropdown 0.2s ease-out'
                  }}>
                    {toast.type === 'success' ? <CheckCircle size={16}/> : '⚠️'}
                    {toast.message}
                  </div>
                )}

                <button 
                  onClick={() => setShowApplicants(false)}
                  className="btn-glass-action" 
                  style={{marginTop: '1.5rem', width: '100%'}}
                >
                  Close Window
                </button>
              </div>
            </div>,
            document.body
          )
        }
      </div>
    </div>
    </>
  );
}

export default CompanyDashboard;
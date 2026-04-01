import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getAllJobs, applyJob, getAppliedJobs } from "../api/jobApi";
import { getCurrentUser, getMyNotifications, markNotificationAsRead } from "../api/authApi";
import { logout, getToken } from "../auth/auth";
import { Bell, Search, MapPin, Briefcase, GraduationCap, TrendingUp, Users, ArrowRight, ArrowLeft, CheckCircle, Flame, Code, Database, LineChart, Megaphone, PenTool, Shield, ChevronDown, User, FileCheck, Settings, LogOut, LayoutDashboard, X } from "lucide-react";
import "./landing.css";

function HomePage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]); // Array of IDs for quick lookups
  const [applications, setApplications] = useState([]); // Full application objects
  const [applyLoading, setApplyLoading] = useState(false);
  const [isLocFocused, setIsLocFocused] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const notificationsMenuRef = useRef(null);

  // Fetch logged-in user on mount
  useEffect(() => {
    if (getToken()) {
      getCurrentUser()
        .then(res => {
          setCurrentUser(res.data);
          setUserRole(res.data?.role);
          if (res.data?.role === 'STUDENT') {
            getMyNotifications().then(notifRes => {
               setNotifications(notifRes.data || []);
            }).catch(e => console.error("Error loading notifications:", e));
          }
        })
        .catch(() => {
          setCurrentUser(null);
          setUserRole(null);
        });
    }
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsFocused(false);
        setSuggestions([]);
        setIsLocFocused(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(e.target)) {
        setShowNotificationsMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setUserRole(null);
    setShowProfileMenu(false);
  };

  // Load already-applied jobs on mount
  useEffect(() => {
    if (getToken()) {
      getAppliedJobs()
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
          setApplications(data);
          setAppliedJobs(data.map(app => app.jobId || app.job?.id));
        })
        .catch(() => {});
    }
  }, []);

  const handleApplyFromLanding = async (jobId) => {
    if (!getToken()) {
      navigate(`/login?redirect=/&applyJobId=${jobId}`);
      return;
    }
    if (appliedJobs.includes(jobId)) return;
    try {
      setApplyLoading(true);
      const res = await applyJob(jobId);
      // Backend applyJob usually returns the new application object
      if (res.data) {
        setApplications(prev => [...prev, res.data]);
        setAppliedJobs(prev => [...prev, jobId]);
      } else {
        // Fallback if data is not returned
        setAppliedJobs(prev => [...prev, jobId]);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to apply.");
    } finally {
      setApplyLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim())  params.set('keyword', keyword.trim());
    if (location.trim()) params.set('location', location.trim());
    setSuggestions([]);
    setIsFocused(false);
    navigate(`/jobs?${params.toString()}`);
  };

  useEffect(() => {
    getAllJobs().then((res) => {
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setJobs(data);
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }
    const filteredJobs = jobs.filter((job) => {
      const title = (job.title || "").toLowerCase();
      const desc = (job.description || "").toLowerCase();
      return title.includes(keyword.toLowerCase()) || desc.includes(keyword.toLowerCase());
    });
    setSuggestions(filteredJobs.slice(0, 4));
  }, [keyword, jobs]);

  const latestJobs = [...jobs].reverse().slice(0, 3);

  const POPULAR_CITIES = [
    "Remote", "Bangalore", "Mumbai", "Delhi", "Hyderabad",
    "Chennai", "Pune", "Kolkata", "Noida", "Gurugram", "Ahmedabad"
  ];

  const filteredCities = location.trim()
    ? POPULAR_CITIES.filter(c => c.toLowerCase().includes(location.toLowerCase()))
    : POPULAR_CITIES;

  const categories = [
    { name: "Software Engineer", icon: <Code size={24} />, count: "120+ Jobs" },
    { name: "Data Analyst", icon: <Database size={24} />, count: "85+ Jobs" },
    { name: "Finance", icon: <LineChart size={24} />, count: "40+ Jobs" },
    { name: "Marketing", icon: <Megaphone size={24} />, count: "60+ Jobs" },
    { name: "UI/UX Designer", icon: <PenTool size={24} />, count: "35+ Jobs" },
    { name: "Cybersecurity", icon: <Shield size={24} />, count: "25+ Jobs" },
  ];

  return (
    <div className="landing-wrapper">
      {/* 🔮 Background Glow */}
      <div className="landing-bg-glow"></div>

      <div className="landing-content">
        {/* 🔝 GLASS NAVBAR */}
        <nav className="glass-nav">
          <div className="brand-logo">
            <GraduationCap className="text-primary" size={32} />
            PlacePort
          </div>
          <div className="nav-buttons" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {currentUser ? (
              <>
              {/* Notification Bell for Students */}
              {userRole === 'STUDENT' && (
                <div ref={notificationsMenuRef} style={{ position: 'relative' }}>
                  <div
                    onClick={() => setShowNotificationsMenu(prev => !prev)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.05)', width: '42px', height: '42px',
                      borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(10px)', cursor: 'pointer', position: 'relative',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    <Bell size={18} color="white" />
                    {notifications.some(n => !n.read) && (
                      <span style={{
                        position: 'absolute', top: '8px', right: '10px', width: '8px', height: '8px',
                        background: '#ff4d4d', borderRadius: '50%', border: '2px solid rgba(15,23,42,0.9)'
                      }}></span>
                    )}
                  </div>

                  {showNotificationsMenu && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                      background: 'rgba(10, 10, 20, 0.96)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px', padding: '0', minWidth: '320px', maxWidth: '350px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)',
                      zIndex: 1000, animation: 'navDropdown 0.15s ease-out', overflow: 'hidden'
                    }}>
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: '600', fontSize: '1rem' }}>Notifications</div>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(79, 172, 254, 0.2)', color: '#4facfe', padding: '2px 8px', borderRadius: '10px' }}>
                          {notifications.filter(n => !n.read).length} New
                        </span>
                      </div>
                      
                      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map(notif => (
                            <div 
                              key={notif.id}
                              onClick={async () => {
                                if(!notif.read) {
                                  try {
                                    await markNotificationAsRead(notif.id);
                                    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                  } catch(e) { console.error(e); }
                                }
                              }}
                              style={{
                                padding: '12px 16px',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                background: notif.read ? 'transparent' : 'rgba(79, 172, 254, 0.05)',
                                display: 'flex', gap: '12px', cursor: 'pointer',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = notif.read ? 'rgba(255,255,255,0.03)' : 'rgba(79, 172, 254, 0.1)'}
                              onMouseLeave={e => e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(79, 172, 254, 0.05)'}
                            >
                              <div style={{ marginTop: '2px' }}>
                                {notif.read ? <CheckCircle size={16} color="var(--text-muted)" /> : <div style={{width: '8px', height: '8px', background: '#4facfe', borderRadius: '50%', marginTop: '4px'}}></div>}
                              </div>
                              <div>
                                <div style={{ fontSize: '0.85rem', color: notif.read ? 'var(--text-muted)' : 'white', lineHeight: '1.4' }}>
                                  {notif.message}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                  {new Date(notif.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 🔵 LOGGED-IN: Profile Avatar Dropdown */}
              <div ref={profileMenuRef} style={{ position: 'relative' }}>
                <div
                  onClick={() => setShowProfileMenu(prev => !prev)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(255,255,255,0.05)', padding: '8px 16px',
                    borderRadius: '30px', border: '1px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(10px)', cursor: 'pointer', userSelect: 'none'
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8a2be2, #ff0080)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '1rem', color: 'white'
                  }}>
                    {currentUser?.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'white' }}>
                    {currentUser?.email?.split('@')[0]}
                  </span>
                  <ChevronDown size={16} color="var(--text-muted)" style={{ transition: 'transform 0.2s', transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </div>

                {showProfileMenu && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                    background: 'rgba(10, 10, 20, 0.96)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px', padding: '8px', minWidth: '210px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)',
                    zIndex: 1000, animation: 'navDropdown 0.15s ease-out'
                  }}>
                    {/* Email header */}
                    <div style={{ padding: '10px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '6px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Signed in as</div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem', marginTop: '2px', color: 'white' }}>{currentUser?.email}</div>
                      <div style={{ fontSize: '0.75rem', color: userRole === 'STUDENT' ? '#4facfe' : '#ff0080', marginTop: '3px' }}>{userRole}</div>
                    </div>

                    {/* Dashboard link */}
                    <div
                      onClick={() => { navigate(userRole === 'COMPANY' ? '/company' : '/student'); setShowProfileMenu(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', color: 'white', fontSize: '0.9rem' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(138,43,226,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LayoutDashboard size={15} style={{ color: '#c98cff' }} /> Dashboard
                    </div>

                    {userRole === 'STUDENT' && (
                      <>
                        <div
                          onClick={() => { navigate('/student?tab=Profile'); setShowProfileMenu(false); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', color: 'white', fontSize: '0.9rem' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,172,254,0.12)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <User size={15} style={{ color: '#4facfe' }} /> My Profile
                        </div>
                        <div
                          onClick={() => { navigate('/student?tab=Applications'); setShowProfileMenu(false); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', color: 'white', fontSize: '0.9rem' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,172,254,0.12)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <FileCheck size={15} style={{ color: '#4facfe' }} /> Applications
                        </div>
                      </>
                    )}

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '6px', paddingTop: '6px' }}>
                      <div
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', color: '#ff6b6b', fontSize: '0.9rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={15} /> Logout
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </>
            ) : (
              // 🔴 GUEST: Login / Sign Up buttons
              <>
                <button className="btn-login" onClick={() => navigate("/login")}>Log in</button>
                <button className="btn-gradient" onClick={() => navigate("/register")}>Sign Up Free</button>
              </>
            )}
          </div>
        </nav>

        {/* 🔍 NAUKRI-STYLE SEARCH BAR */}
        <div ref={searchRef} style={{ display: 'flex', justifyContent: 'center', margin: '2rem auto 0', padding: '0 2rem', position: 'relative', zIndex: 100, maxWidth: '860px', width: '100%' }}>
          <div className="naukri-search-wrapper" style={{
            display: 'flex', alignItems: 'center', width: '100%',
            background: 'white', borderRadius: '12px',
            boxShadow: isFocused ? '0 8px 40px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.25)',
            overflow: 'visible', position: 'relative', transition: 'box-shadow 0.2s'
          }}>

            {/* Keyword input */}
            <div className="search-field" style={{ flex: 2, display: 'flex', alignItems: 'center', padding: '0 1rem', borderRight: '1px solid #e0e0e0', position: 'relative' }}>
              <Search size={18} style={{ color: '#888', flexShrink: 0, marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Skills, designations, companies"
                value={keyword}
                onChange={e => { setKeyword(e.target.value); setIsFocused(true); }}
                onFocus={() => setIsFocused(true)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: '0.95rem', color: '#222', width: '100%', padding: '0.85rem 0',
                  fontFamily: 'inherit'
                }}
              />
              {keyword && (
                <X size={16} style={{ color: '#aaa', cursor: 'pointer', flexShrink: 0 }}
                  onMouseDown={() => { setKeyword(''); setSuggestions([]); }}
                />
              )}

              {/* Autocomplete dropdown */}
              {isFocused && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: 'white', border: '1px solid #e8e8e8',
                  borderTop: 'none', borderRadius: '0 0 10px 10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 200, overflow: 'hidden'
                }}>
                  {suggestions.map((job) => (
                    <div
                      key={job.id || job.title}
                      onMouseDown={() => { setKeyword(job.title); setSuggestions([]); setIsFocused(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '0.75rem 1rem', cursor: 'pointer', color: '#333',
                        fontSize: '0.9rem', borderBottom: '1px solid #f5f5f5',
                        transition: 'background 0.1s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8f4ff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                      <Search size={14} style={{ color: '#999', flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ fontWeight: '600', color: '#222', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {job.companyName} { (job.companyLocation || job.location) && ` • ${job.companyLocation || job.location}` }
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    onMouseDown={handleSearch}
                    style={{ padding: '0.75rem 1rem', color: '#7c3aed', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer', background: '#faf5ff' }}
                  >
                    🔍 Search all jobs for "{keyword}"
                  </div>
                </div>
              )}
            </div>

            {/* Location input with dropdown */}
            <div className="search-field" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 1rem', position: 'relative' }}>
              <MapPin size={18} style={{ color: '#888', flexShrink: 0, marginRight: '8px' }} />
              <input
                type="text"
                placeholder="City or remote"
                value={location}
                onChange={e => { setLocation(e.target.value); setIsLocFocused(true); }}
                onFocus={() => setIsLocFocused(true)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: '0.95rem', color: '#222', width: '100%', padding: '0.85rem 0',
                  fontFamily: 'inherit'
                }}
              />
              {location && (
                <X size={16} style={{ color: '#aaa', cursor: 'pointer', flexShrink: 0 }}
                  onMouseDown={() => setLocation('')}
                />
              )}

              {/* City suggestions dropdown */}
              {isLocFocused && filteredCities.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: 'white', border: '1px solid #e8e8e8',
                  borderTop: 'none', borderRadius: '0 0 10px 10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 200, overflow: 'hidden'
                }}>
                  {!location.trim() && (
                    <div style={{ padding: '0.6rem 1rem', fontSize: '0.72rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                      Popular Locations
                    </div>
                  )}
                  {filteredCities.map(city => (
                    <div
                      key={city}
                      onMouseDown={() => { setLocation(city); setIsLocFocused(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '0.7rem 1rem', cursor: 'pointer', color: '#333',
                        fontSize: '0.9rem', borderBottom: '1px solid #f5f5f5'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8f4ff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                      <MapPin size={13} style={{ color: '#7c3aed' }} />
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search button */}
            <button className="search-btn"
              onClick={handleSearch}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                color: 'white', border: 'none', padding: '0 2rem',
                fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
                borderRadius: '0 12px 12px 0', height: '52px', whiteSpace: 'nowrap',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Search
            </button>
          </div>
        </div>

        {/* 🎯 HERO SECTION */}
        <section className="hero-section" style={{ paddingTop: '2rem' }}>
          <div className="hero-text">
            <h1>
              Accelerate Your <br />
              <span className="text-gradient">Career Journey</span>
            </h1>
            <p>
              Connect with top-tier companies, showcase your skills, and secure your
              dream placement through our intelligent portal.
            </p>

            <div className="hero-actions">
              <button className="btn-gradient" onClick={() => navigate("/register")}>
                Get Started
              </button>
              <button className="btn-outline" onClick={() => navigate("/jobs")}>
                Browse Jobs
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-img-wrapper">
              <img src="/hero_premium.png" alt="Premium 3D Tech Placement Illustration" />
            </div>
          </div>
        </section>

        {/* 🚀 LATEST JOBS SECTION */}
        <section className="latest-jobs-section">
          <h2 className="section-title">
            Latest <span className="text-gradient">Opportunities</span>
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "-2rem", marginBottom: "3rem" }}>
            Handpicked roles just added to our platform.
          </p>

          <div className="jobs-grid">
            {latestJobs.length > 0 ? (
              latestJobs.map((job) => (
                <div className="job-preview-card" key={job._id || job.id}>
                  <div className="job-header-row">
                    <h3>{job.title}</h3>
                    <span className="job-type-badge">{job.jobType || "Full-time"}</span>
                  </div>
                  
                  <div className="job-salary">
                    {job.salary ? `💰 ${job.salary}` : ""}
                  </div>

                  <div className="job-skills">
                    {(job.requirements || job.skills || []).slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-chip">{skill}</span>
                    ))}
                    {(job.requirements || job.skills || []).length > 3 && <span className="skill-chip">+</span>}
                  </div>

                  <div className="job-footer-row">
                    <span className="job-company">{job.companyName || "Premium Partner"}</span>
                    <div className="job-location">
                      <MapPin size={14} />
                      {job.companyLocation || job.location || "Remote / Hybrid"}
                    </div>
                  </div>

                  <button 
                    className="btn-apply" 
                    onClick={() => setSelectedJob(job)}
                  >
                    View & Apply <ArrowRight size={16} style={{marginLeft: "5px", verticalAlign: "sub"}}/>
                  </button>
                </div>
              ))
            ) : (
              <div className="job-preview-card" style={{gridColumn: "1 / -1", textAlign: "center"}}>
                <h3>Loading latest jobs...</h3>
              </div>
            )}
          </div>
        </section>

        {/* 🗂 TOP CATEGORIES SECTION */}
        <section className="categories-section">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title" style={{marginBottom: "0.5rem", textAlign: "left"}}>Explore by <span className="text-gradient">Category</span></h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "3rem", textAlign: "left" }}>Find the role that fits your passion and skills perfectly.</p>
            </div>
            <button className="btn-outline" style={{padding: "0.8rem 1.5rem", borderRadius: "50px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)", color: "white", marginBottom: "3rem"}} onClick={() => navigate('/jobs')}>All Categories <ArrowRight size={16} style={{marginLeft: "0.5rem", verticalAlign: "sub"}}/></button>
          </div>
          
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <div className="category-card" key={idx} onClick={() => navigate(`/jobs?keyword=${cat.name}`)}>
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 📈 IMPACT SECTION */}
        <section className="impact-section">
          <div className="impact-grid">
            <div className="impact-stat">
              <h2>10k+</h2>
              <p>Students Placed</p>
            </div>
            <div className="impact-stat">
              <h2>500+</h2>
              <p>Hiring Partners</p>
            </div>
            <div className="impact-stat">
              <h2>95%</h2>
              <p>Success Rate</p>
            </div>
          </div>
        </section>

        {/* 🏢 COMPANIES MARQUEE */}
        <section className="companies-section">
          <div className="companies-title">Trusted By Industry Leaders</div>
          <div className="marquee-container">
            <div className="marquee-content">
              {/* Duplicating for infinite effect */}
              {[...Array(2)].map((_, idx) => (
                <span key={idx} style={{ display: 'inline-flex' }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" alt="Infosys" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Wipro_Primary_Logo_Color_RGB.svg" alt="Wipro" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg" alt="TCS" />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ✨ FEATURES SECTION */}
        <section className="features-section">
          <h2 className="section-title">Why Choose <span className="text-gradient">PlacePort</span></h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Briefcase size={28} />
              </div>
              <h3>Exclusive Opportunities</h3>
              <p>Get access to premium internship and full-time roles posted directly by our verified corporate partners.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <TrendingUp size={28} />
              </div>
              <h3>Smart Matching</h3>
              <p>Our intelligent system matches your skills, projects, and academic profile with the perfect job descriptions.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Users size={28} />
              </div>
              <h3>Seamless Networking</h3>
              <p>Connect with alumni, schedule interviews directly on the platform, and track your application status in real time.</p>
            </div>
          </div>
        </section>
      </div>

      {/* 🪟 JOB DETAIL MODAL */}
      {selectedJob && (
        <div
          onClick={() => setSelectedJob(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'rgba(12,12,25,0.98)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px', padding: '2.5rem', maxWidth: '560px', width: '100%',
              boxShadow: '0 30px 70px rgba(0,0,0,0.6)', position: 'relative',
              animation: 'navDropdown 0.2s ease-out'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedJob(null)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
            >
              <X size={18} />
            </button>

            {/* Company + Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #8a2be2, #ff0080)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.3rem', color: 'white' }}>
                {selectedJob.companyName?.charAt(0) || 'C'}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'white' }}>{selectedJob.companyName || 'Company'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedJob.companyLocation || selectedJob.location || 'Location N/A'}</div>
              </div>
              <span style={{ marginLeft: 'auto', background: 'rgba(138,43,226,0.2)', color: '#c98cff', padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', border: '1px solid rgba(138,43,226,0.3)' }}>
                {selectedJob.jobType || 'Full-time'}
              </span>
            </div>

            {/* Title */}
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.6rem', fontWeight: '800', color: 'white' }}>{selectedJob.title}</h2>

            {/* Key info chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '1rem 0 1.5rem' }}>
              {selectedJob.salary && (
                <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px 12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>💰 {selectedJob.salary}</span>
              )}
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px 12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>🎓 Min CGPA: {selectedJob.minCgpa || 'N/A'}</span>
              {selectedJob.lastDate && (
                <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px 12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>📅 Deadline: {selectedJob.lastDate}</span>
              )}
            </div>

            {/* Description */}
            {selectedJob.description && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>About the Role</div>
                <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>{selectedJob.description}</p>
              </div>
            )}

            {/* Apply Button */}
            <button
              disabled={appliedJobs.includes(selectedJob.id) || applyLoading}
              onClick={() => handleApplyFromLanding(selectedJob.id)}
              style={{
                width: '100%', padding: '1rem', border: 'none', borderRadius: '14px', cursor: appliedJobs.includes(selectedJob.id) ? 'not-allowed' : 'pointer',
                background: appliedJobs.includes(selectedJob.id)
                  ? 'linear-gradient(135deg, #00e676, #00b248)'
                  : 'linear-gradient(135deg, #8a2be2, #ff0080)',
                color: 'white', fontWeight: '700', fontSize: '1.05rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 10px 25px rgba(138,43,226,0.3)', transition: 'all 0.2s'
              }}
            >
              {applyLoading ? 'Applying...' : appliedJobs.includes(selectedJob.id) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18}/>
                  {(() => {
                    const app = applications.find(a => (a.jobId || a.job?.id) === selectedJob.id);
                    const status = app?.status || 'APPLIED';
                    return status === 'APPLIED' ? 'Applied Successfully' : `Status: ${status}`;
                  })()}
                </div>
              ) : <>Apply Now <ArrowRight size={18}/></>}
            </button>

            {!getToken() && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.88rem' }}>You need to <span style={{ color: '#c98cff', cursor: 'pointer' }} onClick={() => navigate('/login')}>login</span> to apply.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
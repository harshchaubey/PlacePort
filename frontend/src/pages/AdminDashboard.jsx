import { useEffect, useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth/auth";
import { getAllStudents, getAllCompanies, verifyCompany } from "../api/authApi";
import { getAllJobs } from "../api/jobApi";
import {
  LayoutDashboard,
  Building,
  Users,
  Briefcase,
  GraduationCap,
  CheckCircle,
  XCircle,
  LogOut,
  ShieldCheck,
  Menu,
  BookOpen,
  Award
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Companies", icon: <Building size={20} /> },
    { name: "Students", icon: <Users size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [studRes, compRes, jobRes] = await Promise.all([
          getAllStudents(),
          getAllCompanies(),
          getAllJobs(),
        ]);
        setStudents(studRes.data || []);
        setCompanies(compRes.data || []);
        setJobs(jobRes.data || []);
      } catch (err) {
        console.error("Admin data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleVerify = async (id, currentlyVerified) => {
    setVerifyingId(id);
    try {
      await verifyCompany(id);
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, verified: !currentlyVerified } : c))
      );
      showToast(
        currentlyVerified ? "Company unverified." : "Company verified successfully!",
        "success"
      );
    } catch (err) {
      console.error(err);
      showToast("Action failed. Please try again.", "error");
    } finally {
      setVerifyingId(null);
    }
  };

  const verifiedCount = companies.filter((c) => c.verified).length;
  const pendingCount = companies.filter((c) => !c.verified).length;

  return (
    <div className="dashboard-wrapper">
      <div className="landing-bg-glow"></div>

      {/* Mobile Overlay */}
      <div
        className={`overlay ${isMobileMenuOpen ? "show" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* SIDEBAR */}
      <div className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div
          className="brand-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <GraduationCap className="icon" size={32} />
          PlacePort
        </div>

        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={activeMenu === item.name ? "active" : ""}
              onClick={() => {
                setActiveMenu(item.name);
                setIsMobileMenuOpen(false);
              }}
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

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-header">
            <div
              className="hamburger-btn"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </div>
            <h2>{activeMenu}</h2>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "var(--glass-bg)",
              padding: "10px 20px",
              borderRadius: "30px",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(10px)",
            }}
          >
            <ShieldCheck size={18} color="#ff0080" />
            <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>
              Admin Panel
            </span>
          </div>
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeMenu === "Dashboard" && (
          <div className="animate__animated animate__fadeIn">
            {/* Welcome */}
            <div
              className="welcome-widget"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,0,128,0.15), rgba(100,0,255,0.15))",
              }}
            >
              <h1>
                Welcome,{" "}
                <span style={{ color: "#ff0080" }}>Admin 👋</span>
              </h1>
              <p>
                {new Date().toDateString()} • Full system overview
              </p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveMenu("Students")}>
                <div
                  className="stat-icon"
                  style={{ color: "#4facfe", background: "rgba(79,172,254,0.1)" }}
                >
                  <Users strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{loading ? "—" : students.length}</h3>
                  <p>Registered Students</p>
                </div>
              </div>

              <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveMenu("Companies")}>
                <div
                  className="stat-icon"
                  style={{ color: "#ff0080", background: "rgba(255,0,128,0.1)" }}
                >
                  <Building strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{loading ? "—" : companies.length}</h3>
                  <p>Total Companies</p>
                </div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{ color: "#00e676", background: "rgba(0,230,118,0.1)" }}
                >
                  <Briefcase strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{loading ? "—" : jobs.length}</h3>
                  <p>Active Job Postings</p>
                </div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{ color: "#ffb20d", background: "rgba(255,178,13,0.1)" }}
                >
                  <Award strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{loading ? "—" : verifiedCount}</h3>
                  <p>Verified Companies</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            {!loading && (
              <div
                style={{
                  marginTop: "2.5rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                {/* Pending Companies Alert */}
                <div
                  style={{
                    background:
                      pendingCount > 0
                        ? "rgba(255,178,13,0.06)"
                        : "rgba(0,230,118,0.06)",
                    border: `1px solid ${pendingCount > 0 ? "rgba(255,178,13,0.25)" : "rgba(0,230,118,0.2)"}`,
                    borderRadius: "20px",
                    padding: "1.5rem 2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background:
                        pendingCount > 0
                          ? "rgba(255,178,13,0.15)"
                          : "rgba(0,230,118,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {pendingCount > 0 ? (
                      <XCircle
                        size={24}
                        color="#ffb20d"
                        strokeWidth={2}
                      />
                    ) : (
                      <CheckCircle
                        size={24}
                        color="#00e676"
                        strokeWidth={2}
                      />
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        color: pendingCount > 0 ? "#ffb20d" : "#00e676",
                      }}
                    >
                      {pendingCount > 0
                        ? `${pendingCount} Company Pending Verification`
                        : "All Companies Verified"}
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-muted)",
                        marginTop: "3px",
                      }}
                    >
                      {pendingCount > 0
                        ? "Review and verify to allow job posting"
                        : "No action needed"}
                    </div>
                  </div>
                  {pendingCount > 0 && (
                    <button
                      onClick={() => setActiveMenu("Companies")}
                      style={{
                        marginLeft: "auto",
                        background: "rgba(255,178,13,0.15)",
                        border: "1px solid rgba(255,178,13,0.35)",
                        color: "#ffb20d",
                        borderRadius: "10px",
                        padding: "0.5rem 1.2rem",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Review →
                    </button>
                  )}
                </div>

                {/* Job Diversity */}
                <div
                  style={{
                    background: "rgba(79,172,254,0.06)",
                    border: "1px solid rgba(79,172,254,0.2)",
                    borderRadius: "20px",
                    padding: "1.5rem 2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: "rgba(79,172,254,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={24} color="#4facfe" strokeWidth={2} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        color: "#4facfe",
                      }}
                    >
                      {students.length} Students
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-muted)",
                        marginTop: "3px",
                      }}
                    >
                      Registered across all branches
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── COMPANIES TAB ── */}
        {activeMenu === "Companies" && (
          <div className="animate__animated animate__fadeIn">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700" }}>
                  All Companies
                </h3>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  {verifiedCount} verified · {pendingCount} pending
                </p>
              </div>
              <div
                style={{
                  background: "rgba(255,178,13,0.1)",
                  border: "1px solid rgba(255,178,13,0.3)",
                  color: "#ffb20d",
                  borderRadius: "20px",
                  padding: "5px 14px",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                }}
              >
                {pendingCount} Pending
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                Loading companies...
              </div>
            ) : companies.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "5rem",
                  background: "var(--glass-bg)",
                  borderRadius: "20px",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <Building size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
                <h3>No companies registered yet</h3>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {companies.map((company) => (
                  <div
                    key={company.id}
                    style={{
                      background: "var(--glass-bg)",
                      border: `1px solid ${company.verified ? "rgba(0,230,118,0.2)" : "rgba(255,178,13,0.2)"}`,
                      borderLeft: `4px solid ${company.verified ? "#00e676" : "#ffb20d"}`,
                      borderRadius: "16px",
                      padding: "1.2rem 1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {/* Left: company info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: company.verified
                            ? "rgba(0,230,118,0.12)"
                            : "rgba(255,178,13,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "800",
                          fontSize: "1.2rem",
                          color: company.verified ? "#00e676" : "#ffb20d",
                          flexShrink: 0,
                        }}
                      >
                        {company.companyName?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "1rem" }}>
                          {company.companyName}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            marginTop: "2px",
                          }}
                        >
                          {company.email}
                          {company.location && ` • ${company.location}`}
                        </div>
                      </div>
                    </div>

                    {/* Right: status + action */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          background: company.verified
                            ? "rgba(0,230,118,0.12)"
                            : "rgba(255,178,13,0.12)",
                          color: company.verified ? "#00e676" : "#ffb20d",
                          border: `1px solid ${company.verified ? "rgba(0,230,118,0.3)" : "rgba(255,178,13,0.3)"}`,
                          borderRadius: "20px",
                          padding: "4px 14px",
                          fontSize: "0.8rem",
                          fontWeight: "700",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {company.verified ? "✓ Verified" : "⏳ Pending"}
                      </span>

                      <button
                        onClick={() => handleVerify(company.id, company.verified)}
                        disabled={verifyingId === company.id}
                        style={{
                          background: company.verified
                            ? "rgba(255,77,77,0.12)"
                            : "rgba(0,230,118,0.12)",
                          border: `1px solid ${company.verified ? "rgba(255,77,77,0.3)" : "rgba(0,230,118,0.3)"}`,
                          color: company.verified ? "#ff6b6b" : "#00e676",
                          borderRadius: "10px",
                          padding: "0.45rem 1.1rem",
                          cursor: verifyingId === company.id ? "wait" : "pointer",
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                          transition: "all 0.2s",
                          opacity: verifyingId === company.id ? 0.6 : 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {company.verified ? (
                          <><XCircle size={14} /> Revoke</>
                        ) : (
                          <><CheckCircle size={14} /> Verify</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STUDENTS TAB ── */}
        {activeMenu === "Students" && (
          <div className="animate__animated animate__fadeIn">
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700" }}>
                All Students
              </h3>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                }}
              >
                {students.length} registered student{students.length !== 1 ? "s" : ""}
              </p>
            </div>

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem",
                  color: "var(--text-muted)",
                }}
              >
                Loading students...
              </div>
            ) : students.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "5rem",
                  background: "var(--glass-bg)",
                  borderRadius: "20px",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <Users
                  size={48}
                  style={{ opacity: 0.3, marginBottom: "1rem" }}
                />
                <h3>No students registered yet</h3>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {students.map((student, idx) => (
                  <div
                    key={student.id}
                    style={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "16px",
                      padding: "1rem 1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {/* Avatar + Name */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          background: `hsl(${(idx * 53) % 360}, 60%, 25%)`,
                          border: `1px solid hsl(${(idx * 53) % 360}, 60%, 40%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "800",
                          fontSize: "1rem",
                          color: `hsl(${(idx * 53) % 360}, 80%, 70%)`,
                          flexShrink: 0,
                        }}
                      >
                        {student.name?.charAt(0)?.toUpperCase() || "S"}
                      </div>
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>
                          {student.name || "—"}
                        </div>
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--text-muted)",
                            marginTop: "2px",
                          }}
                        >
                          {student.email}
                        </div>
                      </div>
                    </div>

                    {/* Meta chips */}
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      {student.rollNo && (
                        <span
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            padding: "4px 10px",
                            fontSize: "0.78rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          🎫 {student.rollNo}
                        </span>
                      )}
                      {student.branch && (
                        <span
                          style={{
                            background: "rgba(79,172,254,0.08)",
                            border: "1px solid rgba(79,172,254,0.2)",
                            borderRadius: "8px",
                            padding: "4px 10px",
                            fontSize: "0.78rem",
                            color: "#4facfe",
                          }}
                        >
                          {student.branch}
                        </span>
                      )}
                      {student.cgpa != null && (
                        <span
                          style={{
                            background: "rgba(0,230,118,0.08)",
                            border: "1px solid rgba(0,230,118,0.2)",
                            borderRadius: "8px",
                            padding: "4px 10px",
                            fontSize: "0.78rem",
                            color: "#00e676",
                            fontWeight: "700",
                          }}
                        >
                          🎓 {student.cgpa} CGPA
                        </span>
                      )}
                      {student.year && (
                        <span
                          style={{
                            background: "rgba(255,178,13,0.08)",
                            border: "1px solid rgba(255,178,13,0.2)",
                            borderRadius: "8px",
                            padding: "4px 10px",
                            fontSize: "0.78rem",
                            color: "#ffb20d",
                          }}
                        >
                          Year {student.year}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Global Toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              background:
                toast.type === "success"
                  ? "rgba(0,230,118,0.12)"
                  : "rgba(255,77,77,0.12)",
              border: `1px solid ${toast.type === "success" ? "rgba(0,230,118,0.4)" : "rgba(255,77,77,0.4)"}`,
              color: toast.type === "success" ? "#00e676" : "#ff6b6b",
              borderRadius: "14px",
              padding: "1rem 1.5rem",
              fontWeight: "600",
              fontSize: "0.9rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              backdropFilter: "blur(20px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              animation: "fadeSlideDown 0.2s ease-out",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <XCircle size={18} />
            )}
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
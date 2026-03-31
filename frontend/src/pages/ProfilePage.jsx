import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createStudentProfile, createCompanyProfile } from "../api/authApi";
import { User, Mail, GraduationCap, Hash, BookOpen, Award, Calendar, Building2, MapPin, UploadCloud, ChevronRight, ChevronLeft, X, Check, ChevronDown } from "lucide-react";
import "./landing.css";

function CompleteProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role;

  const [step, setStep] = useState(1);
  const totalSteps = role === "STUDENT" ? 3 : 1;

  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    email: localStorage.getItem("userEmail") || "",
    location: "",
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: localStorage.getItem("userEmail") || "",
    rollNo: "",
    branch: "",
    cgpa: "",
    year: ""
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStudentChange = (e) => {
    let { name, value } = e.target;
    
    // Prevent non-integers in Roll Number and Year
    if (name === "rollNo" || name === "year") {
      value = value.replace(/\D/g, ""); 
    }
    
    // Prevent invalid decimals in CGPA (allow digits and one dot)
    if (name === "cgpa") {
      value = value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
    }

    setStudentForm({ ...studentForm, [name]: value });
  };
  const handleCompanyChange = (e) => setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim()) {
      const newSkills = skillInput
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "" && !skills.includes(s));
      
      if (newSkills.length > 0) {
        setSkills([...skills, ...newSkills]);
      }
    }
    setSkillInput("");
  };

  const removeSkill = (sk) => setSkills(skills.filter(s => s !== sk));

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      if (role === "STUDENT") {
        const formData = new FormData();
        
        // Serialize student form data to JSON Blob for Spring Boot @RequestPart
        const studentPayload = { ...studentForm, skills: skills };
        formData.append("student", new Blob([JSON.stringify(studentPayload)], { type: "application/json" }));
        
        // Append optional resume file
        if (resumeFile) {
          formData.append("resume", resumeFile);
        }

        await createStudentProfile(formData);
        navigate("/student"); 
      } else if (role === "COMPANY") {
        await createCompanyProfile(companyForm);
        navigate("/company");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error saving profile ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-wrapper">
      <div className="landing-bg-glow"></div>
      
      {/* Brand Logo Corner */}
      <div 
        className="brand-logo" 
        style={{ position: 'absolute', top: '2rem', left: '2rem', cursor: 'pointer', zIndex: 100 }}
        onClick={() => navigate("/")}
      >
        <GraduationCap className="text-primary" size={32} />
        PlacePort
      </div>

      <div className="auth-container" style={{ padding: '2rem 0' }}>
        <div className="auth-card" style={{ maxWidth: '550px', width: '100%', margin: '0 auto', transition: 'all 0.3s ease' }}>
          
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2>Complete Your Profile</h2>
            {role === "STUDENT" && (
                <div className="badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
                  Step {step} of {totalSteps}
                </div>
            )}
          </div>
          
          <p className="text-center mb-4" style={{ color: 'var(--text-muted)' }}>
            {role === "COMPANY" ? "Tell us more about your company." : 
             step === 1 ? "Let's start with your basic identity." : 
             step === 2 ? "Tell us about your academic standing." : 
             "Showcase your professional skills and resume (optional)."}
          </p>

          {error && (
            <div className="alert alert-danger text-center mb-4" style={{background: 'rgba(220, 38, 38, 0.2)', color: '#fca5a5', border: '1px solid #ef4444', borderRadius: '12px'}} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            
            {/* STUDENT WIZARD */}
            {role === "STUDENT" && (
              <>
                {/* STEP 1: Basic Information */}
                {step === 1 && (
                  <div className="wizard-step fade-in">
                    <div className="auth-form-group">
                      <label>Full Name</label>
                      <div className="auth-input-wrapper">
                        <User size={18} />
                        <input name="name" placeholder="John Doe" onChange={handleStudentChange} value={studentForm.name} required />
                      </div>
                    </div>

                    <div className="auth-form-group">
                      <label>Linked Email (Read-Only)</label>
                      <div className="auth-input-wrapper" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                        <Mail size={18} style={{ color: 'var(--text-muted)' }} />
                        <input name="email" value={studentForm.email} className="text-muted" style={{ background: 'transparent', cursor: 'not-allowed' }} readOnly />
                      </div>
                    </div>

                    <div className="auth-form-group">
                      <label>Roll Number</label>
                      <div className="auth-input-wrapper">
                        <Hash size={18} />
                        <input name="rollNo" placeholder="21BCA0123" onChange={handleStudentChange} value={studentForm.rollNo} required />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Academics */}
                {step === 2 && (
                  <div className="wizard-step fade-in">
                    <div className="auth-form-group">
                      <label>Branch / Major</label>
                      <div className="auth-input-wrapper" style={{ position: 'relative' }}>
                        <BookOpen size={18} />
                        <select 
                          name="branch" 
                          onChange={handleStudentChange} 
                          value={studentForm.branch} 
                          required
                          style={{ appearance: 'none' }}
                        >
                          <option value="" disabled>Select your branch</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Electronics & Communication">Electronics & Communication</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                          <option value="MCA">MCA (Master of Computer Applications)</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="auth-form-group">
                          <label>Current CGPA</label>
                          <div className="auth-input-wrapper">
                            <Award size={18} />
                            <input name="cgpa" type="number" step="0.01" min="0" max="10" placeholder="8.5" onChange={handleStudentChange} value={studentForm.cgpa} required />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="auth-form-group">
                          <label>Academic Year</label>
                          <div className="auth-input-wrapper">
                            <Calendar size={18} />
                            <input name="year" type="number" min="1" max="4" placeholder="3" onChange={handleStudentChange} value={studentForm.year} required />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Skills & Resume */}
                {step === 3 && (
                  <div className="wizard-step fade-in">
                    
                    <div className="auth-form-group">
                      <label>Technical Skills (Press Enter or Add)</label>
                      <div className="d-flex gap-2 mb-3">
                        <div className="auth-input-wrapper flex-grow-1 m-0">
                          <input 
                            placeholder="e.g. React, Java, Python" 
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                            list="tech-skills-list"
                          />
                          <datalist id="tech-skills-list">
                            <option value="Java" />
                            <option value="Python" />
                            <option value="C++" />
                            <option value="JavaScript" />
                            <option value="React" />
                            <option value="Node.js" />
                            <option value="Spring Boot" />
                            <option value="SQL" />
                            <option value="MongoDB" />
                            <option value="AWS" />
                            <option value="Docker" />
                            <option value="Kubernetes" />
                          </datalist>
                        </div>
                        <button type="button" onClick={handleAddSkill} className="btn-gradient" style={{ borderRadius: '12px', padding: '0 1.5rem' }}>
                          Add
                        </button>
                      </div>
                      
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {skills.length === 0 && <span className="text-muted" style={{fontSize: '0.9rem'}}>No skills added yet</span>}
                        {skills.map((sk, index) => (
                          <div key={index} className="badge d-flex align-items-center gap-1" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                            {sk}
                            <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeSkill(sk)} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="auth-form-group">
                      <label>Resume (Optional)</label>
                      <div className="resume-upload-box" style={{ 
                          border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative'
                      }}>
                          <UploadCloud size={32} className="text-primary mb-2" />
                          <span style={{ color: 'var(--text-muted)' }}>
                            {resumeFile ? resumeFile.name : "Click to embed your Resume PDF"}
                          </span>
                          <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'
                          }} />
                      </div>
                    </div>

                  </div>
                )}
              </>
            )}

            {/* COMPANY WIZARD (Always Step 1) */}
            {role === "COMPANY" && (
              <>
                <div className="auth-form-group">
                  <label>Company Name</label>
                  <div className="auth-input-wrapper">
                    <Building2 size={18} />
                    <input name="companyName" placeholder="TechFlow Innovations" onChange={handleCompanyChange} value={companyForm.companyName} required />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>Registered Email (Read-Only)</label>
                  <div className="auth-input-wrapper" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                    <Mail size={18} style={{ color: 'var(--text-muted)' }} />
                    <input name="email" value={companyForm.email} className="text-muted" style={{ background: 'transparent', cursor: 'not-allowed' }} readOnly />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>Headquarters Location</label>
                  <div className="auth-input-wrapper">
                    <MapPin size={18} />
                    <input name="location" placeholder="San Francisco, CA" onChange={handleCompanyChange} value={companyForm.location} required />
                  </div>
                </div>
              </>
            )}

            {/* NAVIGATION WIZARD CONTROLS */}
            <div className="d-flex gap-3 mt-4">
               {step > 1 && (
                  <button type="button" onClick={prevStep} className="btn-outline-glow flex-grow-1 d-flex justify-content-center align-items-center gap-2" style={{ padding: '1rem', borderRadius: '12px' }}>
                    <ChevronLeft size={20} /> Back
                  </button>
               )}
               <button 
                type="submit"
                className="btn-gradient flex-grow-1 d-flex justify-content-center align-items-center gap-2" 
                style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '12px' }}
                disabled={isLoading}
               >
                {isLoading ? "Saving..." : step < totalSteps ? <>Next <ChevronRight size={20}/></> : <>Complete <Check size={20}/></>}
               </button>
            </div>
          </form>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .wizard-step { animation: fadeSlide 0.3s ease-out forwards; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        .resume-upload-box:hover { border-color: var(--primary-color) !important; background: rgba(56, 189, 248, 0.05) !important; }
      `}} />
    </div>
  );
}

export default CompleteProfile;
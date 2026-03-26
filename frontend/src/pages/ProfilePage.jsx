import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createStudentProfile, createCompanyProfile } from "../api/authApi";

function CompleteProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role;

  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    email: "",
    location: "",
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    rollNo: "",
    branch: "",
    cgpa: "",
    year: ""
  });

  // Simplified: Use one handler or point to the correct ones
  const handleStudentChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleCompanyChange = (e) => {
    setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
  }; // Added missing closing brace

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (role === "STUDENT") {
        // Fix: Use studentForm instead of 'form'
        await createStudentProfile(studentForm);
        alert("Profile saved successfully ✅");
        navigate("/login");
      } else if (role === "COMPANY") {
        // Fix: Use companyForm instead of 'form'
        await createCompanyProfile(companyForm);
        alert("Profile saved successfully ✅");
        navigate("/company");
      }
    } catch (err) {
      alert("Error saving profile ❌");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h4 className="mb-3">Complete Profile</h4>
        <form onSubmit={handleSubmit}>
          {role === "STUDENT" && (
            <>
              <input name="name" placeholder="Name" className="form-control mb-2" onChange={handleStudentChange} value={studentForm.name} />
              <input name="email" placeholder="Email" className="form-control mb-2" onChange={handleStudentChange} value={studentForm.email} />
              <input name="rollNo" placeholder="Roll No" className="form-control mb-2" onChange={handleStudentChange} value={studentForm.rollNo} />
              <input name="branch" placeholder="Branch" className="form-control mb-2" onChange={handleStudentChange} value={studentForm.branch} />
              <input name="cgpa" placeholder="CGPA" className="form-control mb-2" onChange={handleStudentChange} value={studentForm.cgpa} />
              <input name="year" placeholder="Year" className="form-control mb-2" onChange={handleStudentChange} value={studentForm.year} />
            </>
          )}

          {role === "COMPANY" && (
            <>
              <input name="companyName" placeholder="Company Name" className="form-control mb-2" onChange={handleCompanyChange} value={companyForm.companyName} />
              <input name="email" placeholder="Email" className="form-control mb-2" onChange={handleCompanyChange} value={companyForm.email} />
              <input name="location" placeholder="Location" className="form-control mb-2" onChange={handleCompanyChange} value={companyForm.location} />
            </>
          )}

          <button className="btn btn-success w-100 mt-2">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
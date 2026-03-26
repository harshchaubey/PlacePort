
import { useNavigate } from "react-router-dom";
import { useState } from "react";   // 👈 ADD THIS
import { useEffect } from "react";
import { getAllJobs } from "../api/jobApi"; // your API
function HomePage() {
  const navigate = useNavigate();
const [keyword, setKeyword] = useState("");
const [location, setLocation] = useState("");
const [suggestions, setSuggestions] = useState([]);
const [jobs, setJobs] = useState([]);


  const handleSearch = () => {
    navigate(`/jobs?keyword=${keyword.trim()}`);
  };

useEffect(() => {
  getAllJobs().then((res) => {
    const data = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];
    setJobs(data);
  });
}, []);

useEffect(() => {
  if (!keyword.trim()) {
    setSuggestions([]);
    return;
  }

  const filteredJobs = jobs.filter((job) => {
    const title = (job.title || "").toLowerCase();
    const desc = (job.description || "").toLowerCase();

    return (
      title.includes((keyword || "").toLowerCase()) ||
      desc.includes((keyword || "").toLowerCase())
    );
  });
 setSuggestions(filteredJobs.slice(0, 5));
}, [keyword, jobs]);



  return (
    <div className="min-vh-100 w-100 d-flex flex-column bg-light">

      {/* 🔝 NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm px-5 py-3">
        <span className="navbar-brand fw-bold text-primary fs-4">
          🎓 Placement Portal
        </span>

        <div className="ms-auto">
          <button
            className="btn btn-light me-2 px-4 fw-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn btn-primary px-4 fw-semibold shadow-sm"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </nav>

      {/* 🔍 SEARCH BAR */}
  <div className="container-fluid px-5 mt-4">
    <div className="bg-white shadow-sm rounded-pill p-2 d-flex align-items-center position-relative">

      {/* 🔍 KEYWORD WITH SUGGESTIONS */}
      <div className="position-relative w-50">

        <input
          className="form-control border-0 shadow-none"
          placeholder="🔍 Job title or keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        {/* 🔥 Suggestions */}
        {suggestions.length > 0 && (
          <div className="suggestions-box">
            {suggestions.map((job) => (
              <div
                key={job.id}
                className="suggestion-item"
                onClick={() => {
                  setKeyword(job.title);
                  setSuggestions([]);
                }}
              >
                {job.title}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 📍 LOCATION */}
      <input
        className="form-control border-0 shadow-none"
        placeholder="📍 Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* 🔍 BUTTON */}
      <button
        className="btn btn-primary rounded-pill px-4 fw-semibold"
        onClick={handleSearch}
      >
        Search
      </button>

    </div>
  </div>

      {/* 🎯 HERO SECTION */}
      <div className="container-fluid px-5 flex-grow-1 d-flex align-items-center">

        <div className="row w-100 align-items-center">

          {/* LEFT */}
          <div className="col-md-6">
            <h1 className="fw-bold display-5">
              Find the job that fits <br />
              your <span className="text-primary">future</span>
            </h1>

            <p className="text-muted mt-3 fs-5">
              Discover opportunities from top companies and build your career
            </p>

            <div className="mt-4">
              <button className="btn btn-outline-primary me-3 px-4 py-2 fw-semibold">
                Upload Resume
              </button>

              <button
                className="btn btn-primary px-4 py-2 fw-semibold shadow"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="col-md-6 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="user"
              className="img-fluid"
              style={{ maxHeight: "350px" }}
            />
          </div>

        </div>
      </div>

      {/* 🏢 COMPANY SECTION */}
      <div className="container-fluid px-5 pb-4">

        <h6 className="text-muted fw-semibold mb-3">
          Trusted by top companies
        </h6>

        <div className="d-flex gap-5 flex-wrap align-items-center opacity-75">

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
            height="35"
          />

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Tata_Consultancy_Services_Logo.svg"
            height="35"
          />

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg"
            height="35"
          />

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
            height="35"
          />

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Wipro_Primary_Logo_Color_RGB.svg"
            height="35"
          />

        </div>
      </div>

    </div>
  );
}

export default HomePage;
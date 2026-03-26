import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);

      alert("Registered successfully ✅");

      // 👉 redirect to profile completion
      navigate("/complete-profile", { state: { role: form.role } });

    } catch (err) {
      alert("Registration failed ❌");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(to right, #4facfe, #00f2fe)"
      }}
    >
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">📝 Register</h3>

        <form onSubmit={handleRegister}>

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          {/* ROLE */}
          <select
            name="role"
            className="form-control mb-3"
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="STUDENT">Student</option>
            <option value="COMPANY">Company</option>
          </select>

          {/* BUTTON */}
          <button className="btn btn-primary w-100">
            Register
          </button>

        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
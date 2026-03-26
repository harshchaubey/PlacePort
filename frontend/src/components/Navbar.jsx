import { useNavigate } from "react-router-dom";
import { logout } from "../auth/auth";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";

function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setRole(res.data.role);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">

      {/* LEFT */}
      <span
        className="navbar-brand"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        🎓 Placement Portal
      </span>

      {/* RIGHT */}
      <div className="ms-auto d-flex align-items-center gap-3">

        {/* Role */}
        <span className="text-white">
          Role: <strong>{role}</strong>
        </span>

        {/* Profile Button */}
        <button
          className="btn btn-light btn-sm"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>

        {/* Logout */}
        <button
          className="btn btn-danger btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
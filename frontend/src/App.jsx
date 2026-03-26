import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import RegisterPage from "./pages/RegisterPage";
import CompleteProfile from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import JobsPage from "./pages/JobsPage";
function App() {
  return (
    <Routes>
      {/* Public Route */}
    <Route path="/jobs" element={<JobsPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
     <Route path="/register" element={<RegisterPage />} />
     <Route path="/complete-profile" element={<CompleteProfile />} />
      {/* Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
<Route path="/profile" element={<ProfilePage />} />
      <Route
        path="/company"
        element={
          <ProtectedRoute allowedRoles={["COMPANY"]}>
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>


  );


}

export default App;
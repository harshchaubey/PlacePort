import { Navigate } from "react-router-dom";
import { getToken } from "../auth/auth";
import{getCurrentUser} from "../api/authApi";
import{useEffect,useState} from "react";

function ProtectedRoute({ children ,allowedRoles}) {
  const token = getToken();
  const[role,setRole] = useState(null);
  const[loading,setLoading] = useState(true);

  useEffect(() => {
     const fetchUser = async () => {
       try {
         const res = await getCurrentUser();
         setRole(res.data.role);
       } catch (err) {
         console.error("Auth error:", err);
       } finally {
         setLoading(false);
       }
     };

     fetchUser();
   }, []);

   if (!token) {
     return <Navigate to="/" />;
   }

if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
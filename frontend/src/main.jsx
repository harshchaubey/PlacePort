import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import 'bootstrap/dist/css/bootstrap.min.css';

// The Google Client ID is mathematically safe to be hardcoded in the frontend, as it only acts as a public identifier for the OAuth popup.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1015402665123-2i7bmaajne128j8o3msntali95fu80sa.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
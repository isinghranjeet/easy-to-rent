import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log("Google Client ID:", googleClientId);

if (!googleClientId) {
  console.error("VITE_GOOGLE_CLIENT_ID is not set in .env file");
}

const container = document.getElementById("root")!;
const root = createRoot(container);

// 🔥 Fix: prevents first-frame flash (Vite/blank screen)
requestAnimationFrame(() => {
  setTimeout(() => {
    root.render(
      <React.StrictMode>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <App />
          </GoogleOAuthProvider>
        ) : (
          <App />
        )}
      </React.StrictMode>
    );
  }, 0);
});
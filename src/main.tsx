import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./state/AuthContext";
import { PassProvider } from "./state/PassContext";
import { LocationCacheProvider } from "./state/LocationCacheContext";
import { SyncStatusProvider } from "./state/SyncStatusContext";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SyncStatusProvider>
        <AuthProvider>
          <LocationCacheProvider>
            <PassProvider>
              <App />
            </PassProvider>
          </LocationCacheProvider>
        </AuthProvider>
      </SyncStatusProvider>
    </BrowserRouter>
  </StrictMode>,
);

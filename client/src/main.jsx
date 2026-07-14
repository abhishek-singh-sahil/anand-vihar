import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#013e37",
            color: "#fff",
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "15px",
          },
          success: {
            iconTheme: {
              primary: "#ff9248",
              secondary: "#fff",
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import appRouter from "./router";
import "./index.css";
import { setCookie } from "./utils/cookies";

// Set the auth token cookie
setCookie(
  "auth_token",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OTJhMzQxMi0zOTM3LTQwNjMtODFkMi0zZDZhYzVhNjUxYTMiLCJlbWFpbCI6InB1c2hrYXIxNzEzQGdtYWlsLmNvbSIsImlhdCI6MTc0NjcwMjY2NywiZXhwIjoxNzQ2NzM4NjY3fQ.l1rZYNbLsZTAFYm_O2cN92xcTHL31hNXiCk6R-Z4sQk"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={appRouter} />
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import appRouter from "./router";
import "./index.css";
import { setCookie } from "./utils/cookies";
setCookie(
  "auth_token",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OTJhMzQxMi0zOTM3LTQwNjMtODFkMi0zZDZhYzVhNjUxYTMiLCJlbWFpbCI6InB1c2hrYXIxNzEzQGdtYWlsLmNvbSIsImlhdCI6MTc0NjcyNDM5MSwiZXhwIjoxNzQ2NzYwMzkxfQ.SAFvNJ2a9TwqA-a50gwNCj-bltyY9JVAqK1TlYc2w3Q"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={appRouter} />
  </React.StrictMode>
);

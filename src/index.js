import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import "./polyfills";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SendNotificationPage from "./SendNotificationPage";
import InboxPage from "./Page";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<InboxPage />} />
        <Route path="/send" element={<SendNotificationPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);

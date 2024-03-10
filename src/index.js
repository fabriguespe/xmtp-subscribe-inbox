import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import "./polyfills";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SendNotification from "./Notifications/SendNotification";
import SendCurrencyRequest from "./CurrencyRequest/SendCurrencyRequest";
import InboxPage from "./Page";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<InboxPage />} />
        <Route path="/send" element={<SendNotification />} />
        <Route path="/request" element={<SendCurrencyRequest />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);

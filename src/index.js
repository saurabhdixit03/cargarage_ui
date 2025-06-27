import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Router should be here
import App from "./App";

//import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter> {/* ✅ Router must be at the top level */}
    <App />
  </BrowserRouter>
);

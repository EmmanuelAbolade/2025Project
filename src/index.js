//src\index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { initializeFCM } from "./initializeFCM";


// Initialize FCM on app load
initializeFCM();
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}


//const root = ReactDOM.createRoot(document.getElementById("root"));
//root.render(
  //<React.StrictMode>
   // <App />
 // </React.StrictMode>
//);

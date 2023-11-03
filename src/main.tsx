import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const saveCallback = (lastPoint: string) => {
  console.log(lastPoint);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App saveCallback={saveCallback} />
  </React.StrictMode>
);

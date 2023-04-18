import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import React from "react";

const container = document.getElementById("root");
const root = createRoot(container)
root.render(
    <App />
);
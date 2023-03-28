import { createRoot } from "react-dom/client";
import { Index } from "./Index.jsx";

const container = document.getElementById("root");
const root = createRoot(container)
root.render(
    <Index />
);
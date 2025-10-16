import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ✅ Import favicon from src/assets
import faviconUrl from "./assets/favicon.png";

// ✅ Dynamically add favicon to the document head
const link = document.createElement("link");
link.rel = "icon";
link.type = "image/png";
link.href = faviconUrl;
document.head.appendChild(link);

// Render your app
createRoot(document.getElementById("root")!).render(<App />);

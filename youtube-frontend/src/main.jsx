import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./routes/AppRoutes.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReactLenis } from "lenis/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReactLenis root>
      <AppRoutes />
    </ReactLenis>
  </StrictMode>
);

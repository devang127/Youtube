import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import { lazy, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToAnchor from "../utils/ScrollToAnchor";


const AppRoutes = () => {
  const { BASE_URL } = import.meta.env;
  const HomePage = lazy(() => import("../pages/HomePage"));

  return (
    <BrowserRouter basename={BASE_URL}>
      <ScrollToAnchor />
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<HomePage pageName="homepage" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

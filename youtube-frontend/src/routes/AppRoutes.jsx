import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import { lazy, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "../components/common/ScrollToTop";
import ErrorPage from "../components/common/ErrorPage";
import ScrollToAnchor from "../utils/ScrollToAnchor";
import ContactPage from "../pages/ContactPage";

const AppRoutes = () => {
  const { BASE_URL } = import.meta.env;
  const HomePage = lazy(() => import("../pages/HomePage"));
  const Product = lazy(() => import("../pages/Product"));
  const AboutPage = lazy(() => import("../pages/AboutPage"));


  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
      once: true,
      offset: 50,
      disable: window.innerWidth < 576
    });
  }, []);

  return (
    <BrowserRouter basename={BASE_URL}>
      <ScrollToTop />
      <ScrollToAnchor />
      <Routes>
        <Route element={<App />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

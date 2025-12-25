import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useLayoutEffect(() => {
    window.dispatchEvent(new Event("transitionStart"));

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("transitionEnd"));
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;

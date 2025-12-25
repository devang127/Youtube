import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";

const ScrollToAnchor = () => {
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (location.hash && lenis) {
      const timeoutId = setTimeout(() => {
        lenis.scrollTo(location.hash, {
          offset: -50,
          duration: 1.5,
          delay: 0.5,
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [lenis, location]);

  return null;
};

export default ScrollToAnchor;

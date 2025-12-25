import { ReactLenis } from "lenis/react";

function SmoothScroller({ children }) {
  const lenisOptions = {
    lerp: 0.1,
    duration: 1,
    smoothTouch: false,
    smooth: true
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScroller;

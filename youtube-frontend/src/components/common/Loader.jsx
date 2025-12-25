import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const Loader = ({ onComplete }) => {
  const scope = useRef(null);

  useGSAP(
    () => {
      gsap.to(scope.current, {
        scale: 4,
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        delay: 3,
        onComplete: onComplete
      });
    },
    { scope }
  );

  return (
    <section className="loader" ref={scope}>
      <div className="wrapper">
        <h1>VUB ENGIINEERING</h1>
        <h1>VUB ENGIINEERING</h1>
      </div>
    </section>
  );
};

export default Loader;

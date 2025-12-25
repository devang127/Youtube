import React from "react";
import { useTextSplitAnimation } from "../../hooks/useTextSplitAnimation";

export const AnimatedText = ({ children, className = "", tag: Tag = "div", animationOptions = {}, ...props }) => {
  const ref = useTextSplitAnimation(animationOptions);

  return (
    <Tag ref={ref} className={`text-split letters-slide-up ${className}`} {...props}>
      {children}
    </Tag>
  );
};

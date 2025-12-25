import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const extractNumber = str => {
  const match = str
    .toString()
    .replace(/,/g, "")
    .match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const formatNumber = (originalStr, currentValue) => {
  const originalString = originalStr.toString();
  const hasComma = originalString.includes(",");
  const hasDecimal = originalString.includes(".");
  const prefixMatch = originalString.match(/^([^\d]+)/);
  const prefix = prefixMatch ? prefixMatch[1] : "";
  const suffixMatch = originalString.match(/([^\d.,]+)$/);
  let suffix = suffixMatch ? suffixMatch[1] : "";
  
  if (prefix && suffix.includes(prefix.trim())) {
    suffix = suffix.replace(prefix.trim(), "");
  }

  let formattedValue;

  if (hasDecimal) {
    const decimalPlaces = (originalString.match(/\.(\d+)/) || ['', ''])[1].length;
    formattedValue = currentValue.toFixed(decimalPlaces);
  } else {
    formattedValue = Math.floor(currentValue).toString();
  }

  if (hasComma && currentValue >= 1000) {
    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return prefix + formattedValue + suffix;
};

const AnimatedStats = ({ value, description, className = "", duration = 2000, delay = 0 }) => {
  const [animatedValue, setAnimatedValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const statRef = useRef(null);

  const animateValue = (targetValue, animationDuration) => {
    const startTime = performance.now();
    const startValue = 0;

    const updateCounter = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      const currentValue = startValue + progress * (targetValue - startValue);

      setAnimatedValue(formatNumber(value, currentValue));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setAnimatedValue(formatNumber(value, targetValue));
      }
    };

    requestAnimationFrame(updateCounter);
  };

  useEffect(() => {
    const handleIntersection = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          const targetValue = extractNumber(value);

          if (targetValue > 0) {
            setTimeout(() => {
              animateValue(targetValue, duration);
            }, delay);
          } else {
            setAnimatedValue(value.toString());
          }

          setHasAnimated(true);
          observer.disconnect();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "0px 0px -10% 0px"
    });

    if (statRef.current) {
      observer.observe(statRef.current);
    }

      return () => {
        observer.disconnect(); // cleanup
      };

  }, [value, duration, delay]);

  return (
    <div ref={statRef} className={`stats-item ${className}`}>
      <h3>{animatedValue}</h3>
      <p>{description}</p>
    </div>
  );
};

AnimatedStats.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
  className: PropTypes.string,
  duration: PropTypes.number,
  delay: PropTypes.number
};

export default AnimatedStats;

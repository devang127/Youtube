import React, { useState, useEffect } from "react";

const CDNImage = ({
  imgSrc,
  imgAlt = "",
  imgClass = "",
  className = "",
  exactImgPath = true,
  fallbackSrc = null,
  loadingLazy = false,
  onError = null,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(exactImgPath ? imgSrc : `${import.meta.env.VITE_IMAGE_CDN_URL}${imgSrc}`);

  useEffect(() => {
    const newSrc = exactImgPath ? imgSrc : `${import.meta.env.VITE_IMAGE_CDN_URL}${imgSrc}`;
    setCurrentSrc(newSrc);
    setHasError(false);
  }, [imgSrc, exactImgPath]);

  const handleError = e => {
    console.error(`Failed to load image: ${currentSrc}`);

    if (onError) {
      onError(e);
    }

    if (fallbackSrc && !hasError) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    } else {
      setHasError(true);
    }
  };

  if (hasError && (!fallbackSrc || currentSrc === fallbackSrc)) {
    return (
      <figure className={className} {...props}>
        <img loading={loadingLazy ? "lazy" : undefined} src="/media/images/common/placeholder-potrait.jpg" alt="placeholder" className={`w-100 h-100 ${imgClass}`} />
      </figure>
    );
  }

  return (
    <figure className={`mb-0 ${className}`} {...props}>
      <img src={currentSrc} alt={imgAlt} loading={loadingLazy ? "lazy" : undefined}  className={imgClass}  onError={handleError} />
    </figure>
  );
};

export default CDNImage;

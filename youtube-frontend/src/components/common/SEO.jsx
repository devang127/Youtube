import { useEffect } from "react";
import { useSEOData } from "../../hooks/useSEOData";

const SEO = ({ pageName, detailPage = false, staticSEOData }) => {
  // console.log('pageName in SEO', pageName);

  let { data: seoDataFromHook, isLoading, isError } = useSEOData({pageName});

  let seoData;

  // Determine which SEO data to use
  if (staticSEOData) {
    seoData = staticSEOData;
  } else if (detailPage) {
    seoData = pageName;
  } else {
    seoData = seoDataFromHook;
  }

  useEffect(() => {
    const originalTitle = document.title;
    const addedMetaTags = [];
    let canonicalTag;

    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;

      const attribute = property ? "property" : "name";
      const selector = `meta[${attribute}="${name}"]`;
      let metaTag = document.querySelector(selector);

      if (metaTag) {
        metaTag.setAttribute("content", content);
      } else {
        metaTag = document.createElement("meta");
        metaTag.setAttribute(attribute, name);
        metaTag.setAttribute("content", content);
        document.head.appendChild(metaTag);
        addedMetaTags.push(metaTag);
      }
    };

    if (seoData && !isLoading && !isError) {
      if (seoData.meta_title) {
        document.title = seoData.meta_title;
      }

      updateMetaTag("description", seoData.meta_description);
      updateMetaTag("keywords", seoData.meta_keywords);

      updateMetaTag("og:title", seoData.meta_title, true);
      updateMetaTag("og:description", seoData.meta_description, true);
      updateMetaTag("og:url", window.location.href, true);
      updateMetaTag("og:type", "website", true);

      updateMetaTag("twitter:card", "summary_large_image");
      updateMetaTag("twitter:title", seoData.meta_title);
      updateMetaTag("twitter:description", seoData.meta_description);

      const existingCanonical = document.querySelector('link[rel="canonical"]');
      const canonicalUrl = window.location.href;

      if (existingCanonical) {
        existingCanonical.setAttribute("href", canonicalUrl);
        canonicalTag = null;
      } else {
        canonicalTag = document.createElement("link");
        canonicalTag.setAttribute("rel", "canonical");
        canonicalTag.setAttribute("href", canonicalUrl);
        document.head.appendChild(canonicalTag);
      }

      updateMetaTag("robots", "index, follow");

      if (seoData.image_path) {
        const imageUrl = seoData.image_path.startsWith("http") ? seoData.image_path : `${import.meta.env.VITE_BACKEND_URL}${seoData.image_path}`;

        updateMetaTag("og:image", imageUrl, true);
        updateMetaTag("twitter:image", imageUrl);
      }

      if (seoData.banner_path) {
        const imageUrl = seoData.banner_path.startsWith("http") ? seoData.banner_path : `${import.meta.env.VITE_BACKEND_URL}${seoData.banner_path}`;

        updateMetaTag("og:image", imageUrl, true);
        updateMetaTag("twitter:image", imageUrl);
      }
    }

    return () => {
      document.title = originalTitle;
      addedMetaTags.forEach(tag => document.head.removeChild(tag));
      if (canonicalTag) {
        document.head.removeChild(canonicalTag);
      }
    };
  }, [seoData, isLoading, isError, pageName, detailPage, staticSEOData]);

  return null;
};

export default SEO;

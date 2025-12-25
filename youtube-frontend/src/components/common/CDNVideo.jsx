import "video.js/dist/video-js.css";
import VideoJS from "./VideoJS";

const CDNVideo = ({ videoSrc, className = "", posterSrc }) => {
  const baseURL = import.meta.env.VITE_VIDEO_CDN_URL;

  const videoJsOptions = {
    autoplay: true,
    controls: false,
    responsive: true,
    fluid: true,
    playsinline: true,
    loop: true,
    poster: `${posterSrc}`,
    preload: "auto",
    sources: [
      {
        src: `${baseURL}${videoSrc}`,
        type: "application/x-mpegURL"
      }
    ]
  };

  const classArray = className.trim().split(/\s+/);

  return <VideoJS className={classArray} options={videoJsOptions} />;
};

export default CDNVideo;

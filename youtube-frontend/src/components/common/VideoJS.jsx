import React, { useEffect, useRef, useState, useMemo } from "react";
import videojs from "video.js";
import Hls from "hls.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";
import "videojs-hls-quality-selector";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const generateUniqueId = (() => {
  let counter = 0;
  return (prefix = "videojs-player") => `${prefix}-${counter++}`;
})();

export const VideoJS = ({
  videoSrc,
  posterSrc,
  className = "",
  type = "application/vnd.apple.mpegurl",
  options = {},
  onReady,
  videoId,
  autoplay = true,
  controls = false,
  responsive = true,
  fluid = true,
  loop = true,
  muted = true,
  preload = "auto",
  audioEnabled = true,
  onError
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(false);

  const uniqueId = useRef(videoId || generateUniqueId()).current;
  const baseURL = import.meta.env.VITE_VIDEO_CDN_URL || "";

  const classArray = useMemo(() => {
    return typeof className === "string" ? className.trim().split(/\s+/).filter(Boolean) : Array.isArray(className) ? className : [];
  }, [className]);

  const videoJsOptions = useMemo(
    () => ({
      autoplay,
      controls,
      responsive,
      fluid,
      playsinline: true,
      loop,
      muted,
      preload,
      html5: {
        nativeAudioTracks: true,
        nativeVideoTracks: true,
        nativeTextTracks: true
      },
      ...options
    }),
    [autoplay, controls, responsive, fluid, loop, muted, preload, options]
  );

  // Initialize player
  useEffect(() => {
    if (!videoRef.current) return;

    // Create video element if it doesn't exist
    if (!playerRef.current) {
      const videoElement = document.createElement("video");
      videoElement.id = uniqueId;
      videoElement.className = "video-js vjs-default-skin";

      // Add custom classes
      classArray.forEach(cls => videoElement.classList.add(cls));

      // Set attributes
      videoElement.setAttribute("playsinline", "");
      videoElement.setAttribute("muted", muted.toString());
      videoElement.setAttribute("loop", loop.toString());
      videoElement.setAttribute("preload", preload);

      if (posterSrc) {
        videoElement.setAttribute("poster", posterSrc);
      }

      videoRef.current.appendChild(videoElement);

      // Initialize Video.js player
      const player = videojs(videoElement, videoJsOptions, () => {
        console.log("VideoJS player is ready");
        onReady && onReady(player);
      });

      playerRef.current = player;

      // Add event listeners
      player.on("volumechange", () => {
        setIsMuted(player.muted());
      });

      player.on("error", error => {
        console.error("VideoJS Error:", error);
        onError && onError(error);
      });
    }

    return () => {
      // Cleanup will be handled in separate useEffect
    };
  }, [uniqueId, classArray, videoJsOptions, posterSrc, muted, loop, preload, onReady, onError]);

  // Handle source changes dynamically
  useEffect(() => {
    if (!playerRef.current || !videoSrc) return;

    const player = playerRef.current;
    const fullVideoSrc = videoSrc.startsWith("http") ? videoSrc : `${baseURL}${videoSrc}`;

    setIsLoading(true);

    // Dispose of existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Check if HLS is supported
    if (Hls.isSupported()) {
      console.log("Browser supports HLS via HLS.js");

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsRef.current = hls;

      hls.loadSource(fullVideoSrc);
      hls.attachMedia(player.el().querySelector("video"));

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS Manifest parsed");
        setIsLoading(false);

        // Update Video.js source
        player.src({
          src: fullVideoSrc,
          type: "application/vnd.apple.mpegurl"
        });

        if (autoplay) {
          player.ready(() => {
            player.play().catch(error => {
              console.warn("Autoplay failed:", error);
            });
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS Error:", data);
        setIsLoading(false);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Fatal network error encountered, trying to recover");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Fatal media error encountered, trying to recover");
              hls.recoverMediaError();
              break;
            default:
              console.error("Fatal error, cannot recover");
              hls.destroy();
              hlsRef.current = null;
              onError && onError(data);
              break;
          }
        }
      });
    } else if (player.el().querySelector("video").canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      console.log("Browser supports native HLS");

      player.src({
        src: fullVideoSrc,
        type: "application/vnd.apple.mpegurl"
      });

      player.one("canplay", () => {
        setIsLoading(false);
        if (autoplay) {
          player.play().catch(error => {
            console.warn("Autoplay failed:", error);
          });
        }
      });
    } else {
      // Fallback - try to play as regular video
      console.log("HLS not supported, trying regular video playback");

      player.src({
        src: fullVideoSrc,
        type: type
      });

      player.one("canplay", () => {
        setIsLoading(false);
        if (autoplay) {
          player.play().catch(error => {
            console.warn("Autoplay failed:", error);
          });
        }
      });

      player.one("error", () => {
        setIsLoading(false);
        console.error("Video format not supported");
        onError && onError(new Error("Video format not supported"));
      });
    }
  }, [videoSrc, baseURL, autoplay, type, onError]);

  // Update poster dynamically
  useEffect(() => {
    if (playerRef.current && posterSrc) {
      playerRef.current.poster(posterSrc);
    }
  }, [posterSrc]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    if (playerRef.current) {
      const player = playerRef.current;
      player.muted(!player.muted());
      setIsMuted(player.muted());
    }
  };

  return (
    <div data-vjs-player className="videojs-wrapper">
      <div ref={videoRef} />

      {isLoading && (
        <div className="video-loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}

      {audioEnabled && (
        <button className="audio-btn" onClick={toggleMute} aria-label={isMuted ? "Unmute video" : "Mute video"}>
          <span>{isMuted ? <FaVolumeMute /> : <FaVolumeUp />}</span>
        </button>
      )}
    </div>
  );
};

export default VideoJS;

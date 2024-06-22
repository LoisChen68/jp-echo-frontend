import { Box } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

declare var YT: any;

function YouTubePlayer({
  videoId,
  onPlayerReady,
  onStateChange,
  start,
  end,
}: {
  videoId: string;
  start: number;
  end: number;
  onPlayerReady: (e: any) => void;
  onStateChange: (e: any) => void;
}) {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        if (playerRef.current) {
          new YT.Player(playerRef.current, {
            height: "100%",
            width: "100%",
            videoId,
            playerVars: {
              rel: 0,
              start: start,
              end: end,
              autoplay: 0,
              controls: 0,
              cc_load_policy: 0,
            },
            events: {
              onReady: onPlayerReady,
              onStateChange: onStateChange,
            },
          });
        }
      };
    } else if (window.YT) {
      new YT.Player(playerRef.current, {
        height: "100%",
        width: "100%",
        videoId,
        start: start,
        end: end,
        playerVars: { rel: 0, autoplay: 0, controls: 0, cc_load_policy: 0 },
        events: {
          onReady: onPlayerReady,
          onStateChange: onStateChange,
        },
      });
    }
  }, [end, onPlayerReady, onStateChange, start, videoId]);

  return <Box ref={playerRef} />;
}

export default YouTubePlayer;

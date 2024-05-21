"use client";

import { time } from "console";
import { init } from "next/dist/compiled/webpack/webpack";
import { initialize } from "next/dist/server/lib/render-server";
import React, { useRef, useEffect } from "react";

interface Button {
  text: string;
  start: number;
}

interface YouTubePlayerProps {
  vidId: string;
  queryTerm: string;
  buttons: Button[];
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  vidId,
  queryTerm,
  buttons,
}) => {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = initializePlayer;
      } else {
        initializePlayer();
      }
    };

    const initializePlayer = () => {
      playerRef.current = new window.YT.Player(`player-${vidId}`, {
        height: "390",
        width: "640",
        videoId: vidId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onError: (event: any) => {
            console.error("YouTube Player Error:", event);
          },
        },
      });
    };
    loadYouTubeAPI();
  }, [vidId]);

  const setCurrentTime = (time: number) => {
    console.log("Seeking to:", time);
    console.log("palyerRef.current:", playerRef.current);

    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(time, true);
    } else {
      console.log("playerRef.current is null");
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-3xl w-full mb-4">
      <div className="p-4 text-center bg-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">
          We found {buttons.length} mentions of &quot;{queryTerm}&quot; in this
          episode:
        </h2>
      </div>
      <div
        id={`player-${vidId}`}
        className="w-full bg-black aspect-w-16 aspect-h-9"
      ></div>
      <div className="flex flex-col items-center p-3 w-full">
        <div className="w-full h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <div className="flex flex-col space-y-4">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => setCurrentTime(button.start)}
                className="self-start px-4 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full hover:from-green-600 hover:to-blue-600 transition duration-300 transform hover:scale-105"
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;

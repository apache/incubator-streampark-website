import React, { useState } from 'react';
import clsx from 'clsx';
import SPDashboardImage from '@site/static/home/dashboard.svg';
import VideoPlayIcon from '@site/static/icons/video-play.svg';
import VideoPauseIcon from '@site/static/icons/video-pause.svg';
import useBaseUrl from '@docusaurus/useBaseUrl';

import './styles.less';

interface BannerVideoProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function BannerVideo(props: BannerVideoProps) {
  const [isShowVideo, setIsShowVideo] = useState(false);

  const videoURL =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const coverImage = useBaseUrl('/home/screenshot.png');

  function handleClick() {
    setIsShowVideo(!isShowVideo);
  }

  return (
    <div
      className={clsx('BannerVideo relative h-full', props.className)}
      style={props.style}
    >
      {isShowVideo ? (
        <video
          src={videoURL}
          className="h-full w-full object-fill"
          autoPlay
        />
      ) : (
        <img
          src={coverImage}
          alt="dashboard screenshot"
          className="h-full w-full object-fill"
        />
      )}
      <VideoController isPlaying={isShowVideo} onClick={handleClick} />
    </div>
  );
}

function VideoController({
  isPlaying,
  onClick,
}: {
  isPlaying: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mask absolute inset-0 bg-black bg-opacity-10 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-all duration-500">
      <div
        className="play-icon-wrapper absolute-center w-20 h-20 text-black dark:text-white"
        onClick={onClick}
      >
        <div className="bg-white dark:bg-neutral-800 rounded-full cursor-pointer block flex-center w-20 h-20">
          {isPlaying ? (
            <VideoPauseIcon className="rounded-full w-10 h-10" />
          ) : (
            <VideoPlayIcon className="rounded-full w-10 h-10 ml-1" />
          )}
        </div>
        <div className="broder-pulse bg-white dark:bg-black"></div>
      </div>
    </div>
  );
}

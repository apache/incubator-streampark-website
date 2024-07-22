import React, { useState } from 'react';
import clsx from 'clsx';
import SPDashboardImage from '@site/static/home/dashboard.svg';
import VideoPlayIcon from '@site/static/icons/video-play.svg';
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

  return (
    <div className={clsx('BannerVideo', props.className)} style={props.style}>
      {isShowVideo ? (
        <video src={videoURL} className="w-full h-full bg-transparent" autoPlay controls />
      ) : (
        <CoverImage show={!isShowVideo} onPlay={() => setIsShowVideo(true)} />
      )}
    </div>
  );
}

function CoverImage({ show, onPlay }: { show: boolean; onPlay: () => void }) {
  return (
    <div className="cover-image-wrapper relative">
      <img
        src={useBaseUrl('/home/screenshot.png')}
        alt="dashboard screenshot"
        className="w-full h-full"
      />
      <div
        className="play-icon-wrapper absolute-center w-24 h-24 rounded-full before:backdrop-blur-lg cursor-pointer"
        onClick={onPlay}
      >
        <VideoPlayIcon className="absolute-center w-20 h-20 cursor-pointer" />
      </div>
    </div>
  );
}

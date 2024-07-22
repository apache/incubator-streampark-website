import React from 'react';
import clsx from 'clsx';
import { useWindowSize } from '@docusaurus/theme-common';
import MonitorImage from '@site/static/home/dashboard.svg';
import './styles.less'

interface ScreenMonitorProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function ScreenMonitor(props: ScreenMonitorProps) {
  const windowSize = useWindowSize();

  if (windowSize === 'mobile') return null;

  return (
    <div
      className={clsx(props.className, 'monitor-container overflow-hidden h-96')}
      style={props.style}
    >
      <div className="text-center" data-aos="fade-up" data-aos-delay="100">
        <MonitorImage className="" />
      </div>
    </div>
  );
}

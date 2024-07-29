import React, { useState, useEffect } from 'react';
import classNames from 'clsx';
import './styles.less';

interface MacBrowserProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function MacBrowser(props: MacBrowserProps) {
  const [url, setUrl] = useState('https://streampark.apache.org');

  // useEffect(() => {
  //   setUrl(window.location.origin);
  // }, []);

  return (
    <div
      className={classNames('mac-browser', props.className)}
      style={props.style}
      data-aos="fade-up"
    >
      <div className="mac-browser__header">
        <div className="mac-browser__buttons">
          <i className="mac-browser__button mac-browser__button--close"></i>
          <i className="mac-browser__button mac-browser__button--minimize"></i>
          <i className="mac-browser__button mac-browser__button--zoom"></i>
        </div>
        <div className="mac-browser__address-bar">
          <span className="mac-browser__address-bar__text">{url}</span>
        </div>
      </div>
      <div className="mac-browser__content">{props.children}</div>
    </div>
  );
}

import React from 'react';

import { useWindowSize } from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';
import config from './languages.json';
import Dashboard from '../../../static/home/dashboard.svg';
import WaveTop from '../../../static/home/wave-top.svg';
import WaveButton from '../../../static/home/wave-buttom.svg';
import clsx from 'clsx';
import { ShellCommand } from '@site/src/components';
import ScreenMonitor from '@site/src/components/ScreenMonitor';

export default function () {
  const isBrowser = useIsBrowser();
  const language =
    isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en';
  const dataSource = config?.[language];

  const INSTALL_COMMAND = `curl -L https://github.com/apache/streampark/raw/dev/streampark.sh | sh`;

  return (
    <>
      <div className="wave-top-wrapper">
        <WaveTop className="wave-top" />
      </div>
      <div className="section hero-main pt-4 pb-2 overflow-hidden main-page mt-lg-6">
        {/* background overlay */}
        <div className="overlay opacity-90 z-index-n1"></div>
        <div className="container-fluid pb-2 cover-container container-hero hero-px">
          <div className="row justify-content-center ">
            <div
              className="col-10 col-sm-10 col-md-10 col-lg-10 align-self-center pe-0"
              data-aos="fade-right"
            >
              <div className="text-center mt-0">
                <div className="mb-4 system_info pt-0">
                  <div className="fw-bold mb-4 d-flex justify-content-center">
                    <div
                      className="d-flex flex-column align-items-center"
                      style={{ width: 'max-content' }}
                    >
                      <div className="text-right" style={{ width: '100%' }}>
                        <span className="badge incubating fs-6 tag">
                          Incubating
                        </span>
                      </div>
                      <span className="project_title">
                        Apache StreamPark<span className="tm">™</span>
                      </span>
                    </div>
                  </div>
                  <p className="desc lead slogan-desc">
                    {dataSource.slogan.description}
                  </p>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <div>
                    <a
                      className="btn streampark-btn btn mt-30 ztop"
                      href="https://github.com/apache/incubator-streampark"
                      target="_blank"
                    >
                      <i className="lni-github-original"></i>&nbsp;GitHub
                    </a>
                    <a
                      className="btn streampark-btn btn-green mt-30 ml-3 ztop"
                      href="/docs/user-guide/quick-start"
                      style={{ marginLeft: '10px' }}
                    >
                      <i className="lni-play"></i>&nbsp;Get started
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* hero image */}
            {/* {HeroImage()} */}
          </div>
        </div>
        <div className="d-flex flex-row justify-content-center">
          {/* hero image */}
          {/* {HeroImage()} */}
          <ScreenMonitor />
        </div>

        <div className="d-flex justify-content-center pt-4">
          <ShellCommand command={INSTALL_COMMAND} />
        </div>

        <div className="pt-4 cover-top">
          <WaveButton className="wave-button" />
        </div>
      </div>
    </>
  );
}

function HeroImage() {
  const windowSize = useWindowSize();
  if (windowSize === 'mobile') {
    return null;
  }
  return (
    <div className="col-9 pt-4 align-self-center">
      <div className="text-right" data-aos="fade-up" data-aos-delay="100">
        <Dashboard className="img-fluid" />
      </div>
    </div>
  );
}

function Button({
  href,
  theme = 'primary',
  icon,
  children,
  className,
  ...props
}) {
  return (
    <a
      className={clsx('btn streampark-btn ztop', `btn-${theme}`, className)}
      href={href}
      {...props}
    >
      {typeof icon === 'string' ? <i className={clsx(icon, 'mr-2')} /> : icon}
      {children}
    </a>
  );
}


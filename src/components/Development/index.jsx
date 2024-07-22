import React from 'react';

import useIsBrowser from '@docusaurus/useIsBrowser';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Coding from '@site/static/home/coding.svg';

import config from './languages.json';
import './styles.less';
import { useColorMode } from '@docusaurus/theme-common';

export default function () {
  const isBrowser = useIsBrowser();
  const language =
    isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en';
  const dataSource = config?.[language];

  const { colorMode } = useColorMode();

  return (
    <div className="section py-6 py-md-7 overflow-hidden performance">
      <div className="container">
        <div className="row performance-block-first">
          <div className="col-md-6 col-sm-12">
            <ol className="process-vertical ps-0">
              {dataSource.development.map((item, i) => (
                <li
                  className="process-vertical-item"
                  key={i}
                  data-aos="zoom-in"
                  data-aos-delay={i * 150}
                >
                  <div className="process-vertical-icon">
                    <div className="process-vertical-icon-bg me-auto rounded-circle p-2 shadow">
                      <i className={item.icon}></i>
                    </div>
                  </div>

                  <div className="process-vertical-content ms-lg-4">
                    <h3 className="h5">{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="col-md-6 col-sm-12 mb-5 align-self-center">
            <div
              className="mb-5 my-lg-0 coder-bg"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <img
                src={
                  colorMode === 'dark'
                    ? useBaseUrl('/home/coder2.png')
                    : useBaseUrl('/home/coder1.png')
                }
                className="coder"
                width="70%"
              ></img>
            </div>
          </div>
        </div>
        <div className="border-dot"></div>
        <div className="row mb-5 mt-5 mb-lg-7">
          <div className="col-md-6 col-sm-12 align-self-center">
            <div
              className="px-5 px-md-7 mb-5 my-lg-0 coder-bg"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <Coding className="img-fluid-coding" />
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <div
              className="mb-5 my-lg-0 coder-bg"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img
                src={
                  colorMode === 'dark'
                    ? useBaseUrl('/home/code2.png')
                    : useBaseUrl('/home/code1.png')
                }
                className="code"
                alt="QuickStart DataStream"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

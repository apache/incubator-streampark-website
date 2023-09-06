import React from 'react'

import useIsBrowser from '@docusaurus/useIsBrowser'
import config from './languages.json'
import Dashboard from "../../../static/home/dashboard.svg"
import Top1 from "../../../static/home/top1.svg"
import Top2 from "../../../static/home/top2.svg"
export default function () {
  const isBrowser = useIsBrowser();
  const language = isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en'
  const dataSource = config?.[language];

  return (
    <>
      <div className='overflow-hidden'>
        <Top1 />
      </div>
      <div className="section pb-9 overflow-hidden">
        {/* background overlay */}
        <div className="overlay opacity-90 z-index-n1"></div>

        <div className="container-fluid px-7 pb-2">
          <div className="row justify-content-center">
            <div className="col-md-6  col-8 align-self-center pe-5" data-aos="fade-right">
              <div className="text-start mt-0">
                <div className="mb-5 system_info pt-0">
                  <div className=" fw-bold mb-3">
                    <div className="d-flex flex-column align-items-start">
                      <div className='text-right' style={{ width: '100%' }}>
                        <span className="badge bg-secondary-home fs-6 tag">Incubating</span>
                      </div>
                      <span className='project_title'>Apache StreamPark</span>
                    </div>
                  </div>
                  <p className="lead" style={{ lineHeight: '40px' }}>{dataSource.slogan.description}</p>
                </div>
                <a className="btn streampark-btn btn mt-30 ztop" href="https://github.com/apache/incubator-streampark"
                  target="_blank">
                  <i className="lni-github-original"></i>&nbsp;GitHub
                </a>
                <a className="btn streampark-btn btn-green mt-30 ml-3 ztop" href="/docs/user-guide/quick-start"
                  style={{ marginLeft: '10px' }}>
                  <i className="lni-play"></i>&nbsp;Get started
                </a>
                <div style={{ marginTop: '20px' }} className="shields ztop">
                  <a href="https://www.apache.org/licenses/LICENSE-2.0.html">
                    <img src="https://img.shields.io/badge/license-Apache%202-4EB1BA.svg" className="wow fadeInUp"></img>
                  </a>
                  <img src="https://img.shields.io/github/stars/apache/incubator-streampark.svg?sanitize=true" className="wow fadeInUp"></img>
                  <img src="https://img.shields.io/github/forks/apache/incubator-streampark.svg?sanitize=true" className="wow fadeInUp"></img>
                  <img src="https://img.shields.io/github/languages/count/apache/incubator-streampark" className="wow fadeInUp"></img>
                </div>
              </div>
            </div>
            {/* hero image */}
            <div className="col-6 align-self-center" >
              <div className="mt-5 mt-2 text-right" data-aos="fade-up" data-aos-delay="100">
                <Dashboard className="img-fluid" style={{ transform: 'translateY(4rem)' }} />
              </div>
            </div>
          </div>
        </div >
        <div className='pt-6'>
          <Top2 />
        </div>

      </div >
    </>
  );
}

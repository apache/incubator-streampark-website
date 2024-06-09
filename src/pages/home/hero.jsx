import React from "react";

import { useWindowSize } from '@docusaurus/theme-common'
import useIsBrowser from "@docusaurus/useIsBrowser";
import config from "./languages.json";
import Dashboard from "../../../static/home/dashboard.svg";
import Top1 from "../../../static/home/top1.svg";
import Top2 from "../../../static/home/top2.svg";
import Screenshot from "./screenshot";
import clsx from "clsx";

export default function () {
  const isBrowser = useIsBrowser();
  const language =
    isBrowser && location.pathname.indexOf("/zh-CN/") === 0 ? "zh-CN" : "en";
  const dataSource = config?.[language];

  return (
    <>
      <div className="overflow-hidden">
        <Top1 className="top1" />
      </div>
      <div className="section hero-main pt-4 pb-2 overflow-hidden main-page">
        {/* background overlay */}
        <div className="overlay opacity-90 z-index-n1"></div>
        <div className="container-fluid pb-2 cover-container container-hero hero-px">
          <div className="row justify-content-center">
            <div
                className="col-10 col-sm-10 col-md-10 col-lg-6 align-self-center pe-0"
                data-aos="fade-right"
            >
              <div className="text-start mt-0">
                <div className="mb-5 system_info pt-0">
                  <div className="fw-bold mb-3">
                    <div
                        className="d-flex flex-column align-items-start"
                        style={{width: "max-content"}}
                    >
                      <div className="text-right" style={{width: "100%"}}>
                        <span className="badge incubating fs-6 tag">
                          Incubating
                        </span>
                      </div>
                      <span className="project_title">Apache StreamPark™</span>
                    </div>
                  </div>
                  <p className="desc lead">
                    {dataSource.slogan.description}
                  </p>
                </div>
                <a className="btn streampark-btn btn mt-30 ztop" href="https://github.com/apache/incubator-streampark"
                   target="_blank">
                  <i className="lni-github-original"></i>&nbsp;GitHub
                </a>
                <a className="btn streampark-btn btn-green mt-30 ml-3 ztop" href="/docs/user-guide/quick-start"
                   style={{marginLeft: '10px'}}>
                  <i className="lni-play"></i>&nbsp;Get started
                </a>
                <div style={{marginTop: '20px'}} className="shields ztop">
                  <img src="https://img.shields.io/github/stars/apache/incubator-streampark.svg?style=for-the-badge"
                       className="wow fadeInUp"></img>
                  <img src="https://img.shields.io/github/forks/apache/incubator-streampark.svg?style=for-the-badge"
                       className="wow fadeInUp"></img>
                  <img src="https://img.shields.io/github/downloads/apache/streampark/total.svg?style=for-the-badge"
                       className="wow fadeInUp"></img>
                </div>
              </div>
            </div>
            {/* hero image */}
            {HeroImage()}
          </div>
        </div>
        <div className='pt-6 pt-6 cover-top'>
          <Top2 className="top2"/>
        </div>
      </div>
    </>
  );
}

function HeroImage() {
  const windowSize = useWindowSize()
  if (windowSize === 'mobile') {
    return null
  }
  return (
    <div className="col-6 pt-6 align-self-center">
      <div
        className="text-right"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <Dashboard
          className="img-fluid"
        />
      </div>
    </div>
  );
}


function Button({ href, theme = "primary", icon, children, className, ...props }) {
  return (
    <a
      className={clsx("btn streampark-btn ztop", `btn-${theme}`, className)}
      href={href}
      {...props}
    >
      {typeof icon === 'string' ? <i className={clsx(icon, 'mr-2')} /> : icon}
      {children}
    </a>
  )
}

function AchievementBanner() {
  const formatNumber = (num) => {
    if (num < 1000) {
      return num
    } else if (num < 1000_000) {
      return (num / 1000).toFixed(1) + 'k+'
    } else {
      return (num / 1000_000).toFixed(1) + 'm+'
    }
  }

  const numberIncrementAnimation = (end = 0, { start = 0, duration = 1000, rate = 50, callback } = {}) => {
    const step = (end - start) / duration * rate
    let current = start
    const timer = setInterval(() => {
      current += parseInt(step.toFixed(0));
      if (current >= end) {
        clearInterval(timer)
        current = end
      }
      callback(current)
    }, rate)
    if (typeof callback === 'function') {
      callback(current)
    }
    return current
  }

  const [counter, setCounter] = React.useState({
    stars: 3710,
    forks: 963,
    downloads: 9900
  })

  React.useEffect(() => {
    numberIncrementAnimation(3710, {
      callback: (current) => {
        setCounter(state => ({
          ...state,
          stars: current
        }))
      }
    })
    numberIncrementAnimation(963, {
      callback: (current) => {
        setCounter(state => ({
          ...state,
          forks: current
        }))
      }
    })
    numberIncrementAnimation(9900, {
      callback: (current) => {
        setCounter(state => ({
          ...state,
          downloads: current
        })
        )
      }
    })
  }, [])

  // FIXME: 需要解决 github api 请求速率限制的问题
  /* React.useEffect(() => {
    fetch('https://api.github.com/repos/apache/incubator-streampark')
      .then(res => res.json())
      .then(data => {
        setCounter(state => ({
          ...state,
          stars: data.stargazers_count,
          forks: data.forks_count,
        }))
      })
    fetch('https://api.github.com/repos/apache/incubator-streampark/releases')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        let totalDownloads = 0;
        for (let i = 0; i < data.length; ++i) {
          for (let j = 0; j < data[i].assets.length; ++j) {
            totalDownloads += data[i].assets[j].download_count;
          }
        }

        setCounter(state => ({
          ...state,
          downloads: totalDownloads
        }))
      })
  }, []) */

  return (
    <section className="achievement-banner">
      <div className="achievement-banner-item">
        <div className="achievement-banner-item__highlight">
          {formatNumber(counter.stars)}
        </div>
        <div>Github stars</div>
      </div>
      <div className="achievement-banner-item">
        <div className="achievement-banner-item__highlight">
          {formatNumber(counter.forks)}
        </div>
        <div>Github forks</div>
      </div>
      <div className="achievement-banner-item">
        <div className="achievement-banner-item__highlight">
          {formatNumber(counter.downloads)}
        </div>
        <div>Total downloads</div>
      </div>
    </section>
  );
}

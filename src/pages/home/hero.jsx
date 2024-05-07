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
      <div className="section hero-main pb-6 overflow-hidden main-page">
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
                      style={{ width: "max-content" }}
                    >
                      <div className="text-right" style={{ width: "100%" }}>
                        <span className="badge incubating fs-6 tag">
                          Incubating
                        </span>
                      </div>
                      <span className="project_title">Apache StreamPark</span>
                    </div>
                  </div>
                  <p className="desc lead">
                    {dataSource.slogan.description}
                  </p>
                </div>
                {/* <a
                  className="btn streampark-btn btn-github ztop"
                  href="https://github.com/apache/incubator-streampark"
                  target="_blank"
                >
                  <i className="lni-github-original !text-lg"></i>&nbsp;GitHub
                </a> */}
                {/* <a
                  className="btn streampark-btn btn ml-3 ztop"
                  href="/docs/user-guide/quick-start"
                  style={{ marginLeft: "10px" }}
                >
                  <i className="lni-play"></i>&nbsp;Get started
                </a> */}
                <div>
                  <Button
                    theme="github"
                    icon="lni-github-original"
                    href="https://github.com/apache/incubator-streampark"
                    target="_blank"
                  >
                    Github
                  </Button>
                  <Button
                    theme="primary"
                    icon="lni-play"
                    href="/docs/user-guide/quick-start"
                    style={{ marginLeft: "10px" }}
                  >
                    Get started
                  </Button>
                </div>

                {/* <div style={{ marginTop: "20px" }} className="shields ztop">
                  <img
                    src="https://img.shields.io/github/stars/apache/incubator-streampark.svg?sanitize=true"
                    className="wow fadeInUp"
                  ></img>
                  <img
                    src="https://img.shields.io/github/forks/apache/incubator-streampark.svg?sanitize=true"
                    className="wow fadeInUp"
                  ></img>
                  <img
                    src="https://img.shields.io/github/downloads/apache/streampark/total.svg"
                    className="wow fadeInUp"
                  ></img>
                </div> */}
              </div>
            </div>
            {/* hero image */}
            {HeroImage()}

            <section className="achievement-banner">
              <div className="achievement-banner-item">
                <div className="achievement-banner-item__highlight">3.7k+</div>
                <div>Github stars</div>
              </div>
              <div className="achievement-banner-item">
                <div className="achievement-banner-item__highlight">964</div>
                <div>Github forks</div>
              </div>
              <div className="achievement-banner-item">
                <div className="achievement-banner-item__highlight">9.9k+</div>
                <div>Total downloads</div>
              </div>
            </section>
          </div>

        </div>
        {/* <section className="achievement-banner-wrapper">
          <div className="achievement-banner">
            <div className="achievement-banner-item">
              <div className="achievement-banner-item__highlight">3.7k+</div>
              <div>Github stars</div>
            </div>
            <div className="achievement-banner-item">
              <div className="achievement-banner-item__highlight">964</div>
              <div>Github forks</div>
            </div>
            <div className="achievement-banner-item">
              <div className="achievement-banner-item__highlight">9.9k+</div>
              <div>Total downloads</div>
            </div>
          </div>
        </section> */}

        {/* <div className="pt-6 cover-top">
          <Top2 className="top2" />
        </div> */}
        {/* <StreamWave /> */}
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
    <div className="col-6 align-self-center">
      <div
        className="text-right"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <Dashboard
          className="img-fluid"
          style={{ transform: "translateY(4rem)" }}
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
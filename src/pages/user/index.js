import React, { useRef } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import useBaseUrl from '@docusaurus/useBaseUrl';
import BrowserOnly from '@docusaurus/BrowserOnly';
import config from './languages';
import './index.less';
import img from './images';
import Layout from '@theme/Layout';

export default function () {
  const isBrowser = useIsBrowser();
  const language = isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en';
  const dataSource = config?.[language];

  const carousel = useRef(null)

  return <BrowserOnly  fallback={<div id="preloader"></div>}>
    {
      () => {
        const Carousel = require("react-tiny-slider").default
        return <Layout>
          <div className='block user_page'>
            <div className="user-main" style={{ padding: "10px 0 30px" }}>
              <h3 className="fs-1 mb-4 fw-bold text-center">{dataSource.common.ourUsers}</h3>
              <div className="desc" dangerouslySetInnerHTML={{ __html: dataSource.common.tip }}>
              </div>
              <section className="md my-6 pt-0">
                <div className="container">
                  <Carousel
                    autoplay
                    swipeAngle={false}
                    items={5}
                    center
                    mouseDrag
                    ref={carousel}
                    controls={false}
                    autoplayHoverPause
                    autoplayTimeout={4500}
                    autoplayButtonOutput={false}
                    gutter={50}
                    nav={false}
                  >
                    {img.map((item, i) => {
                      return <div className="slide-item text-center" key={i}>
                        <img src={`/user/${item.url}`} alt="user" />
                      </div>
                    })}
                  </Carousel>

                </div>
              </section>
            </div>
          </div>
        </Layout>
      }
    }
  </BrowserOnly>



}

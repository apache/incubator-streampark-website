import React, { useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useIsBrowser from '@docusaurus/useIsBrowser';
import useBaseUrl from '@docusaurus/useBaseUrl';
import config from './languages';
import './index.less';
import img from './images';
import Layout from '@theme/Layout';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function () {
  const isBrowser = useIsBrowser();
  const language = isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en';
  const dataSource = config?.[language];

  return <BrowserOnly>
    {() => {
      // AOS JS
      AOS.init({
        offset: 100,
        duration: 700,
        easing: "ease-out-quad",
        once: !0
      });
      window.addEventListener('load', AOS.refresh);
      return <Layout>
        <div className='block user_page'>
          <div className="user-main" style={{ padding: "10px 0 30px" }}>
            <h3 className="fs-2 mb-4 fw-bold text-center">{dataSource.common.ourUsers}</h3>
            <hr className="divider my-4 mx-auto" style={{ maxWidth: "10rem" }}></hr>
            <div className="desc" dangerouslySetInnerHTML={{ __html: dataSource.common.tip }}>
            </div>
            <div className="user_case home_block">
              {
                img.map((item, i) => (
                  <div key={i} index={i} data-aos="fade-up" data-aos-delay={i * 100}>
                    <div className="case_item case_hover" >
                      <img src={useBaseUrl('/user/' + item.url)} alt="name" />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </Layout>
    }}
  </BrowserOnly>



}

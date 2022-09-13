import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useIsBrowser from '@docusaurus/useIsBrowser';
import config from "./languages.json";
import Layout from '@theme/Layout';
import './index.less';
import Github from "./github.svg"
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function () {
  const isBrowser = useIsBrowser();
  const language = isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en';
  const dataSource = config?.[language];
  return (
    <BrowserOnly>
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
          <div className="block team_page" style={{ padding: "10px 0 30px" }}>
            <h3 className="fs-2 mb-4 fw-bold text-center">StreamPark Team</h3>
            <hr className="divider my-4 mx-auto" style={{ maxWidth: "10rem" }}></hr>
            <p className="team_desc team_indent">{dataSource.info.desc}</p>
            <h3 className="team_title mb-5">
              Mentor
              <span className="desc">{dataSource.info.tip}</span>
            </h3>
            <div className="row bg-gray py-4">
              {
                dataSource.mentor.map((item, i) => (
                  <div className="team_user mb-5 px-4" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                    <a href={item.gitUrl} target="_blank">
                      <div className="team team-hover rounded">
                        <div className="team-img">
                          <img src={item.avatarUrl} alt={item.name} />
                        </div>
                        <div className="team-info">
                          <span className="team-name text-dark">{item.name}</span>
                          <p className="team-leader d-flex align-items-center justify-content-center">
                            <Github className="github-icon" />
                            {item.name}
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                ))
              }
            </div>

            <h3 className="team_title mb-5">
              PPMC
              <span className="desc">{dataSource.info.tip}</span>
            </h3>
            <div className="row bg-gray py-4">
              {
                dataSource.PPMC.map((item, i) => (
                    <div className="team_user mb-5 px-4" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                      <a href={item.gitUrl} target="_blank">
                        <div className="team team-hover rounded">
                          <div className="team-img">
                            <img src={item.avatarUrl} alt={item.name} />
                          </div>
                          <div className="team-info">
                            <span className="team-name text-dark">{item.name}</span>
                            <p className="team-leader d-flex align-items-center justify-content-center">
                              <Github className="github-icon" />
                              {item.name}
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                ))
              }
            </div>

          </div>
        </Layout>;
      }}

    </BrowserOnly>

  );
}

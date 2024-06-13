import React from 'react'
import useIsBrowser from '@docusaurus/useIsBrowser'
import config from './languages.json'

export default function () {
  const isBrowser = useIsBrowser();
  const language = isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en'
  const dataSource = config?.[language];
  return (
    <div className="section feature">
      <div className="container">
        <div className="row text-center">
          <div className="col-12">
            <div className="mb-5 pt-6">
              <h2 className="article-title h3 fw-bold">{dataSource.common.coreFeatures}</h2>
              <hr className="divider my-4" />
              <p className="lead desc">{dataSource.common.coreFeaturesDesc}</p>
            </div>
          </div>
        </div>
        <div className='row justify-content-center'>
          {
            dataSource.feature.map((feature, i) => (
              <div className="characteristic-card col-md-4 col-6 px-4 px-md-3 cursor-pointer" key={i} data-aos="fade-up" data-aos-delay={(i % 3) * 100}>
                <div className="feature-children p-4 pt-5 mb-5 shadow-md hover-box-up">
                  <div className="text-primary text-center mb-3">
                    <div className="features-icon"><i className={feature.icon}></i></div>
                  </div>
                  <h3 className="h5 text-left feature-title">{feature.title}</h3>
                  <p>{feature.details}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

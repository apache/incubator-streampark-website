import React from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import useBaseUrl from '@docusaurus/useBaseUrl';
import config from './languages.json';
import './index.less';

export default function () {
    const isBrowser = useIsBrowser();
    const language = isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en';
    const dataSource = config?.[language];

    return (
        <section className="coverpage">
            <section className="hero-barishal welcome_area">

                <div className="background-shapes">
                    <div className="box1"></div>
                    <div className="box2"></div>
                    <div className="box3"></div>
                    <div className="dot1"></div>
                    <div className="dot2"></div>
                    <div className="dot3"></div>
                    <div className="dot4"></div>
                    <div className="heart1"><i className="lni-heart"></i></div>
                    <div className="heart2"><i className="i lni-heart"></i></div>
                    <div className="circle1"></div>
                    <div className="circle2"></div>
                </div>

                <div className="container h-100">
                    <div className="row h-100 justify-content-between align-items-center">
                        <div className="col-12 col-md-6">
                            <div className="welcome_text_area">
                                <h2 className="wow fadeInUp" data-wow-delay="0.2s" style={{marginBottom: '30px'}}>
                                    <span>StreamX ──</span><br/>
                                    <span>{dataSource.slogan.key1}<br/>{dataSource.slogan.key2}</span>
                                </h2>
                                <h5 className="wow fadeInUp" data-wow-delay="0.3s" style={{color: '#6c7a87',fontWeight: 600}}>
                                    {dataSource.slogan.description}
                                </h5>
                                <a className="btn streamx-btn btn mt-30" href="https://github.com/streamxhub/streamx"
                                   target="_blank">
                                    <i className="lni-github-original"></i>&nbsp;GitHub
                                </a>
                                <a className="btn streamx-btn btn-purple mt-30 ml-2"
                                   href="https://gitee.com/streamxhub/streamx" target="_blank"
                                   style={{marginLeft: '15px'}}>
                                    <img src={useBaseUrl('/home/gitee.png')} className="icon-gitee"></img>&nbsp;Gitee
                                </a>
                                <a className="btn streamx-btn btn-green mt-30 ml-2" href="../../../zh/doc/guide/intro/"
                                   style={{marginLeft: '15px'}}>
                                    <i className="lni-play"></i>&nbsp;Start
                                </a>
                                <div style={{marginTop: '20px'}} className="shields">
                                    <a href="https://www.apache.org/licenses/LICENSE-2.0.html">
                                        <img src="https://img.shields.io/badge/license-Apache%202-4EB1BA.svg" className="wow fadeInUp"></img>
                                    </a>
                                    <img src="https://img.shields.io/github/stars/streamxhub/streamx.svg?sanitize=true" className="wow fadeInUp"></img>
                                    <img src="https://img.shields.io/github/forks/streamxhub/streamx.svg?sanitize=true" className="wow fadeInUp"></img>
                                    <img src="https://img.shields.io/github/languages/count/streamxhub/streamx" className="wow fadeInUp"></img>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="welcome_area_thumb text-center" data-wow-delay="0.2s">
                                <a href="https://gitee.com/gvp" target="_blank">
                                    <img src={useBaseUrl('/home/gvp2021.png')} alt="StreamX GVP"></img>
                                </a>
                                <a className="video_btn video-btn" style={{display: 'none'}}
                                   href="http://assets.streamxhub.com/streamx-video.mp4" data-wow-delay="0.5s">
                                    <i className="lni-play"></i>
                                    <span className="video-sonar"></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="using_benefits_area" id="benefits" style={{backgroundColor: '#F6FAFE', paddingBottom: "100px"}}>

                <div className="mask-bg"></div>

                <div className="container" style={{paddingTop: "20px"}}>
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-8 col-lg-6">
                            <div className="section_heading white text-center wow fadeInUp" data-wow-delay="0.2s">
                                <h3>{dataSource.common.coreFeatures}</h3>
                                <div className="line"></div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {
                            dataSource.feature.map((feature, i) => (
                                <div className="col-12 col-sm-6 col-lg-4 cour-function" key={i} index={i}>
                                    <div className="feature-item">
                                        <div className="single_benifits d-flex wow fadeInUp" data-wow-delay="200ms">
                                            <div className="icon_box"><i className={feature.icon}></i></div>
                                            <div className="benifits_text">
                                                <h5>{feature.title}</h5>
                                                <p>{feature.details}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>

            <section className="showcode_area" id="showcode">
                <div className="container" style = {{marginTop: '90px',marginBottom: '40px' }}>
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-8 col-lg-6">
                            <div className="section_heading text-center wow fadeInUp" data-wow-delay="0.2s"
                                 style= {{ marginBottom: '15px'}}>
                                <h3>{dataSource.common.scaffold}</h3>
                                <div className="line"></div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-between" style= {{ padding:'50px 0'}}>
                        {
                            dataSource.scaffold.map((item, i) => (
                                <div className="col-12 col-sm-4 col-md-3" key={i} index={i}>
                                    <div className={i == 2 ? "single_work_step single_work_step_last":"single_work_step"}>
                                        <div className="step-icon shadow"><i className={item.icon}></i></div>
                                        <h5>{item.title}</h5>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className="row h-100 justify-content-between align-items-center">
                        <div className="col-12 col-md-6">
                            <div className="code-container" style= {{ height: '350px'}}>
                                <img src={useBaseUrl('/home/code.png')} width="90%"></img>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="welcome_area_thumb text-center" data-wow-delay="0.2s">
                                <img src={useBaseUrl('/home/code.svg')}  alt=""></img>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </section>
    );
}

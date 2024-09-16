import React, { useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useIsBrowser from '@docusaurus/useIsBrowser';
import useBaseUrl from '@docusaurus/useBaseUrl';
import config from './languages';
import './index.less';
import images from './images';
import Layout from '@theme/Layout';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useColorMode } from '@docusaurus/theme-common';
import SectionTitle from '@site/src/components/SectionTitle';

export default function () {
  const isBrowser = useIsBrowser();
  const language =
    isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en';
  const dataSource = config?.[language];

  return (
    <Layout>
      <BrowserOnly>
        {() => {
          // AOS JS
          AOS.init({
            offset: 80,
            duration: 500,
            easing: 'ease-out-quad',
            once: !0,
          });

          window.addEventListener('load', AOS.refresh);

          // const { colorMode } = useColorMode();

          return (
            <div className="block user_page container">
              <div className="user-main" style={{ padding: '10px 0 30px' }}>
                <h1 className="fs-2 mb-4 fw-bold text-center">
                  {dataSource.common.ourUsers}
                </h1>
                <hr
                  className="divider my-4 mx-auto"
                  style={{ maxWidth: '10rem' }}
                ></hr>
                <div
                  className="desc"
                  dangerouslySetInnerHTML={{ __html: dataSource.common.tip }}
                ></div>
                <div className="user_case home_block">
                  <div className="bg-shadow-bubble"></div>
                  {images.map((img, i) => (
                    <BrandCard img={img} aosDelay={i * 50} key={i} />
                  ))}
                </div>
              </div>
            </div>
          );
        }}
      </BrowserOnly>
    </Layout>
  );
}

interface BrandCardProps {
  img: { imgUrl: string; linkid: string };
  aosDelay: number;
}

function BrandCard({ img, aosDelay }: BrandCardProps) {
  const { colorMode } = useColorMode();

  const [imgUrl, setImgUrl] = React.useState<string>();

  React.useEffect(() => {
    setImgUrl(
      colorMode === 'dark'
        ? '/home/brands/plain/' + img.imgUrl
        : '/home/brands/colorful/' + img.imgUrl,
    );
  }, [colorMode]);

  function handleMouseEnter() {
    setImgUrl(`/home/brands/plain/${img.imgUrl}`);
  }

  function handleMouseLevel() {
    const dir = colorMode === 'dark' ? 'plain' : 'colorful';
    setImgUrl(`/home/brands/${dir}/${img.imgUrl}`);
  }

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={aosDelay}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLevel}
    >
      <a
        href={'https://github.com/apache/incubator-streampark/issues/163#issuecomment-'.concat(
          img.linkid,
        )}
        target="_blank"
      >
        <div className="case_item case_hover">
          <img src={useBaseUrl(imgUrl)} alt={img.imgUrl} />
        </div>
      </a>
    </div>
  );
}

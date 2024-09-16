import React, { useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode, useThemeConfig } from '@docusaurus/theme-common';
import config from './languages.json';
// import images from './images.json';
import row1 from './row1.json';
import row2 from './row2.json';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Marquee from 'react-fast-marquee';
import styles from './styles.module.css';
import RightArrowIcon from '@site/static/icons/arrow-right.svg';
import { useTranslation } from '@site/src/hooks/useTranslation';

export default function TrustedUsers() {
  const { t, language } = useTranslation(config);

  const { colorMode } = useColorMode();

  // const row1 = images.slice(0, images.length / 2);
  // const row2 = images.slice(images.length / 2);

  const gradientColor = colorMode === 'dark' ? '#1f1f1c' : '#fff';

  return (
    <BrowserOnly>
      {() => (
        <section className={styles['trusted-users']}>
          {/* <h3 className={styles['title']}>{ t.users.title }</h3>
          <hr
            className="divider my-4 mx-auto"
            style={{ maxWidth: '10rem' }}
          /> */}
          <div data-aos="slide-left">
            <Marquee
              direction="left"
              speed={30}
              pauseOnHover
              gradient
              gradientWidth="10%"
              gradientColor={gradientColor}
              className={styles['carousel-container']}
              style={{ marginTop: 40 }}
            >
              {row1.map((img, i) => (
                <div className={styles['swiper-item']}>
                  <img
                    src={
                      colorMode === 'dark'
                        ? useBaseUrl('/home/brands/plain/' + img.imgUrl)
                        : useBaseUrl('/home/brands/colorful/' + img.imgUrl)
                    }
                    alt={img.imgUrl}
                  />
                </div>
              ))}
            </Marquee>
          </div>

          <div data-aos="slide-right">
            <Marquee
              direction="right"
              speed={30}
              gradient
              gradientWidth="10%"
              gradientColor={gradientColor}
              pauseOnHover
              className={styles['carousel-container']}
              style={{ marginTop: 16 }}
            >
              {row2.map((img, i) => (
                <div className={styles['swiper-item']}>
                  <img
                    src={
                      colorMode === 'dark'
                        ? useBaseUrl('/home/brands/plain/' + img.imgUrl)
                        : useBaseUrl('/home/brands/colorful/' + img.imgUrl)
                    }
                    alt={img.imgUrl}
                  />
                </div>
              ))}
            </Marquee>
          </div>

          <div className={styles['more-link']}>
            <a
              href={language === 'zh-CN' ? '/zh-CN/user' : '/user'}
              className={styles['more-link-btn']}
            >
              {t.users.more}
              <RightArrowIcon className={styles['more-link-icon']} />
            </a>
          </div>
        </section>
      )}
    </BrowserOnly>
  );
}

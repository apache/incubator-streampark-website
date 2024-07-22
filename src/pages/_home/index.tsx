import React, { useEffect } from 'react';
import AOS from 'aos';

import Hero from './hero';
import Feature from './feature';
import Performance from './performance';
import TrustUsers from './_users';

import 'aos/dist/aos.css';
import './theme.less';
import './index.less';

export default function HomePage() {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 700,
      easing: 'ease-out-quad',
      once: !0,
    });
    window.addEventListener('load', AOS.refresh);
  
    return () => {
      window.removeEventListener('load', AOS.refresh);
    };
  }, []);

  return (
    <div className="home-wrap overflow-hidden">
      <Hero />
      <TrustUsers />
      <Feature />
      <Performance />
    </div>
  );
}

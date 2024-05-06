import React from 'react';
import FooterCopyright from '@theme/Footer/Copyright';
import { useThemeConfig } from '@docusaurus/theme-common';
import FooterLinks from '@theme/Footer/Links';
import FooterLogo from '@theme/Footer/Logo';
import FooterLayout from './Layout/index';
import { useLocation } from '@docusaurus/router';

function Footer(): JSX.Element | null {
  const { footer } = useThemeConfig();
  if (!footer) {
    return null;
  }
  const { copyright, links, logo, style } = footer;

  const location = useLocation()

  const noFooterRoute = []
  const isNoFooter = noFooterRoute.some(r => {
    return location.pathname.startsWith(r)
  })
  if (isNoFooter) {
    return null
  }

  return (
    <FooterLayout
      style={style}
      links={links && links.length > 0 && <FooterLinks links={links} />}
      logo={logo && <FooterLogo logo={logo} />}
      copyright={copyright && <FooterCopyright copyright={copyright} />}
    />
  );
}

export default React.memo(Footer);
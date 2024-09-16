import React from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import config from './languages.json';
import FeatureCard from '@site/src/components/FeatureCard';
import SectionTitle from '@site/src/components/SectionTitle';
import { useTranslation } from '@site/src/hooks/useTranslation';

export default function CoreFeatures() {
  const { t, language } = useTranslation(config);

  return (
    <section className="section feature">
      <div className="container">
        <SectionTitle
          title={t.common.coreFeatures}
          description={t.common.coreFeaturesDesc}
        />
        <div className="row justify-content-center">
          {t.feature.map((feature, i) => (
            <FeatureCard
              key={i}
              title={feature.title}
              icon={feature.icon}
              content={feature.details}
              animationDelay={(i % 3) * 100}
              className="col-md-4 col-6 px-4 px-md-3 hover-box-up"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

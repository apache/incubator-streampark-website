import React from 'react';
import clsx from 'clsx';
import styles from './style.module.css';

interface TitleProps {
  className?: string;
  style?: React.CSSProperties;
  title: React.ReactNode;
  description: React.ReactNode;
}

export default function SectionTitle(props: TitleProps) {
  return (
    <div className="text-center">
      <div className="col-12">
        <div className="mb-5 pt-6">
          <h2 className="article-title text-lg lg:text-2xl font-semibold">
            {props.title}
          </h2>
          <hr className={clsx(styles['divider'], 'my-4')} />
          <p className="text-base">{props.description}</p>
        </div>
      </div>
    </div>
  );
}

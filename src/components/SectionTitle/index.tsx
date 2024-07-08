import React from 'react';
import clsx from 'clsx';

interface TitleProps {
  className?: string;
  style?: React.CSSProperties;
  title: React.ReactNode;
  description: React.ReactNode;
}

export default function Index(props: TitleProps) {
  return (
    <div className="row text-center">
      <div className="col-12">
        <div className="mb-5 pt-6">
          <h2 className="article-title h3 fw-bold">
            {props.title}
          </h2>
          <hr className="divider my-4" />
          <p className="lead desc">{props.description}</p>
        </div>
      </div>
    </div>
  );
}

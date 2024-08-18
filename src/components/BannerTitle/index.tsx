import React from 'react';
import clsx from 'clsx';

interface BannerProps {
  className?: string;
}

export default function BannerTitle({
  title = 'Apache StreamPark™',
  subTitle = 'Make stream processing easier! Easy-to-use streaming application development framework and operation platform, with Apache Flink® and Apache Spark™ supported, provides full lifecycle support for stream processing applications.',
}) {
  return (
    <div
      className={'md:px-16 py-8 text-center h-auto bg-shadow-element'}
      data-aos="fade-right"
    >
      <h1 className="mt-10 text-2xl xs:text-xl md:text-4xl lg:text-6xl font-bold relative inline-block text-black dark:text-white">
        Apache StreamPark™
        <span className="project-badge absolute text-xs right-[1.5em] md:right-[2em] lg:right-[3em] -top-5 lg:text-sm px-3 leading-5 bg-blue-100 text-blue-800 rounded-full rounded-bl-none font-medium">
          Incubating
        </span>
      </h1>
      <p className="lg:text-base mt-6 text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400">
        {subTitle}
      </p>
    </div>
  )
}
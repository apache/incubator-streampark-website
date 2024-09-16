import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Index(props: ButtonProps) {
  return (
    <a
      href="https://github.com/apache/incubator-streampark"
      className="text-white font-semibold h-10 px-6 rounded-lg text-center flex-center bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50  sm:w-auto dark:bg-black dark:highlight-white/20 dark:hover:bg-gray-900 hover:no-underline cursor-pointer"
    >
      {props.children}
    </a>
  );
}

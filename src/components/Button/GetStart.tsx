import React from 'react';
import clsx from 'clsx';
import './styles.less';

interface GetStartButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function GetStartButton(props: GetStartButtonProps) {
  return (
    <a
      href="/docs/get-started/intro"
      className="bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-50 text-white font-semibold h-10 px-6 rounded-lg flex-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400 start-button hover:no-underline cursor-pointer"
    >
      {props.children}
    </a>
  );
}

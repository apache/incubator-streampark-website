import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  return (
    <button className="text-white font-semibold h-10 px-6 rounded-lg text-center bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50  sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400">
      {props.children}
    </button>
  );
}

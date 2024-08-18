import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import CopyIcon from '@site/static/icons/copy.svg';
import CheckedIcon from '@site/static/icons/checked.svg';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  command: string;
}

export default function ShellCommand({ className, style, command }: Props) {
  const [copied, setCopied] = useState(false);

  function copyCommand() {
    if (copied) return;
    window.navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={clsx(styles['shell-command-block'], className)}
      style={style}
    >
      {Highlighter(command)}
      <button className={styles['copy-icon']} onClick={copyCommand}>
        {copied ? <CheckedIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

// Implement simpy command highlighting
function Highlighter(command: string): React.ReactNode {
  const tokens = command.split(' ');

  const KNOWN_COMMAND = ['curl', 'sh'];

  const rules: Record<string, (token: string, index: number) => boolean> = {
    'code-cmd': (token, index) => index === 0 || KNOWN_COMMAND.includes(token),
    'code-opt': (token, index) => token.startsWith('-'),
    'code-opr': (token, index) => /\|+|&+|>+/.test(token),
  };

  function getCodeStyleName(token, index): string {
    for (const key in rules) {
      const matched = rules[key](token, index);
      if (matched) return key;
    }
  }

  return (
    <pre>
      <code key={'$'} className="select-none mr-1">
        $
      </code>
      {tokens.map((token, index) => {
        return (
          <code key={token} className={styles[getCodeStyleName(token, index)]}>
            {token}
            {index < tokens.length && ' '}
          </code>
        );
      })}
    </pre>
  );
}

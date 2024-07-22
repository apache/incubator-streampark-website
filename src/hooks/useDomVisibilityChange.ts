import { useEffect } from 'react';

export function useDOMVisibilityChange(
  dom: HTMLElement,
  options: {
    onChange?: (
      visible: boolean,
      entry: IntersectionObserverEntry,
      observer: IntersectionObserver,
    ) => void;
  },
) {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        options.onChange?.(entry.isIntersecting, entry, observer);
      });
    },
    {
      threshold: [0],
    },
  );

  useEffect(() => {
    if (!dom) return;
    console.log('dom: ', dom)
    observer.observe(dom);

    return () => {
      observer.disconnect();
    };
  });

  return observer;
}

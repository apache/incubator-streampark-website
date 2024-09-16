import { useEffect, useRef } from 'react';

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
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 检查 DOM 是否真的存在
    if (!dom) return;

    // 初始化 Observer
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          options.onChange?.(entry.isIntersecting, entry, observer);
        });
      },
      { threshold: [0] }
    );

    observer.observe(dom);
    observerRef.current = observer;

    // 清理函数
    return () => {
      observer.disconnect();
    };
    
  // 添加 dom 和 options.onChange 作为依赖项
  }, [dom, options.onChange]);

  return observerRef.current;
}

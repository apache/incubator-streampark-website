import useIsBrowser from '@docusaurus/useIsBrowser';

export function useTranslation<T extends object>(localeConfig: T) {
  const isBrowser = useIsBrowser();
  const language =
    isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en';
  const t = localeConfig?.[language];

  return { t, language };
}

import React from 'react';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
//@ts-ignore internal func
import { useBlogPost } from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/BlogPostItem/Container';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import "./style.less"

export default function BlogPostItemContainer({
  children,
  className,
}: Props): JSX.Element {
  const {
    frontMatter,
    assets,
    metadata: { description, date },
    isBlogPostPage
  } = useBlogPost();
  const { withBaseUrl } = useBaseUrlUtils();
  const image = assets.image ?? frontMatter.image;
  const keywords = frontMatter.keywords ?? [];
  const dateObj = new Date(date);
  // 当前语言
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext();

  const year = dateObj.getFullYear();
  let month = `${dateObj.getMonth() + 1}`;
  const day = dateObj.getDate();
  let dateStr = `${year}年${month}月`;

  if (currentLocale === "en") {
    month = dateObj.toLocaleString("default", { month: "long" });
    dateStr = `${month}, ${year}`;
  }

  return (
    <div className={`${!isBlogPostPage ? "blog-list--box" : ""}`}>
      <div
        className={`row ${!isBlogPostPage ? "blog-list--item" : ""}`}
        style={{ margin: 0 }}
      >
        {/* 列表页日期 */}
        {!isBlogPostPage && (
          <div className="post__date-container col col--3 padding-right--lg margin-bottom--lg">
            <div className="post__date">
              <div className="post__day">{day}</div>
              <div className="post__year_month">{dateStr}</div>
            </div>
            <div className="line__decor"></div>
          </div>
        )}
        <div className={`col ${isBlogPostPage ? `col--12 article__details article-bg` : `col--9`}`} >
          <article
            className={className}
            itemProp="blogPost"
            itemScope
            itemType="http://schema.org/BlogPosting">
            {description && <meta itemProp="description" content={description} />}
            {image && (
              <link itemProp="image" href={withBaseUrl(image, { absolute: true })} />
            )}
            {keywords.length > 0 && (
              <meta itemProp="keywords" content={keywords.join(',')} />
            )}
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}

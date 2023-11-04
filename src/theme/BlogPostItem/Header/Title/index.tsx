import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
//@ts-ignore internal func
import { useBlogPost } from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/BlogPostItem/Header/Title';

import styles from './styles.module.css';

export default function BlogPostItemHeaderTitle({
  className,
}: Props): JSX.Element {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { permalink, title } = metadata;
  const TitleHeading = isBlogPostPage ? 'h1' : 'h2';
  return (
    <TitleHeading
      className={clsx(
        isBlogPostPage ? "margin-bottom--md" : "margin-vert--md",
        styles.blogPostTitle,
        isBlogPostPage ? "text--center" : "",
        className,
        'post--titleLink'
      )}
      itemProp="headline">
      {isBlogPostPage ? (
        title
      ) : (
        <div className={styles.blogPostTitleLink}>
          <Link itemProp="url" to={permalink}>
            {title}
          </Link>
        </div>
      )}
    </TitleHeading>
  );
}

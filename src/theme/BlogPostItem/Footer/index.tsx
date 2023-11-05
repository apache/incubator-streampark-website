import React from 'react';
import clsx from 'clsx';
//@ts-ignore internal func
import { useBlogPost } from '@docusaurus/theme-common/internal';
import EditThisPage from '@theme/EditThisPage';
import ReadMoreLink from '@theme/BlogPostItem/Footer/ReadMoreLink';
import TagsListInline from '@theme/TagsListInline';

import styles from './styles.module.css';

export default function BlogPostItemFooter(): JSX.Element | null {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { tags, title, editUrl, hasTruncateMarker } = metadata;

  // A post is truncated if it's in the "list view" and it has a truncate marker
  const truncatedPost = !isBlogPostPage && hasTruncateMarker;

  const renderFooter = truncatedPost || editUrl;



  if (!renderFooter) {
    return null;
  }

  const BlogPostPageFooter = () => {
    if (!isBlogPostPage) return null
    const tagsExists = tags.length > 0;
    const footerDom = []
    if (tagsExists) {
      footerDom.push(
        <div className={clsx('col', { 'col--9': truncatedPost })} key={'tags'}>
          <TagsListInline tags={tags} />
        </div>
      )
    }
    if (editUrl) {
      footerDom.push(
        <div className="col col-3 text--right" key={'editUrl'}>
          <EditThisPage editUrl={editUrl} />
        </div>
      )
    }
    return footerDom
  }

  return (
    <footer
      className={clsx(
        'row docusaurus-mt-lg',
        isBlogPostPage && styles.blogPostFooterDetailsFull,
      )}>

      <div className='post-footer'>
        {BlogPostPageFooter()}
      </div>


      {truncatedPost && (
        <div
          className={clsx('col text--right')}>
          <ReadMoreLink blogPostTitle={title} to={metadata.permalink} />
        </div>
      )}
    </footer>
  );
}

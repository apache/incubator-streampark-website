import React from 'react';
//@ts-ignore internal func
import { useBlogPost } from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';

export default function BlogPostItemHeaderTitle(): JSX.Element {
  const { metadata, isBlogPostPage } = useBlogPost();

  const { tags,hasTruncateMarker } = metadata;
  if (isBlogPostPage || tags.length === 0) return null

  return (tags.length > 0 || hasTruncateMarker) && (
    <div className="post__tags-container margin-top--none margin-bottom--md">
      {tags.length > 0 && (
        <>
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tags" className="svg-inline--fa fa-tags margin-right--md" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" color="#c4d3e0">
            <path fill="currentColor" d="M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z"></path>
            </svg>
          {tags
            .slice(0, 4)
            .map(({ label, permalink: tagPermalink }, index) => (
              <Link
                key={tagPermalink}
                className={`post__tags ${index > 0 ? "margin-horiz--sm" : "margin-right--sm"
                  }`}
                to={tagPermalink}
                style={{ fontSize: "0.75em", fontWeight: 500 }}
              >
                {label}
              </Link>
            ))}
        </>
      )}
    </div>
  );
}

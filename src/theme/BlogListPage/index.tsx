import React from 'react';
import clsx from 'clsx';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type { Props } from '@theme/BlogListPage';
import BlogPostItems from '@theme/BlogPostItems';
import BlogPostLisView from '../BlogPostLisView';
import Translate from '@docusaurus/Translate';
import { useViewType } from './useViewType';
import ListFilter from "./img/list.svg";
import CardFilter from "./img/card.svg";

function BlogListPageMetadata(props: Props): JSX.Element {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}


function BlogHeaderContent() {
  return (
    <h1 className="blog__section_title" id="homepage_blogs">
      <Translate
        id="theme.blog.newerPost"
        description="latest blogs heading">
        Latest blog
      </Translate>
      &nbsp;
      <svg
        width="31"
        height="31"
        viewBox="0 0 31 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25.8333 5.16666H5.16668C3.73293 5.16666 2.59626 6.31624 2.59626 7.74999L2.58334 23.25C2.58334 24.6837 3.73293 25.8333 5.16668 25.8333H25.8333C27.2671 25.8333 28.4167 24.6837 28.4167 23.25V7.74999C28.4167 6.31624 27.2671 5.16666 25.8333 5.16666ZM10.9792 19.375H9.42918L6.13543 14.8542V19.375H4.52084V11.625H6.13543L9.36459 16.1458V11.625H10.9792V19.375ZM17.4375 13.2525H14.2083V14.6992H17.4375V16.3267H14.2083V17.7604H17.4375V19.375H12.2708V11.625H17.4375V13.2525ZM26.4792 18.0833C26.4792 18.7937 25.8979 19.375 25.1875 19.375H20.0208C19.3104 19.375 18.7292 18.7937 18.7292 18.0833V11.625H20.3438V17.4504H21.8033V12.9037H23.4179V17.4375H24.8646V11.625H26.4792V18.0833Z"
          className="newicon"
        />
      </svg>
    </h1>
  )
}
function BlogListPageContent(props: Props): JSX.Element {
  const { metadata, items } = props;
  const { viewType, toggleViewType } = useViewType();
  const isCardView = viewType === "card";
  const isListView = viewType === "list";
  return (
    <BlogLayout>
      <BlogHeaderContent />
      {/* switch list and card */}
      <div className="bloghome__swith-view">
        <CardFilter
          onClick={() => toggleViewType("card")}
          className={viewType === "card" ? "bloghome__switch--selected" : "bloghome__switch"}
        />
        <ListFilter
          onClick={() => toggleViewType("list")}
          className={viewType === "list" ? "bloghome__switch--selected" : "bloghome__switch"}
        />
      </div>
      <div className="bloghome__posts">
        {isCardView && (
          <div className="bloghome__posts-card">
            <BlogPostItems items={items} />
          </div>
        )}

        {isListView && (
            <BlogPostLisView items={items} />
        )}
        <BlogListPaginator metadata={metadata} />
      </div>



    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}

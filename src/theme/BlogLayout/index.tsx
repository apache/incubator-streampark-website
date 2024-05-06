import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar'
import type { Props } from '@theme/BlogLayout';
import './index.less';

export default function BlogLayout(props: Props): JSX.Element {
  const { sidebar, toc, children, ...layoutProps } = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  return (
    <Layout {...layoutProps}>
      <div className='container-wrapper blog-container'>
        <div className="container margin-vert--lg">
          <div className="row">
            <BlogSidebar sidebar={sidebar} />
            <main
              className={clsx('col', {
                'col--8 overflow-hidden': hasSidebar,
                'col--12': !hasSidebar,
              })}
              itemScope
              itemType="http://schema.org/Blog">
              {children}
            </main>
            {toc && <div className="col col--2">{toc}</div>}
          </div>
        </div>

      </div>
    </Layout >
  );
}

import Link from "@docusaurus/Link";
import React from "react";
import {  motion } from 'framer-motion'


const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}


export default function BlogPostLisView({ items }: any): JSX.Element {

  return (
    <motion.div
      className="bloghome__posts-list"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {
        items.map(({ content: BlogPostContent }, index) => {
          const { metadata: blogMetaData, frontMatter } = BlogPostContent;
          const { title } = frontMatter;
          const { permalink, date, tags } = blogMetaData;

          const dateObj = new Date(date);

          const year = dateObj.getFullYear();
          let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
          const day = ("0" + dateObj.getDate()).slice(-2);

          return (
            <React.Fragment key={blogMetaData.permalink}>
              <motion.div
                className="post__list-item"
                key={blogMetaData.permalink}
                variants={item}
              >

                <Link to={permalink} className="post__list-title">
                  {title}
                </Link>

                <div className="post__list-tags">
                  {tags.length > 0 &&
                    tags
                      .slice(0, 2)
                      .map(
                        (
                          { label, permalink: tagPermalink },
                          index
                        ) => (
                          <Link
                            key={tagPermalink}
                            className={`post__tags ${index < tags.length
                              ? "margin-right--sm"
                              : ""
                              }`}
                            to={tagPermalink}
                            style={{
                              fontSize: "0.75em",
                              fontWeight: 500,
                            }}
                          >
                            {label}
                          </Link>
                        )
                      )}
                </div>
                <div className="post__list-date">
                  {year}-{month}-{day}
                </div>
              </motion.div>
            </React.Fragment>
          );
        })
      }

    </motion.div>
  )

}

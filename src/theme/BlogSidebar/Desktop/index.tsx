import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { translate } from '@docusaurus/Translate'
import type { Props } from '@theme/BlogSidebar/Desktop'
import { motion } from 'framer-motion'
import styles from './styles.module.css'

export default function BlogSidebarDesktop({ sidebar }: Props): JSX.Element {

  const handleBack = () => {
    window.history.back()
  }

  return (
    <motion.aside
      className="col col--2 overflow-hidden"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20,
        duration: 0.3,
      }}
    >
      <nav
        className={clsx(styles.sidebar, 'thin-scrollbar')}
        aria-label={translate({
          id: 'theme.blog.sidebar.navAriaLabel',
          message: 'Blog recent posts navigation',
          description: 'The ARIA label for recent posts in the blog sidebar',
        })}
      >
        {(
          <div className={styles.backButton} onClick={handleBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8 7v4L2 6l6-5v4h5a8 8 0 1 1 0 16H4v-2h9a6 6 0 0 0 0-12H8Z" />
            </svg>
          </div>
        )}

        <Link
          href="/blog"
          className={clsx(styles.sidebarItemTitle, 'margin-bottom--sm')}
        >
          {sidebar.title}
        </Link>
        <ul className={clsx(styles.sidebarItemList, 'clean-list')}>
          {sidebar.items.map(item => (
            <li key={item.permalink} className={styles.sidebarItem}>
              <Link
                isNavLink
                to={item.permalink}
                className={styles.sidebarItemLink}
                activeClassName={styles.sidebarItemLinkActive}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

    </motion.aside>
  )
}

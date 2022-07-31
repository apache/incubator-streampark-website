const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'StreamX',
    tagline: 'StreamX',
    url: 'https://streamxhub.com',
    baseUrl: '/',
    onBrokenLinks: 'ignore',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'image/favicon.ico',
    organizationName: 'Streamxhub',
    projectName: 'StreamX',
    i18n: {
        defaultLocale: "en",
        locales: ["en", "zh-CN"],
        localeConfigs: {
            en: {
                label: "English",
                direction: 'ltr',
            },
            'zh-CN': {
                label: "简体中文",
                direction: 'ltr',
            },
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    sidebarCollapsible: true,
                    editLocalizedFiles: true,
                    sidebarCollapsed: false,
                    // Please change this to your repo.
                    editUrl: 'https://github.com/streamxhub/streamx-website/edit/dev/'
                },

                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    editUrl:
                        'https://github.com/streamxhub/streamx-website/edit/dev/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig: ({
        colorMode: {
            defaultMode: 'light',
            disableSwitch: true
        },
        navbar: {
            title: 'StreamX',
            logo: {
                alt: 'StreamX Logo',
                src: 'image/logo.svg',
            },
            items: [
                {
                    to: '/',
                    position: 'right',
                    label: 'Home',
                    activeBaseRegex: `^/$`,
                },
                {
                    to: 'https://github.com/streamxhub/streamx/releases',
                    position: 'right',
                    label: 'Download'
                },
                {
                    to: '/docs/intro',
                    label: 'Document',
                    position: 'right',
                    activeBaseRegex: `/docs`,
                },
                {
                    to: '/team',
                    label: 'Team',
                    position: 'right',
                    activeBaseRegex: `/team`,
                },
                {
                    to: '/user',
                    label: 'Users',
                    position: 'right',
                    activeBaseRegex: `/user`,
                },
                {
                    to: '/blog',
                    label: 'Blog',
                    position: 'right',
                    activeBaseRegex: `/blog`,
                },
                {
                    to: 'https://github.com/streamxhub/streamx/issues/507',
                    position: 'right',
                    label: 'FAQ'
                },
                {
                    href: 'https://github.com/streamxhub/streamx',
                    label: 'GitHub',
                    position: 'right',
                },
                {
                    type: "localeDropdown",
                    position: "right",
                },
            ],
        },

        footer: {
            style: 'light',
            links: [
                {
                    title: 'StreamX',
                    items: [
                        {
                            label: 'Document',
                            href: '/docs/intro',
                        },
                        {
                            label: 'FAQ',
                            href: 'https://github.com/streamxhub/streamx/issues/507',
                        },
                        {
                            label: 'Releases',
                            href: 'https://github.com/streamxhub/streamx/releases',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/streamxhub/streamx',
                        },
                        {
                            label: 'Issue Tracker',
                            href: 'https://github.com/streamxhub/streamx/issues',
                        },
                        {
                            label: 'Pull Requests',
                            href: 'https://github.com/streamxhub/streamx/pulls',
                        },
                    ],
                }
            ],
            copyright: `<p style="padding: 0 20px 30px;color: #999999; font-weight: 400;">Apache LICENSE 2.0 Licensed, Copyright © 2019-${new Date().getFullYear()} streamxhub All Rights Reserved</p>`,
        },

        prism: {
            theme: require('prism-react-renderer/themes/vsLight'),
            darkTheme: darkCodeTheme,
            additionalLanguages: ['powershell','java','scala','yaml'],
        }

    }),

    plugins: [
        'docusaurus-plugin-less',
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'community',
                path: 'community',
                routeBasePath: 'community',
                sidebarPath: require.resolve('./sidebars.js'),
            },
        ],
    ]
};

module.exports = config;

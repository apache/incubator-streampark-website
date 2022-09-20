const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Apache StreamPark (incubating)',
    tagline: 'Apache StreamPark - Make stream processing easier! easy-to-use streaming application development framework and operation platform',
    url: 'https://streampark.apache.org/',
    baseUrl: '/',
    onBrokenLinks: 'ignore',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'image/favicon.ico',
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
                    editUrl: 'https://github.com/apache/incubator-streampark-website/edit/dev/'
                },

                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    editUrl:
                        'https://github.com/apache/incubator-streampark-website/edit/dev/',
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
            title: 'Apache StreamPark',
            logo: {
                alt: 'StreamPark Logo',
                src: 'image/logo.png',
            },
            items: [
                {
                    to: '/',
                    position: 'right',
                    label: 'Home',
                    activeBaseRegex: `^/$`,
                },
                {
                    to: 'https://github.com/apache/incubator-streampark/releases',
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
                    label: 'Community',
                    position: 'right',
                    items: [
                        {
                            label: "Code of conduct",
                            to: "https://www.apache.org/foundation/policies/conduct",
                        },
                        {
                            label: "Join the mailing lists",
                            to: "/community/contribution_guide/mailing_lists",
                        },
                        {
                            label: "Become A Committer",
                            to: "/community/contribution_guide/become_committer",
                        },
                        {
                            label: "Become A PMC member",
                            to: "/community/contribution_guide/become_pmc_member",
                        },
                        {
                            label: "New Committer Process",
                            to: "/community/contribution_guide/new_committer_process",
                        },
                        {
                            label: "New PMC Member Process",
                            to: "/community/contribution_guide/new_pmc_ember_process",
                        },
                        {
                            label: "Documentation Notice",
                            to: "/community/submit_guide/document",
                        },
                        {
                            label: "Submit Code",
                            to: "/community/submit_guide/submit_code",
                        },
                    ],
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
                    to: 'https://github.com/apache/incubator-streampark/issues/507',
                    position: 'right',
                    label: 'FAQ'
                },
                {
                    label: 'ASF',
                    position: 'right',
                    items: [
                        {
                            label: "Foundation",
                            to: "https://www.apache.org/",
                        },
                        {
                            label: "License",
                            to: "https://www.apache.org/licenses/",
                        },
                        {
                            label: "Events",
                            to: "https://www.apache.org/events/current-event",
                        },
                        {
                            label: "Security",
                            to: "https://www.apache.org/security/",
                        },
                        {
                            label: "Sponsorship",
                            to: "https://www.apache.org/foundation/sponsorship.html",
                        },
                        {
                            label: 'Privacy',
                            to: 'https://www.apache.org/foundation/policies/privacy.html'
                        },
                        {
                            label: "Thanks",
                            to: "https://www.apache.org/foundation/thanks.html",
                        },
                    ],
                },
                {
                    href: 'https://github.com/apache/incubator-streampark',
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
            style: 'dark',
            links: [
                {
                    items: [
                        {
                            html: `
                            <div class="footer-left-box">
                              <div class="flex align-center footer-system">
                                <img src="/image/logo.png" alt="" class="f_logo">
                                <span class='system-title'>Apache StreamPark</span>
                              </div>
                              <p>Make stream processing easier! easy-to-use streaming application development framework and operation platform.</p>
                            </div>
                          `,
                        }
                    ],
                },
                {
                    title: 'StreamPark',
                    items: [
                        {
                            label: 'Document',
                            href: '/docs/intro',
                        },
                        {
                            label: 'FAQ',
                            href: 'https://github.com/apache/incubator-streampark/issues/507',
                        },
                        {
                            label: 'Releases',
                            href: 'https://github.com/apache/incubator-streampark/releases',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/apache/incubator-streampark',
                        },
                        {
                            label: 'Issue Tracker',
                            href: 'https://github.com/apache/incubator-streampark/issues',
                        },
                        {
                            label: 'Pull Requests',
                            href: 'https://github.com/apache/incubator-streampark/pulls',
                        },
                    ],
                },
                {
                  title:"Join us",
                  items: [
                      {
                          html: `
                          <img src="/home/weixin.png" />
                          `,
                      }
                  ],
                }
            ],
            logo: {
                alt: 'Apache Incubator logo',
                src: 'image/apache-incubator.svg',
                href: 'https://incubator.apache.org/'
            },
            copyright: `<div style="text-align: left;">
                  <div>
                    <p style="font-family: Avenir-Medium;font-size: 14px;color: #999;line-height: 20px;">
                    Apache StreamPark is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by the Apache Incubator. Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. While incubation status is not necessarily a reflection of the completeness or stability of the code, it does indicate that the project has yet to be fully endorsed by the ASF.
                    </p>
                  </div>
                  <div style="border-top: 1px solid #999;min-height: 60px;line-height: 20px;text-align: center;font-family: Avenir-Medium;font-size: 14px;color: #999;display: flex;align-items: center;">
                  <span>
                    Copyright © ${new Date().getFullYear()} The Apache Software Foundation. Apache StreamPark, StreamPark, and its feather logo are trademarks of The Apache Software Foundation.
                  </span>
                  </div>
                </div>`,
        },

        prism: {
            theme: require('prism-react-renderer/themes/vsLight'),
            darkTheme: darkCodeTheme,
            additionalLanguages: ['powershell', 'java', 'scala', 'yaml'],
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

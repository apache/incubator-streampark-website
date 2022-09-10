const darkCodeTheme = require('prism-react-renderer/themes/dracula');
/* custom */

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Apache StreamPark (Incubating)',
	tagline: 'Apache StreamPark is a Extremely fast stream processing development framework, supported unified batch & streaming and data lake & data warehouse cloud-native bigdata platform, one-stop real-time computing cloud-native platform',
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
			title: 'StreamPark',
			logo: {
				alt: 'StreamPark Logo',
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
			style: 'light',
			links: [
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
				}
			],
			copyright: `
            <div style="margin-top: 20px;background: #f4f8fa">
                <img
                  style="height:50px;margin-bottom: 10px"
                  alt="Apache Software Foundation"
                  src="/image/incubator-logo.svg"
                />
                <p style="color: #999999;font-weight:400;text-align:left">
                  Apache StreamPark is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by the Apache Incubator. Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. While incubation status is not necessarily a reflection of the completeness or stability of the code, it does indicate that the project has yet to be fully endorsed by the ASF.
                </p>
                <div style="border-top: 1px solid #ccc;min-height: 60px;line-height: 20px;text-align: center;font-family: Avenir-Medium;font-size: 14px;color: #999;display: flex;align-items: center;">
                  <span>
                    Copyright © ${new Date().getFullYear()} The Apache Software Foundation. Apache StreamPark, StreamPark, Apache, the Apache Feather logo, and the Apache Incubator project logo are trademarks of The Apache Software Foundation.
                  </span>
                </div>
            <div>`,
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

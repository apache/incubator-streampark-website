const darkCodeTheme = require('prism-react-renderer/themes/dracula');
/* custom */
const CopyRight = `
<div class="footer-box">
	<div class="footer-item">
		<a href="https://www.apachecon.com/acna2022/">
			<img title="ApacheCon North America" alt="ApacheCon North America" src="https://www.apachecon.com/event-images/acna2022-wide-dark.png" class="footer-pc-img" style="max-width: 310px;">
		</a>
		<a href="https://www.apachecon.com/acna2022/">
			<img title="ApacheCon North America" alt="ApacheCon North America" src="https://www.apachecon.com/event-images/acna2022-wide-dark.png" class="footer-mobile-img" style="max-width: 114px;">
		</a>
		<p>
			The Official Global Conference Series of The Apache Software Foundation,
			connecting open source technology enthusiasts from around the world to
			share the latest technology developments and practices.
		</p>
	</div>
	<div class="footer-item">
		<img class="footer-img" src="/image/incubator_feather_egg_gray_logo.png">
		<p>
			<span class="footer-sep">
				Apache StreamPark is an effort undergoing Incubation at The Apache Software
				Foundation (ASF), sponsored by the Incubator. Incubation is required of
				all newly accepted projects until a further review indicates that the infrastructure,
				communications, and decision making process have stabilized in a manner
				consistent with other successful ASF projects. While incubation status
				is not necessarily a reflection of the completeness or stability of the
				code, it does indicate that the project has yet to be fully endorsed by
				the ASF.
			</span>
			Apache, the Apache Feather logo, and the Apache Incubator project logo
			are trademarks of The Apache Software Foundation.
		</p>
	</div>
	<div class="footer-copyright">
		<div class="footer-block"></div>
		<div class="footer-copyright-content">
			<span>
				Copyright © 2019-${new Date().getFullYear()} StreamPark All Rights Reserved
			</span>
		</div>
	</div>
</div>
`
/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'StreamPark',
	tagline: 'StreamPark',
	url: 'https://streamxhub.com',
	baseUrl: '/',
	onBrokenLinks: 'ignore',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'image/favicon.ico',
	organizationName: 'Streamxhub',
	projectName: 'StreamPark',
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
			style: 'dark',
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
			copyright: CopyRight,
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

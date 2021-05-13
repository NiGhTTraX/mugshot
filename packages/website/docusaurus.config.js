module.exports = {
  title: 'Mugshot',
  tagline: 'Visual regression testing library',
  url: 'https://nighttrax.github.io/mugshot/',
  baseUrl: '/mugshot/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'NiGhTTraX',
  projectName: 'mugshot',
  themeConfig: {
    navbar: {
      title: 'Mugshot',
      logo: {
        alt: 'Mugshot Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'doc',
          docId: 'api/index',
          position: 'left',
          label: 'API',
        },
        {
          href: 'https://github.com/nighttrax/mugshot',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Andrei Picus. Built with Docusaurus.`,
    },
    colorMode: {
      // Images are designed to only work with the dark theme.
      defaultMode: 'dark',
      disableSwitch: true,
    },
    algolia: {
      apiKey: '139f20b83f55f9ba5b2f7e258d1fafc4',
      indexName: 'nighttrax',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl:
            'https://github.com/nighttrax/mugshot/edit/master/packages/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: [
          '../mugshot/src/index.ts',
          '../puppeteer/src/index.ts',
          '../webdriverio/src/index.ts',
          '../playwright/src/index.ts',
          '../contracts/src/index.ts',
        ],
        sidebar: {
          sidebarFile: 'sidebar-api.js',
        },
        tsconfig: '../tsconfig.json',
        allReflectionsHaveOwnDocument: true,
        excludePrivate: true,
        excludeProtected: true,
        listInvalidSymbolLinks: true,
        media: './static/img',
        readme: 'none',
        name: 'API',
        watch: process.env.NODE_ENV !== 'production',
      },
    ],
  ],
};

module.exports = {
  title: 'Mugshot',
  tagline: 'Visual regression testing library',
  url: 'https://nighttrax.github.io/mugshot/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico', // TODO
  organizationName: 'NiGhTTraX',
  projectName: 'mugshot',
  themeConfig: {
    navbar: {
      title: 'Mugshot',
      logo: {
        // TODO
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Getting started',
        },
        {
          type: 'doc',
          docId: 'api/index',
          position: 'left',
          label: 'API',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Andrei Picus. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/nighttrax/mugshot/edit/master/website/',
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
        id: 'mugshot',
        allReflectionsHaveOwnDocument: true,
        entryPoints: ['../mugshot/src/index.ts'],
        sidebar: {
          sidebarFile: 'sidebar-mugshot.js',
        },
        tsconfig: '../mugshot/tsconfig.json',
        name: 'Mugshot',
        media: '../../media',
        readme: 'none',
      },
    ],
  ],
};

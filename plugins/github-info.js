// A JavaScript function that returns an object.
// `context` is provided by Docusaurus. Example: siteConfig can be accessed from context.
// `opts` is the user-defined options.
const fetch = require('node-fetch');
async function githubInfo(context, opts) {
  return {
    name: 'github-info-plugin',

    async loadContent() {
      // The loadContent hook is executed after siteConfig and env has been loaded.
      // You can return a JavaScript object that will be passed to contentLoaded hook.
      const githubData = await fetch(
        'https://api.github.com/repos/apache/incubator-streampark'
      )
      const data = await githubData.json()
      const stars = data?.stargazers_count ?? 31000
      return {
        github: {
          stars
        },
      }
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData(content)
    },
  };
}

module.exports = githubInfo;
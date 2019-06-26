const LoadablePlugin = require('@loadable/webpack-plugin')
const path = require('path')

module.exports = {
  plugins: [
    {
      name: 'typescript',
      options: {
        useBabel: true,
        tsLoader: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
        forkTsChecker: {
          tsconfig: './tsconfig.json',
          tslint: './tslint.json',
          watch: './src',
          typeCheck: true,
        },
      },
    },
  ],
  modify: (config, { target, dev }, webpack) => {
    if (target === 'web') {
      config.plugins.push(
        new LoadablePlugin({
          filename: 'loadable-stats.json',
          writeToDisk: true,
        })
      )
    }
    return config
  },
}

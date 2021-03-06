## Webpack <!-- {docsify-ignore-all} -->

- All webpack config defined at `webpack/webpack.config.js`
- `webpack/cli.js` make [webpack-cli](https://webpack.js.org/api/cli/) more flexible.

### Plugins

- [EnvironmentPlugin](https://webpack.js.org/plugins/environment-plugin/) - set variable into `process.env`
- [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) - inject your scripts and css into html file
- [ForkTsCheckerWebpackPlugin](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin) - Speeds up TypeScript type checking
- [ESLintPlugin](https://github.com/webpack-contrib/eslint-webpack-plugin) - run eslint automatically, its error message is much better then `ForkTsCheckerWebpackPlugin`
- [CopyWebpackPlugin](https://webpack.js.org/plugins/copy-webpack-plugin/) - copy static files
- [ImageMinimizerPlugin](https://github.com/webpack-contrib/image-minimizer-webpack-plugin) - generate `.webp` image file
- [AssetsJSONPlugin](./assets.md) - local plugin for generate `assets.json` for Phaser
- [TerserWebpackPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/) - minify the JS output.
- [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/) - extracts CSS into separate files.
- [WebpackObfuscator](https://github.com/javascript-obfuscator/webpack-obfuscator) - obfuscate the JS output
- `webpack/InlineChunkHtmlPlugin.js` - local plugin. Copy from [Create-React-App](https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/InlineChunkHtmlPlugin.js).
- Type checking is enabled ( as `webpack/jsconfig.json` ) but some plugins may not have the correct type. You could

  ```js file=webpack/webpack.config.js
  [
    // eslint-disable-next-line // highlight-line
    // @ts-ignore               // highlight-line
    new ESLintPlugin(eslintOptions)
  ];
  ```

### HMR

[Hot Module Replacement (HMR)](https://webpack.js.org/concepts/hot-module-replacement/) exchanges, adds, or removes modules while an application is running, without a full reload.

- For some unexpected issues of `HMR`, most possibly is forget to remove the listeners when the game destroys.

- You could disable `HMR` by creating a `.env.local` at the project root
  ```env file=.env.local
  DEV_SERVER_HMR = false
  ```

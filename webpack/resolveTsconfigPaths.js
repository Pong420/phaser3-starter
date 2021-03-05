// reference: gist.github.com/nerdyman/2f97b24ab826623bff9202750013f99e

const { resolve } = require('path');

/** @typedef {import("typescript").CompilerOptions} CompilerOptions */
/** @typedef {NonNullable<import("webpack").Configuration['resolve']>['alias']} Alias */

/**
 * Resolve tsconfig.json paths to Webpack aliases
 * @param  {object} options
 * @param  {*} options.tsConfig
 * @param  {string} [options.webpackConfigBasePath]
 * @return {Alias}
 */
function resolveTsconfigPaths(options) {
  const { tsConfig, webpackConfigBasePath = process.cwd() } = options;

  const paths = tsConfig.compilerOptions.paths || [];

  /** @type {Record<string, any>} */
  const aliases = {};

  Object.keys(paths).forEach(item => {
    const key = item.replace('/*', '');
    const value = resolve(
      webpackConfigBasePath,
      paths[item][0].replace('/*', '').replace('*', '')
    );

    aliases[key] = value;
  });

  return aliases;
}

module.exports = { resolveTsconfigPaths };

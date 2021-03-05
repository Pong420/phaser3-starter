const { processer } = require('./processer');

/** @typedef {import("webpack").WebpackPluginInstance} WebpackPluginInstance */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */

/**
 * @extends {WebpackPluginInstance}
 */
class AssetsJSONPlugin {
  /**
   * @param {AssetsJSONOptions| AssetsJSONOptions[]} options
   */
  constructor(options) {
    this.options = Array.isArray(options) ? options : [options];
  }

  /**
   * @param {Compiler} compiler
   */
  apply(compiler) {
    const pluginName = this.constructor.name;

    const { RawSource } = compiler.webpack.sources;

    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      const logger = compilation.getLogger(AssetsJSONPlugin.name);
      // const cache = compilation.getCache('AssetsJSONPlugin');

      compilation.hooks.processAssets.tapPromise(
        {
          name: AssetsJSONPlugin.name,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        async _unusedAssets => {
          for (const option of this.options) {
            const assets = await processer(option);
            const key = option.to;
            const source = new RawSource(JSON.stringify(assets));

            if (compilation.getAsset(key)) {
              compilation.updateAsset(key, source);
            } else {
              compilation.emitAsset(key, source);
            }

            logger.log(`assets "${option.to}" emitted`);
          }
        }
      );
    });
  }
}

module.exports = { AssetsJSONPlugin };

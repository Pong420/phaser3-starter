const path = require('path');
const fastGlob = require('fast-glob');
const { classify } = require('./classify');

/**
 *  @param {AssetsJSONOptions} options
 */
async function processer(options) {
  let { from, include = [], exclude = [] } = options;
  const entries = (Array.isArray(from) ? from : [from]).map(
    ({ input, path, ...entry }) => ({
      ...entry,
      input: input.endsWith('/') ? input : input + '/',
      path: path.endsWith('/') ? path.substring(0, path.length) : path
    })
  );

  /** @type {Record<string, AssetPack>} */
  const assets = {};

  for (const entry of entries) {
    /**
     * @type {Record<string, FileInfo>}
     * group assets by folder name (e.g. basegame/freegame/shared)
     */
    const group = {};

    const patterns = [
      ...include.map(pattern => path.join(entry.input, pattern)),
      ...exclude.map(pattern => '!' + path.join(entry.input, pattern))
    ];

    const paths = await fastGlob(patterns);

    for (const fullPath of paths) {
      const matches = fullPath.match(
        new RegExp(`^${entry.input}(.+)\/([^\/]+)$`)
      );

      if (matches && matches.length === 3) {
        const [, packKey, filename] = matches;
        let [key, fileType] = filename.split('.');

        // if key end with number
        if (/\d+$/.test(key)) {
          const _key = key.replace(/\d+$/, '');
          if (group[_key]) {
            key = _key;
          }
        }

        /** @type {FileInfo} */
        const item = group[key] || {
          packKey,
          files: [],
          fileTypes: [],
          filenameByType: {}
        };

        item.files.push(filename);
        item.fileTypes.push(fileType);
        item.filenameByType[fileType] = filename;

        group[key] = item;
      }
    }

    for (const [key, item] of Object.entries(group)) {
      assets[item.packKey] = assets[item.packKey] || {
        path: `${entry.path}/${item.packKey}`,
        files: []
      };

      const asset = classify(key, item);

      if (asset) {
        assets[item.packKey].files.push(asset);
      }
    }
  }

  return assets;
}

module.exports = { processer };

// for testing
// handler({
//   from: [
//     { input: 'src/assets', path: `../assets` },
//     { input: `games/SB73/assets`, path: `assets` }
//   ],
//   to: 'assets/assets.json',
//   include: ['**/*'],
//   exclude: ['**/loading-page/**/*', '**/assets.json']
// }).then(d =>
//   require('fs').writeFileSync(
//     path.resolve(__dirname, './assest-debug.json'),
//     JSON.stringify(d, null, 2)
//   )
// );

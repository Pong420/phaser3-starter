/**
 * @param {string} key
 * @param {FileInfo} info
 * @returns {Asset | undefined}
 */
function classify(key, info) {
  const { fileTypes, filenameByType } = info;
  const _fileTypes = fileTypes.join(',');
  const hasBitmapFont = /xml/.test(_fileTypes);
  const hasImage = /jpg|png/.test(_fileTypes);
  const hasJson = /json/.test(_fileTypes);
  const hasAtlas = /atlas/.test(_fileTypes);
  const hasAuido = /mp3|ogg|wav/.test(_fileTypes);

  const imageURL = filenameByType['png'] || filenameByType['jpg'];
  const jsonURL = filenameByType['json'];
  const xmlURL = filenameByType['xml'];
  const atlasURL = filenameByType['atlas'];

  if (hasAtlas) {
    return {
      type: 'spine',
      key,
      jsonURL,
      atlasURL
    };
  }

  if (hasImage && hasJson) {
    return {
      type: 'atlas',
      key,
      textureURL: imageURL,
      atlasURL: jsonURL
    };
  }

  if (hasBitmapFont) {
    return {
      type: 'bitmapFont',
      key,
      textureURL: imageURL,
      fontDataURL: xmlURL
    };
  }

  if (hasAuido) {
    return {
      key,
      audioURL: [
        filenameByType['mp3'],
        filenameByType['ogg'],
        filenameByType['wav']
      ].filter(Boolean),
      ...(hasJson ? { type: 'audioSprite', jsonURL } : { type: 'audio' })
    };
  }

  if (hasImage) {
    return {
      type: 'image',
      key,
      url: imageURL
    };
  }

  if (hasJson) {
    return {
      type: 'json',
      key,
      url: jsonURL
    };
  }

  console.warn('unknown asset', JSON.stringify(info, null, 2));
}

module.exports = { classify };

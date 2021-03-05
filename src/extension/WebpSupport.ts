/**
 * Replace image extension to "webp" before load.
 *
 * Note:
 * These code not work on spine because `SpinePlugin` using difference scope of `ImageFile`
 * @See https://github.com/photonstorm/phaser/blob/bf9966cb9e2ac6967f1faed4e529551f110d9d18/plugins/spine/src/SpineFile.js#L177-L189
 */

import { overrideHelper } from './override';

const regex = /\.(png|jpg|jpeg|gif)$/i;

const { override, resetOverride } = overrideHelper();
module.hot && module.hot.dispose(resetOverride);

const useWebp = true;

export const tryToUseWebp = (url: string) =>
  useWebp ? url.replace(regex, '.webp') : url;

override(Phaser.Loader.FileTypes.ImageFile, {
  load: function (load) {
    return function (...args) {
      this.url =
        typeof this.url === 'string' ? tryToUseWebp(this.url) : this.url;
      return load.call(this, ...args);
    };
  }
});

import SpinePlugin, { SpineFile } from './SpinePlugin';
import { overrideHelper } from '../override';

const { override, resetOverride } = overrideHelper();
module.hot && module.hot.dispose(resetOverride);

/**
 * Hard fix phaser spine plugin while HMR
 * Waiting for next release
 * https://github.com/photonstorm/phaser/pull/5575
 */
const { bootWebGL } = SpinePlugin.prototype;

let sceneRenderer: spine.webgl.SceneRenderer | null | undefined = undefined;
let setBlendMode: any;

override(SpinePlugin, {
  bootWebGL: function () {
    return function (this: SpinePlugin) {
      bootWebGL.call(this);

      if (typeof sceneRenderer === 'undefined') {
        sceneRenderer = this.sceneRenderer;
        setBlendMode = this.sceneRenderer.batcher.setBlendMode;
      } else if (sceneRenderer === null) {
        // eslint-disable-next-line
        // @ts-ignore
        sceneRenderer = new this.sceneRenderer.constructor(
          (this.renderer as any).canvas,
          this.gl,
          true
        );
        (sceneRenderer as any).batcher.setBlendMode = setBlendMode;
        (sceneRenderer as any).shapes.setBlendMode = setBlendMode;

        if (sceneRenderer) {
          this.sceneRenderer = sceneRenderer;
        }
      }
    };
  },

  gameDestroy: function () {
    return function (this: any) {
      this.pluginManager.removeGameObject('spine', true, true);
      this.pluginManager.removeGameObject('spineContainer', true, true);
      this.pluginManager = null;

      this.sceneRenderer = null;
      if (sceneRenderer) {
        sceneRenderer.dispose();
        sceneRenderer = null;
      }
    };
  }
});

const asyncFilePrototype = (file: Phaser.Loader.File) => {
  const fileName = file.constructor.name;
  const fileType = Phaser.Loader.FileTypes[file.constructor.name];

  if (fileType) {
    Object.assign(file, fileType.prototype);
  } else {
    console.warn(`Unknown ${fileName}`);
  }
};

/**
 * Make `../MemoryCache` and `../WebpSupport` work on Spine
 */
override(SpineFile as typeof Phaser.Loader.MultiFile, {
  addToMultiFile: function (addToMultiFile) {
    return function (file) {
      asyncFilePrototype(file);
      addToMultiFile.call(this, file);
    };
  },
  onFileComplete: function (onFileComplete) {
    return function (file) {
      this.files.forEach(function (file) {
        asyncFilePrototype(file);
      });
      onFileComplete.call(this, file);
    };
  }
});

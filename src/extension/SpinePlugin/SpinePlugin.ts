// import source code of spine plugin so that we could easier to override it
import SpineFile from 'phaser/plugins/spine/src/SpineFile';
import SpinePluginRaw from 'phaser/plugins/spine/src/SpinePlugin';

declare global {
  interface SpinePlugin {
    bootWebGL(): void;
    gameDestroy(): void;
    spineFileCallback(this: Phaser.Loader.LoaderPlugin): void;
  }
}

export const _SpinePlugin = SpinePluginRaw as typeof SpinePlugin;

export { SpineFile };

export default _SpinePlugin;

import { Service } from 'typedi';
import { AssetsJson } from '@/constants';
import { createLogger } from '@/utils/logger';
import { PlayScene } from './PlayScene';

@Service()
export class PreloadScene extends Phaser.Scene {
  logger = createLogger(PreloadScene.name);

  lazyLoaders: Record<string, Phaser.Loader.LoaderPlugin> = {};

  init() {
    this.logger.log('init');
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  preload() {
    this.logger.log('preload');
    this.load.on(Phaser.Loader.Events.PROGRESS, this.handleLoadProgress, this);

    const assetsJSON = this.cache.json.get(AssetsJson);
    this.load.addPack(assetsJSON, 'shared');
    this.addLazyLoader(assetsJSON, 'lazyload');
  }

  create() {
    this.logger.log('create');

    for (const key in this.lazyLoaders) {
      this.lazyLoaders[key].start();
    }

    this.scene.start(PlayScene.name);
  }

  shutdown() {
    this.logger.log('shutdown');
    this.load.off(Phaser.Loader.Events.PROGRESS, this.handleLoadProgress, this);

    for (const key in this.lazyLoaders) {
      const loader = this.lazyLoaders[key];
      if (loader.state !== Phaser.Loader.LOADER_DESTROYED) {
        loader.destroy();
      }
    }

    this.lazyLoaders = {};
  }

  handleLoadProgress(progress: number) {
    this.logger.log(`progress ${Math.ceil(progress * 100)}`);
  }

  addLazyLoader(assset: Record<string, any>, key: string) {
    if (assset[key]) {
      const loader = new Phaser.Loader.LoaderPlugin(this);
      loader.addPack(assset, key);
      loader.once(Phaser.Loader.Events.COMPLETE, () => loader.destroy());
      this.lazyLoaders[key] = loader;
    } else {
      this.logger.warn(`key "${key}" not found in assets`);
    }
  }

  getLazyLoader(key: string, strict?: true): Phaser.Loader.LoaderPlugin;
  getLazyLoader(
    key: string,
    strict: false
  ): Phaser.Loader.LoaderPlugin | undefined;
  getLazyLoader(
    key: string,
    strict = true
  ): Phaser.Loader.LoaderPlugin | undefined {
    const loader = this.lazyLoaders[key];
    if (!loader && strict) {
      this.logger.error(
        `${key} lazy loader not found, available loaders:`,
        Object.keys(this.lazyLoaders)
      );
    }

    return this.lazyLoaders[key];
  }

  isLazyLoadComplete(key: string) {
    const loader = this.getLazyLoader(key, false);
    return !loader || !loader.isLoading();
  }
}

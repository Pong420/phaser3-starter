import { Service } from 'typedi';
import { createLogger } from '@/utils/logger';
import { AssetsJson } from '@/constants';
import { PreloadScene } from './PreloadScene';

@Service()
export class BootScene extends Phaser.Scene {
  logger = createLogger(BootScene.name);

  init() {
    this.logger.log('init');
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  preload() {
    this.logger.log('preload');
    this.load.json(AssetsJson, `./assets/assets.json`);
  }

  create() {
    this.logger.log('create');
    this.scene.start(PreloadScene.name);
  }

  shutdown() {
    this.logger.log('shutdown');
  }
}

import { Service } from 'typedi';
import { createLogger } from '@/utils/logger';

@Service()
export class PlayScene extends Phaser.Scene {
  logger = createLogger(PlayScene.name);

  init() {
    this.logger.log('init');
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  preload() {
    this.logger.log('preload');
  }

  create() {
    this.logger.log('create');
  }

  shutdown() {
    this.logger.log('shutdown');
  }
}

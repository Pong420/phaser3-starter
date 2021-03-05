import { Service } from 'typedi';
import { createLogger } from '@/utils/logger';
import { PhaserLogo } from '@/components/PhaserLogo';
import { FpsText } from '@/components/FpsText';
import { Listener } from '@/service/EventEmitter';

@Service()
export class PlayScene extends Phaser.Scene {
  logger = createLogger(PlayScene.name);

  logo: PhaserLogo;

  fpsText: FpsText;

  version: Phaser.GameObjects.Text;

  init() {
    this.logger.log('init');
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  preload() {
    this.logger.log('preload');
  }

  create() {
    this.logger.log('create');

    this.fpsText = new FpsText(this);

    this.version = this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setOrigin(1, 0);

    this.logo = new PhaserLogo(this, this.cameras.main.width / 2, 0);
  }

  update() {
    this.fpsText.update();
  }

  shutdown() {
    this.logger.log('shutdown');
  }

  @Listener('RESIZE')
  handleSizeUpdate() {
    this.version.setPosition(this.cameras.main.width - 15, 15);
    this.logo.setPosition(this.cameras.main.width / 2, 0);
  }
}

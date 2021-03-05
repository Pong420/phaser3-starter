import Phaser from 'phaser';
import Container, { Inject, Service } from 'typedi';
import { EventEmitter } from '@/service/EventEmitter';
import { createLogger } from '@/utils/logger';
import { BootScene } from '@/scenes/BootScene';
import { PreloadScene } from '@/scenes/PreloadScene';
import { PlayScene } from '@/scenes/PlayScene';
// import { SpinePlugin } from '@/extension/SpinePlugin';

// customize your self
const getDimension = () => [window.innerWidth, window.innerHeight];

const [width, height] = getDimension();

@Service()
export class Game extends Phaser.Game {
  logger = createLogger(Game.name);

  @Inject()
  private emitter: EventEmitter;

  constructor(config?: Phaser.Types.Core.GameConfig) {
    super({
      type: Phaser.AUTO,
      parent: 'game',
      width,
      height,
      dom: {
        createContainer: true
      },
      scale: {
        mode: Phaser.Scale.ScaleModes.FIT
      },
      // plugins: {
      //   scene: [
      //     {
      //       key: SpinePlugin.name,
      //       plugin: SpinePlugin,
      //       mapping: 'spine'
      //     }
      //   ]
      // },
      ...config
    });
    this.handleSizeUpdate = this.handleSizeUpdate.bind(this);
  }

  init() {
    this.logger.log('init');

    window.addEventListener('resize', this.handleSizeUpdate);

    this.scene.add(BootScene.name, Container.get(BootScene), true);
    this.scene.add(PreloadScene.name, Container.get(PreloadScene));
    this.scene.add(PlayScene.name, Container.get(PlayScene));

    this.emitter.loadEventListeners();
  }

  destroy(removeCanvas = true, noReturn?: boolean) {
    this.plugins.scenePlugins
      .slice()
      .forEach(name => this.plugins.removeScenePlugin(name));

    window.removeEventListener('resize', this.handleSizeUpdate);
    return super.destroy(removeCanvas, noReturn);
  }

  handleSizeUpdate() {
    const [width, height] = getDimension();
    this.scale.setParentSize(width, height);
    this.scale.setGameSize(width, height);
    this.emitter.emit('RESIZE');
  }
}

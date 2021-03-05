import Phaser from 'phaser';
import { parseParticlesConfig } from './parseParticlesConfig';
import { overrideHelper } from '../override';

const { override, resetOverride } = overrideHelper();
module.hot && module.hot.dispose(resetOverride);

override(Phaser.GameObjects.Particles.ParticleEmitterManager, {
  createEmitter: function (createEmitter) {
    return function (
      config:
        | Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
        | Phaser.Types.GameObjects.Particles.AnimatedParticleEmitterConfig
    ) {
      return createEmitter.call(
        this,
        parseParticlesConfig.call(this.scene.anims, this.texture.key, config)
      );
    };
  }
});

export const animatedParticle: Phaser.GameObjects.GameObjectFactory['animatedParticle'] = function (
  this: Phaser.GameObjects.GameObjectFactory,
  texture,
  key,
  emitters
) {
  return this.particles(texture, key, emitters);
};

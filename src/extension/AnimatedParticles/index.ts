import Phaser from 'phaser';
import { AnimatedParticleEmitterManager } from './AnimatedParticleEmitterManager';
import { animatedParticle } from './AnimatedParticles';

declare global {
  namespace Phaser.GameObjects.Particles {
    class AnimatedParticleEmitterManager extends ParticleEmitterManager {
      createEmitter(
        config: Phaser.Types.GameObjects.Particles.AnimatedParticleEmitterConfig
      ): Phaser.GameObjects.Particles.ParticleEmitter;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  namespace Phaser.Types.GameObjects.Particles {
    interface AnimatedParticleEmitterConfig
      extends Phaser.Types.GameObjects.Particles.ParticleEmitterConfig {
      anim: Phaser.Types.Animations.Animation;
      generateFrameName: Phaser.Types.Animations.GenerateFrameNames;
    }
  }

  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      animatedParticle(
        texture: string | Phaser.Textures.Texture,
        frame?: string | number | object | undefined, // eslint-disable-line @typescript-eslint/ban-types
        emitters?:
          | Phaser.Types.GameObjects.Particles.AnimatedParticleEmitterConfig
          | Phaser.Types.GameObjects.Particles.AnimatedParticleEmitterConfig[]
          | undefined
      ): Phaser.GameObjects.Particles.AnimatedParticleEmitterManager;
    }
  }
}

Phaser.GameObjects.Particles.AnimatedParticleEmitterManager = AnimatedParticleEmitterManager;

Phaser.GameObjects.GameObjectFactory.register(
  'animatedParticle',
  animatedParticle
);

export * from './AnimatedParticleClass';

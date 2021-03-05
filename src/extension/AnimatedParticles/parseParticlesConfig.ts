import { generateFrameName } from '@/utils/generateFrameName';
import { AnimatedParticleClass } from './AnimatedParticleClass';

export function parseParticlesConfig(
  this: Phaser.Animations.AnimationManager,
  texture: string,
  {
    anim,
    generateFrameName: generateFrameNameOps,
    ...config
  }: Partial<Phaser.Types.GameObjects.Particles.AnimatedParticleEmitterConfig>
): Phaser.Types.GameObjects.Particles.ParticleEmitterConfig {
  const animation = this.create({
    ...anim,
    key: texture,
    frames:
      anim?.frames || this.generateFrameNames(texture, generateFrameNameOps)
  });
  return {
    ...config,
    frame:
      config.frame ||
      (generateFrameNameOps && generateFrameName(generateFrameNameOps)),
    particleClass: config.particleClass || AnimatedParticleClass(animation)
  };
}

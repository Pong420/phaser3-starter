// References
// https://phaser.discourse.group/t/how-to-do-animated-particles-with-multiatlas/2850
// https://labs.phaser.io/edit.html?src=src%5Cgame%20objects%5Cparticle%20emitter%5Ccustom%20particles.js

export function AnimatedParticleClass(
  anim: Phaser.Animations.Animation | false
): Phaser.GameObjects.Particles.Particle | undefined {
  if (!anim) {
    throw new Error(
      `anim is false, please make sure animation created successfully`
    );
  }

  return class Particle extends Phaser.GameObjects.Particles.Particle {
    t = 0;
    i = 0;

    update(delta: number, step: number, processors: any[]) {
      const result = super.update(delta, step, processors);

      this.t += delta;

      if (this.t >= anim.msPerFrame) {
        this.i++;

        if (this.i > anim.frames.length - 1) {
          this.i = 0;
        }

        this.frame = anim.frames[this.i].frame;

        this.t -= anim.msPerFrame;
      }

      return result;
    }
  } as any;
}

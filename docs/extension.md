## Extensions <!-- {docsify-ignore-all} -->

Extensions for Phaser ( files in `src/extension/**` ). You could remove it if not suitable for you.

- `AnimatedParticles` - add animation support for Phaser's Particle ( [Reference](https://phaser.discourse.group/t/how-to-do-animated-particles-with-multiatlas/2850) )

  ```ts
  export class BaseGameScene extends Phaser.Scene {
    create() {
      const animationConfig = {};

      // origin setup
      const animation = this.anims.create(animationConfig); // highlight-line
      const particle = this.add.particles('ani_coin'); // highlight-line
      particle.createEmitter({
        particleClass: AnimatedParticleClass(animation) // highlight-line
      });

      // with this extension `particles` will return same result
      // but `animatedParticle` has better type checking
      const particle = this.add.particles('ani_coin'); // highlight-line
      const particle = this.add.animatedParticle('ani_coin'); // highlight-line
      particle.createEmitter({ ...animationConfig }); // highlight-line
    }
  }
  ```

- `WebpSupport` - replace images to `webp` format before load

- `MemoryCache` - reuse assets while `HMR` so that the loading time can be reduced

- `SpinePlugin` - fix Phaser SpinePlugin after game destroy and make it support `Webp` and `MemoryCache`

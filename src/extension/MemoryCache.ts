/**
 * Reuse assets when HMR
 */

import { overrideHelper } from './override';

if (!window.phaserMemory) {
  window.phaserMemory = {};
}

const isPhaserFile = (file: any): file is typeof Phaser.Loader.File => {
  return (
    file &&
    file.prototype &&
    'load' in file.prototype &&
    'onProcess' in file.prototype &&
    'onProcessComplete' in file.prototype
  );
};

const files = Object.keys(Phaser.Loader.FileTypes);

const { override, resetOverride } = overrideHelper();

for (const fileType of files) {
  const file = Phaser.Loader.FileTypes[fileType];

  if (!isPhaserFile(file)) {
    continue;
  }

  override(file, {
    onProcessComplete: function (onProcessComplete) {
      return function () {
        if (this.data) {
          window.phaserMemory[this.src] = this.data;
        }
        onProcessComplete.call(this);
      };
    },

    load: function (load) {
      return function () {
        const src = Phaser.Loader.GetURL(this, this.loader.baseURL);
        const hasData = window.phaserMemory[src];
        if (hasData) {
          this.src = src;
          setTimeout(() => {
            this.state = Phaser.Loader.FILE_LOADED;
            this.loader.nextFile(this, true);
          }, 0);
        } else {
          load.call(this);
        }
      };
    },

    onProcess: function (onProcess) {
      return function () {
        const data = window.phaserMemory[this.src];
        if (data) {
          this.data = data;
          Phaser.Loader.File.prototype.onProcess.call(this);
        } else {
          onProcess.call(this);
        }
      };
    }
  });
}

module.hot && module.hot.dispose(resetOverride);

declare interface Window {
  game: any;
  phaserMemory?: any;
}

declare namespace NodeJS {
  interface Module {
    data: any;
    hot?: {
      accept: (callback?: () => unknown) => unknown;
      accept: (
        dependencies?: string | string[],
        callback?: () => unknown
      ) => unknown;
      accept: (
        dependencies?: string | string[] | (() => unknown),
        callback?: () => unknown
      ) => unknown;
      dispose: (callback: (data: any) => unknown) => unknown;
      decline: (dependencies?: string | string[]) => unknown;
    };
  }
}

declare namespace Reflect {
  let METADATA_TYPE = string; // eslint-disable-line
  let METADATA_PARAM_TYPE = string; // eslint-disable-line
  let METADATA_RETURN_TYPE = string; // eslint-disable-line
}

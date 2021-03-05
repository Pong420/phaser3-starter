interface CustomWebpackOption {
  env: 'development' | 'production' | 'debug';
  mode: 'development' | 'production' | 'none';
  gameIds?: string;
  serve?: boolean;
  sourceMap?: boolean;
  minify?: boolean;
  obfuscate?: boolean;
}

type BooleanFields<T extends Record<string, any>> = {
  [K in keyof Required<T>]: Required<T>[K] extends boolean ? K : never;
}[keyof T];

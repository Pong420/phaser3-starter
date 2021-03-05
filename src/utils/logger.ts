export interface Logger extends Console {
  prefix: string;
}

export interface LoggerOptions {
  color?: string;
  css?: string;
}

const prefixFn: (keyof Console)[] = ['log', 'info', 'warn', 'error'];

export function createLogger(prefix = '', { color, css }: LoggerOptions = {}) {
  const logger = { prefix } as Logger;

  prefix = prefix && `[${prefix}]`;
  color = color && `color: ${color}`;
  css = (css || color) && `${css || ''} ${color || ''}`.trim();

  for (const [_key, value] of Object.entries(console)) {
    const key = _key as keyof Console;
    const isFunction = typeof value === 'function';
    const isProduction = process.env.NODE_ENV === 'production';

    switch (true) {
      case isFunction && isProduction:
        logger[key] = () => void 0;
        break;
      case isFunction && css && key === 'log':
        logger[key] = value.bind(console, `%c${prefix}`, css);
        break;
      case isFunction && prefixFn.includes(key):
        logger[key] = value.bind(console, prefix);
        break;
      default:
        logger[key] = value;
    }
  }

  return logger;
}

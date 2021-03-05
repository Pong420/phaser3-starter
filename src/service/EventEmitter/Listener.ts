import { GlobalEvent } from './EventEmitter';

export interface ListenerMetadata {
  event: string;
  method(): unknown | void;
  method(...args: unknown[]): unknown | void;
}

export interface ListenerOptions {}

export const ListenerMetadataKey = `ListenerMetadataKey`;

export function Listener(
  event: GlobalEvent,
  _options?: ListenerOptions
): MethodDecorator {
  return (target, methodName) => {
    const method = target[methodName];
    const name = `${target.constructor.name}#${String(methodName)}`;

    if (typeof method !== 'function') {
      throw new Error(`expect ${name} to be a function but receive ${method}`);
    }

    const metadata: ListenerMetadata = {
      event,
      method
    };

    // try to remove the listener of the instance that target extended from
    // if this have conflict with some logic use an option to disable it
    Reflect.deleteMetadata(
      ListenerMetadataKey,
      // i don't understand `getPrototypeOf`, but work
      Object.getPrototypeOf(target).constructor
    );

    Reflect.defineMetadata(ListenerMetadataKey, metadata, target.constructor);
  };
}

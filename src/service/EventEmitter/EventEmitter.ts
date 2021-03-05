import { Container, Service, ServiceMetadata } from 'typedi';
import { ListenerMetadata, ListenerMetadataKey } from './Listener';
import * as EVENT from './events';

export type GlobalEvent = keyof typeof EVENT;

type Listener = (this: any) => unknown;

@Service()
export class EventEmitter extends Phaser.Events.EventEmitter {
  emit(eventName: GlobalEvent, ...args: unknown[]) {
    return super.emit(EVENT[eventName], ...args);
  }

  on: (event: GlobalEvent, fn: Listener, context?: any) => this;
  once: (event: GlobalEvent, fn: Listener, context?: any) => this;
  addListener: (event: GlobalEvent, fn: Listener, context?: any) => this;

  off: (
    event: GlobalEvent,
    fn?: Listener,
    context?: any,
    once?: boolean
  ) => this;

  removeListener: (
    event: GlobalEvent,
    fn?: Listener,
    context?: any,
    once?: boolean
  ) => this;

  loadEventListeners() {
    const instances: { services: ServiceMetadata[] } = (Container as any)
      .globalInstance;

    for (const { type, id } of instances.services) {
      if (type && type.constructor) {
        const metadata: ListenerMetadata | undefined = Reflect.getMetadata(
          ListenerMetadataKey,
          type
        );
        if (metadata) {
          const instance = Container.get<{ destroy?: unknown }>(id as string);
          const { event, method } = metadata;
          super.addListener(event, method, instance);

          const defaultDestroy = instance.destroy;
          instance.destroy = (...args: unknown[]) => {
            super.removeListener(event, method, instance);
            if (typeof defaultDestroy === 'function') {
              defaultDestroy.call(type, ...args);
            }
          };
        }
      }
    }
  }
}

## Event Emitter <!-- {docsify-ignore-all} -->

`EventEmitter` extends from `Phaser.Events.EventEmitter` aims to act as global event controller

### Usage

You could inject `EventEmitter` by property/constructor based injection

```ts
import { Service, Inject } from 'typedi';
import { EventEmitter, EVENT } from '@/service/EventEmitter';

// remember to decorate with Service
@Service() // highlight-line
class SomeClass {
  constructor(private emitter: EventEmitter) /* highlight-line */ {
    emitter.on('RESIZE', this.handleSizeUpdate, this); // highlight-line
  }

  destroy() {
    // you may remove listener while instance destroy
    this.emitter.off('RESIZE', this.handleSizeUpdate, this); // highlight-line
  }

  trigger() {
    this.emitter.emit('SOME_EVENT'); // highlight-line
  }

  handleSizeUpdate() {
    // ...
  }
}
```

<br />

### Listener

`Listener` decorator is an alternative to inject the EventEmitter

```ts
import { Listener } from '@/decorators/Listener';

// remember to decorate with Service
@Service() // highlight-line
class SomeClass {
  @Listener('RESIZE') // highlight-line
  handleSizeUpdate() {
    // ...
  }
}
```

<br />

### New Event

To add a new event you must define and export the event name in this file. Otherwise, you can not pass the type checking.

```ts file=src/service/EventEmitter/events.ts
export const RESIZE = `RESIZE`;
// ....
export const SOME_EVENT = `SOME_EVENT`;
```

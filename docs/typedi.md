## TypeDI <!-- {docsify-ignore-all} -->

TypeDI is a [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) tool for TypeScript and JavaScript. With it you can build well-structured and easily testable applications in Node or in the browser.

### Usage

```ts
import { Container, Service } from 'typedi';

@Service() // highlight-line
class ExampleInjectedService {
  printMessage() {
    console.log('I am alive!');
  }
}

@Service() // highlight-line
class ExampleService {
  constructor(
    // because we annotated ExampleInjectedService with the @Service()
    // decorator TypeDI will automatically inject an instance of
    // ExampleInjectedService here when the ExampleService class is requested
    // from TypeDI.
    private injectedService: ExampleInjectedService // highlight-line
  ) {}
}

const serviceInstance = Container.get(ExampleService); // highlight-line
// we request an instance of ExampleService from TypeDI

serviceInstance.injectedService.printMessage();
// logs "I am alive!" to the console
```

For more details, look at the [Offcial Documentation](https://docs.typestack.community/typedi/). Even the section mark as `Old documentation` but still correct.

<br />

One thing that the document does not mention is the `destroy` function

```ts
@Service()
class ExampleService {
  destroy() { // highlight-line
    console.log('destroy)
  }
}
```

`destroy` function will be called when `Container.reset()` or `Container.remove(ExampleService)`. For example, `Game` in `src/service/Game.ts` is decorated by `@Service` and `Container.reset()` is called in `src/main.ts` and the current game will be destroy

<br />

Also, be careful [Circular Dependency](https://docs.typestack.community/typedi/#problem-with-circular-references)

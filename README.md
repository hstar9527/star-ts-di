# star-ts-di

**star-ts-di** is a lightweight dependency injection library for TypeScript.

## Quick Start

```ts
import { Injector, createIdentifier } from '../index';

interface ILogger {
  log(message: string): void;
}

const ILogger = createIdentifier<ILogger>('ILogger');

class ConsoleLogger implements ILogger {
  log(message: string) {
    console.log('ConsoleLogger实现', message);
  }
}

class MyService {
  constructor(@ILogger private logger: ILogger) {}

  log() {
    this.logger.log('MyService logging...');
  }
}

const injector = new Injector([[ILogger, { useClass: ConsoleLogger }], [MyService]]);

const myService = injector.get(MyService);

myService?.log();
```

## License

MIT. Copyright 2026-present hxx.

import { createIdentifier } from "../decorators";
import { Injector } from "../injector";

interface ILogger {
  log(message: string): void;
}

const ILogger = createIdentifier<ILogger>('ILogger');

class ConsoleLogger implements ILogger {
  log(message: string) { console.log('ConsoleLogger实现', message); }
}

class MyService {
  constructor(@ILogger private logger: ILogger) { }
}

const injector = new Injector([[ILogger, { useClass: ConsoleLogger }], [MyService]]);

const myService = injector.get(MyService)

console.log('myService', myService)
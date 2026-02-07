# star-ts-di


**star-ts-di** is a lightweight dependency injection library for TypeScript.

## Quick Start

```ts
// Define the log service interface
interface ILogService {
    log(msg: string): void;
}

// 创建日志服务的“身份证”（装饰器 + ID）
const ILogService = createDecorator<ILogService>('log');

// Implement the log service interface
class ConsoleLogService implements ILogService {
    log(msg: string) {
        console.log(`[LOG] ${msg}`);
    }
}

// Define configuration service
interface IConfigService {
    get(key: string): string;
}

const IConfigService = createDecorator<IConfigService>('config');

class EnvConfigService implements IConfigService {
    get(key: string) {
        return process.env[key] || 'default';
    }
}

// The main application class depends on the above two services
class MyApp {
    constructor(
        @ILogService private log: ILogService,
        @IConfigService private config: IConfigService
    ) { }

    run() {
        this.log.log('App started!');
        this.log.log(`DB_HOST = ${this.config.get('DB_HOST')}`);
    }
}

// 1. Create a service registry
const services = new ServiceCollection();

// 2. register service implementation
services.set(ILogService, ConsoleLogService);
services.set(IConfigService, EnvConfigService);

// 3. Create a di container
const di = new InstantiationService(services);

// 4. get a MyApp instance（自动注入依赖！）
const app = di.createInstance(MyApp);

// 5. run
app.run();
```

## License

MIT. Copyright 2026-present hxx.

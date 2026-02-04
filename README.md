# star-ts-di


**star-ts-di** is a lightweight dependency injection library for TypeScript.
                        |

## Quick Start

```ts
/ 定义日志服务接口
interface ILogService {
    log(msg: string): void;
}

// 创建日志服务的“身份证”（装饰器 + ID）
const ILogService = createDecorator<ILogService>('log');

// 实现日志服务
class ConsoleLogService implements ILogService {
    log(msg: string) {
        console.log(`[LOG] ${msg}`);
    }
}

// 定义配置服务
interface IConfigService {
    get(key: string): string;
}

const IConfigService = createDecorator<IConfigService>('config');

class EnvConfigService implements IConfigService {
    get(key: string) {
        return process.env[key] || 'default';
    }
}

// 主应用类，依赖上面两个服务
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

// 1. 创建服务注册表
const services = new ServiceCollection();

// 2. 注册服务实现
services.set(ILogService, ConsoleLogService);
services.set(IConfigService, EnvConfigService);

// 3. 创建 DI 容器
const di = new InstantiationService(services);

// 4. 创建 MyApp 实例（自动注入依赖！）
const app = di.createInstance(MyApp);

// 5. 运行
app.run();
```

## License

MIT. Copyright 2026-present hxx.

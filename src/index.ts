export * from './injector'
export * from "./decorators"
// =============== 【1. 装饰器工厂】===============
// const serviceIds = new Map<string, Function>();

// export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {
//     if (serviceIds.has(serviceId)) {
//         return serviceIds.get(serviceId)!;
//     }

//     // 这个函数既是装饰器，又是服务的唯一标识符（token）,propertyKey方法名
//     //target：
//     // 对于静态方法 → 构造函数（constructor）
//     // 对于实例方法 → 原型对象（MyClass.prototype）
//     const decorator = function (target: Function, propertyKey: string | symbol | undefined, index: number) {
//         if (arguments.length !== 3) {
//             throw new Error('@decorator 只能用于构造函数参数');
//         }
//         storeServiceDependency(decorator, target, index);
//     };

//     decorator.toString = () => serviceId; // 方便调试
//     serviceIds.set(serviceId, decorator);
//     return decorator as ServiceIdentifier<T>;
// }

// // 服务标识符类型（其实就是个函数）
// type ServiceIdentifier<T> = Function & { toString(): string };

// // =============== 【2. 依赖存储】===============
// const DI_TARGET = '$di$target';
// const DI_DEPENDENCIES = '$di$dependencies';

// function storeServiceDependency(id: Function, ctor: Function, index: number) {
//     if ((ctor as any)[DI_TARGET] === ctor) {
//         (ctor as any)[DI_DEPENDENCIES].push({ id, index });
//     } else {
//         //
//         (ctor as any)[DI_TARGET] = ctor;
//         (ctor as any)[DI_DEPENDENCIES] = [{ id, index }];
//     }
// }

// // =============== 【3. 服务注册表】===============
// class ServiceCollection {
//     private _services = new Map<Function, any>();

//     set<T>(id: ServiceIdentifier<T>, ctor: new (...args: any[]) => T): void {
//         this._services.set(id, ctor);
//     }

//     get<T>(id: ServiceIdentifier<T>): (new (...args: any[]) => T) | undefined {
//         return this._services.get(id);
//     }
// }

// // =============== 【4. 实例化服务容器】===============
// class InstantiationService {
//     // 跟踪正在实例化的服务链，用于检测循环依赖
//     private instantiationStack = new Set<Function>();

//     constructor(private services: ServiceCollection) { }

//     createInstance<T>(ctor: new (...args: any[]) => T): T {
//         // 检测循环依赖
//         if (this.instantiationStack.has(ctor)) {
//             throw new Error(`检测到循环依赖: 无法实例化服务。该服务正在被实例化的过程中。`);
//         }

//         // 标记当前服务正在实例化
//         this.instantiationStack.add(ctor);

//         try {
//             // 1. 获取这个类需要哪些依赖
//             const dependencies = (ctor as any)[DI_DEPENDENCIES] || [];

//             // 2. 按参数位置准备实参
//             const args: any[] = [];
//             for (const dep of dependencies) {
//                 const serviceCtor = this.services.get(dep.id);
//                 if (!serviceCtor) {
//                     throw new Error(`未注册服务: ${dep.id.toString()} (在 ${ctor.name} 中被引用)`);
//                 }
//                 // 递归创建依赖实例（支持嵌套依赖）
//                 args[dep.index] = this.createInstance(serviceCtor);
//             }

//             // 3. 创建实例
//             return new ctor(...args);
//         } finally {
//             // 实例化完成后清理标记
//             this.instantiationStack.delete(ctor);
//         }
//     }
// }

// // =============== 【5. 使用示例】===============

// // 定义日志服务接口
// interface ILogService {
//     log(msg: string): void;
// }

// // 创建日志服务的“身份证”（装饰器 + ID）
// const ILogService = createDecorator<ILogService>('log');

// // 实现日志服务
// class ConsoleLogService implements ILogService {
//     log(msg: string) {
//         console.log(`[LOG] ${msg}`);
//     }
// }

// // 定义配置服务
// interface IConfigService {
//     get(key: string): string;
// }

// const IConfigService = createDecorator<IConfigService>('config');

// class EnvConfigService implements IConfigService {
//     get(key: string) {
//         return process.env[key] || 'default';
//     }
// }

// class Hxxtest {
//     test() {
//         console.log('test1')
//     }
// }

// // 主应用类，依赖上面两个服务
// class MyApp {
//     constructor(
//         @ILogService private log: ILogService,
//         private hxxtest: Hxxtest,
//         @IConfigService private config: IConfigService
//     ) { }

//     run() {
//         this.log.log('App started!');
//         this.log.log(`DB_HOST = ${this.config.get('DB_HOST')}`);
//     }
// }

// // =============== 【6. 启动程序】===============

// // 1. 创建服务注册表
// const services = new ServiceCollection();

// // 2. 注册服务实现
// services.set(ILogService, ConsoleLogService);
// services.set(IConfigService, EnvConfigService);

// // 3. 创建 DI 容器
// const di = new InstantiationService(services);

// // 4. 创建 MyApp 实例（自动注入依赖！）
// const app = di.createInstance(MyApp);

// // 5. 运行
// app.run();

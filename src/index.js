"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDecorator = createDecorator;
__exportStar(require("./injector"), exports);
// =============== 【1. 装饰器工厂】===============
var serviceIds = new Map();
function createDecorator(serviceId) {
    if (serviceIds.has(serviceId)) {
        return serviceIds.get(serviceId);
    }
    // 这个函数既是装饰器，又是服务的唯一标识符（token）,propertyKey方法名
    //target：
    // 对于静态方法 → 构造函数（constructor）
    // 对于实例方法 → 原型对象（MyClass.prototype）
    var decorator = function (target, propertyKey, index) {
        if (arguments.length !== 3) {
            throw new Error('@decorator 只能用于构造函数参数');
        }
        storeServiceDependency(decorator, target, index);
    };
    decorator.toString = function () { return serviceId; }; // 方便调试
    serviceIds.set(serviceId, decorator);
    return decorator;
}
// =============== 【2. 依赖存储】===============
var DI_TARGET = '$di$target';
var DI_DEPENDENCIES = '$di$dependencies';
function storeServiceDependency(id, ctor, index) {
    if (ctor[DI_TARGET] === ctor) {
        ctor[DI_DEPENDENCIES].push({ id: id, index: index });
    }
    else {
        //
        ctor[DI_TARGET] = ctor;
        ctor[DI_DEPENDENCIES] = [{ id: id, index: index }];
    }
}
// =============== 【3. 服务注册表】===============
var ServiceCollection = /** @class */ (function () {
    function ServiceCollection() {
        this._services = new Map();
    }
    ServiceCollection.prototype.set = function (id, ctor) {
        this._services.set(id, ctor);
    };
    ServiceCollection.prototype.get = function (id) {
        return this._services.get(id);
    };
    return ServiceCollection;
}());
// =============== 【4. 实例化服务容器】===============
var InstantiationService = /** @class */ (function () {
    function InstantiationService(services) {
        this.services = services;
        // 跟踪正在实例化的服务链，用于检测循环依赖
        this.instantiationStack = new Set();
    }
    InstantiationService.prototype.createInstance = function (ctor) {
        // 检测循环依赖
        if (this.instantiationStack.has(ctor)) {
            throw new Error("\u68C0\u6D4B\u5230\u5FAA\u73AF\u4F9D\u8D56: \u65E0\u6CD5\u5B9E\u4F8B\u5316\u670D\u52A1\u3002\u8BE5\u670D\u52A1\u6B63\u5728\u88AB\u5B9E\u4F8B\u5316\u7684\u8FC7\u7A0B\u4E2D\u3002");
        }
        // 标记当前服务正在实例化
        this.instantiationStack.add(ctor);
        try {
            // 1. 获取这个类需要哪些依赖
            var dependencies = ctor[DI_DEPENDENCIES] || [];
            // 2. 按参数位置准备实参
            var args = [];
            for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
                var dep = dependencies_1[_i];
                var serviceCtor = this.services.get(dep.id);
                if (!serviceCtor) {
                    throw new Error("\u672A\u6CE8\u518C\u670D\u52A1: ".concat(dep.id.toString(), " (\u5728 ").concat(ctor.name, " \u4E2D\u88AB\u5F15\u7528)"));
                }
                // 递归创建依赖实例（支持嵌套依赖）
                args[dep.index] = this.createInstance(serviceCtor);
            }
            // 3. 创建实例
            return new (ctor.bind.apply(ctor, __spreadArray([void 0], args, false)))();
        }
        finally {
            // 实例化完成后清理标记
            this.instantiationStack.delete(ctor);
        }
    };
    return InstantiationService;
}());
// 创建日志服务的“身份证”（装饰器 + ID）
var ILogService = createDecorator('log');
// 实现日志服务
var ConsoleLogService = /** @class */ (function () {
    function ConsoleLogService() {
    }
    ConsoleLogService.prototype.log = function (msg) {
        console.log("[LOG] ".concat(msg));
    };
    return ConsoleLogService;
}());
var IConfigService = createDecorator('config');
var EnvConfigService = /** @class */ (function () {
    function EnvConfigService() {
    }
    EnvConfigService.prototype.get = function (key) {
        return process.env[key] || 'default';
    };
    return EnvConfigService;
}());
var Hxxtest = /** @class */ (function () {
    function Hxxtest() {
    }
    Hxxtest.prototype.test = function () {
        console.log('test1');
    };
    return Hxxtest;
}());
// 主应用类，依赖上面两个服务
var MyApp = /** @class */ (function () {
    function MyApp(log, hxxtest, config) {
        this.log = log;
        this.hxxtest = hxxtest;
        this.config = config;
    }
    MyApp.prototype.run = function () {
        this.log.log('App started!');
        this.log.log("DB_HOST = ".concat(this.config.get('DB_HOST')));
    };
    return MyApp;
}());
// =============== 【6. 启动程序】===============
// 1. 创建服务注册表
var services = new ServiceCollection();
// 2. 注册服务实现
services.set(ILogService, ConsoleLogService);
services.set(IConfigService, EnvConfigService);
// 3. 创建 DI 容器
var di = new InstantiationService(services);
// 4. 创建 MyApp 实例（自动注入依赖！）
var app = di.createInstance(MyApp);
// 5. 运行
app.run();

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Injector = void 0;
var decorators_1 = require("./decorators");
var dependencyCollection_1 = require("./dependencyCollection");
var error_1 = require("./error");
var NotInstantiatedSymbol = Symbol('$$NOT_INSTANTIATED_SYMBOL');
var Injector = /** @class */ (function () {
    function Injector(dependencies) {
        this.disposed = false;
        this.dependencyCollection = new dependencyCollection_1.DependencyCollection(dependencies || []);
        this.resolvedDependencyCollection = new dependencyCollection_1.ResolvedDependencyCollection();
    }
    Injector.prototype.get = function (id) {
        this._ensureInjectorNotDisposed();
        var newResult = this._get(id);
        return newResult;
    };
    Injector.prototype._get = function (id) {
        var cachedResult = this._getValue(id);
        if (cachedResult !== NotInstantiatedSymbol) {
            return cachedResult;
        }
        var thing = this.createDependency(id);
        this.resolvedDependencyCollection.add(id, thing);
        return thing;
    };
    Injector.prototype._getValue = function (id) {
        if (this.resolvedDependencyCollection.has(id)) {
            return this.resolvedDependencyCollection.get(id);
        }
        return NotInstantiatedSymbol;
    };
    Injector.prototype.createDependency = function (id) {
        var registrations = this.dependencyCollection.get(id);
        console.log(registrations);
        var Ctor = registrations.useClass;
        //查找构造器需要被注入的依赖
        var declaredDependencies = (0, decorators_1.getDependencies)(Ctor)
            .sort(function (a, b) { return a.paramIndex - b.paramIndex; });
        //存储构造器所需参数
        var resolvedArgs = [];
        for (var _i = 0, declaredDependencies_1 = declaredDependencies; _i < declaredDependencies_1.length; _i++) {
            var dep = declaredDependencies_1[_i];
            var thing = this._get(dep);
            resolvedArgs.push(thing);
        }
        return new (Ctor.bind.apply(Ctor, __spreadArray([void 0], resolvedArgs, false)))();
    };
    Injector.prototype.dispose = function () {
        throw new Error("Method not implemented.");
    };
    Injector.prototype._ensureInjectorNotDisposed = function () {
        if (this.disposed) {
            throw new InjectorAlreadyDisposedError();
        }
    };
    return Injector;
}());
exports.Injector = Injector;
var InjectorAlreadyDisposedError = /** @class */ (function (_super) {
    __extends(InjectorAlreadyDisposedError, _super);
    function InjectorAlreadyDisposedError() {
        return _super.call(this, 'Injector cannot be accessed after it was disposed.') || this;
    }
    return InjectorAlreadyDisposedError;
}(error_1.StarDiError));

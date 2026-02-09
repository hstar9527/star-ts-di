"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvedDependencyCollection = exports.DependencyCollection = void 0;
var dispose_1 = require("./dispose");
var DependencyCollection = /** @class */ (function () {
    function DependencyCollection(dependencies) {
        var _this = this;
        this.dependencyMap = new Map();
        dependencies.forEach(function (dependency) {
            _this.add(dependency[0], dependency[1]);
        });
    }
    DependencyCollection.prototype.add = function (ctorOrId, val) {
        if (typeof val === 'undefined') {
            val = { useClass: ctorOrId };
        }
        this.dependencyMap.set(ctorOrId, val);
    };
    DependencyCollection.prototype.get = function (id) {
        return this.dependencyMap.get(id);
    };
    DependencyCollection.prototype.dispose = function () {
        throw new Error("Method not implemented.");
    };
    return DependencyCollection;
}());
exports.DependencyCollection = DependencyCollection;
var ResolvedDependencyCollection = /** @class */ (function () {
    function ResolvedDependencyCollection() {
        this.resolvedDependencies = new Map();
    }
    ResolvedDependencyCollection.prototype.add = function (id, val) {
        this.resolvedDependencies.set(id, val);
    };
    ResolvedDependencyCollection.prototype.has = function (id) {
        return this.resolvedDependencies.has(id);
    };
    ResolvedDependencyCollection.prototype.get = function (id) {
        return this.resolvedDependencies.get(id);
    };
    ResolvedDependencyCollection.prototype.dispose = function () {
        Array.from(this.resolvedDependencies.values()).forEach(function (items) {
            items.forEach(function (item) { return (0, dispose_1.isDisposable)(item) ? item.dispose() : void 0; });
        });
        this.resolvedDependencies.clear();
    };
    return ResolvedDependencyCollection;
}());
exports.ResolvedDependencyCollection = ResolvedDependencyCollection;

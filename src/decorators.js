"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEPENDENCIES = void 0;
exports.getDependencies = getDependencies;
exports.DEPENDENCIES = Symbol('$$DEPENDENCIES');
function getDependencies(registerTarget) {
    var target = registerTarget;
    return target[exports.DEPENDENCIES] || [];
}

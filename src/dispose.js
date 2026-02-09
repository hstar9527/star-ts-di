"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDisposable = isDisposable;
function isDisposable(thing) {
    return !!thing && typeof thing.dispose === 'function';
}

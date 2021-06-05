"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = void 0;
function clamp(min, val, max) {
    return Math.min(Math.max(val, min), max);
}
exports.clamp = clamp;

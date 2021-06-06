"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = void 0;
const chronos = require("./chronos");
class Calendar {
    constructor(dateTimeIterator = new chronos.DateTimeIterator()) {
        this.dateTimeIterator = dateTimeIterator;
    }
}
exports.Calendar = Calendar;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposedCalendar = exports.WeekCalendar = exports.BasicCalendar = exports.Calendar = void 0;
const chronos = require("./chronos");
class Calendar {
    constructor(dateTimeIterator = new chronos.DateTimeIterator()) {
        this.dateTimeIterator = dateTimeIterator;
    }
}
exports.Calendar = Calendar;
class BasicCalendar extends Calendar {
    basicCompute(startingDate, endingDate, action) {
        super.dateTimeIterator.iterate(startingDate, endingDate, action);
    }
}
exports.BasicCalendar = BasicCalendar;
class WeekCalendar extends BasicCalendar {
    compute() {
        chronos.cloneDateObject(super.dateTimeIterator.referenceDate);
    }
}
exports.WeekCalendar = WeekCalendar;
class ComposedCalendar extends Calendar {
}
exports.ComposedCalendar = ComposedCalendar;

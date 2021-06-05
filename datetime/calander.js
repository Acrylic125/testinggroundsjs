"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateIterator = exports.DateWrapper = exports.getDayAsString = exports.DAY_UNIX_TIME_MS = void 0;
const utils = require("../utils");
exports.DAY_UNIX_TIME_MS = 86400000;
function getDayAsString(day, trimmed) {
    switch (day) {
        case 0:
            return (trimmed) ? 'Sun' : 'Sunday';
        case 1:
            return (trimmed) ? 'Mon' : 'Monday';
        case 2:
            return (trimmed) ? 'Tue' : 'Tuesday';
        case 3:
            return (trimmed) ? 'Wed' : 'Wednesday';
        case 4:
            return (trimmed) ? 'Thur' : 'Thursday';
        case 5:
            return (trimmed) ? 'Fri' : 'Friday';
        case 6:
            return (trimmed) ? 'Sat' : 'Saturday';
        default:
            throw new RangeError(day + ' is an unsupported day.');
    }
}
exports.getDayAsString = getDayAsString;
class DateWrapper {
    constructor(date = new Date()) {
        this.date = date;
    }
    getDayAsString(trimmed) {
        return getDayAsString(this.getDay(), trimmed);
    }
    getDay() {
        return this.date.getDay();
    }
    setDay(day) {
        this.date.setTime(this.date.getTime() - ((this.getDay() - day) * exports.DAY_UNIX_TIME_MS));
    }
    isWeekday() {
        var day = this.date.getDay();
        return day > 0 && day < 6;
    }
    isWeekend() {
        return !this.isWeekday();
    }
    isEqualTo(date) {
        if (date.constructor === DateWrapper) {
            return this.date.getTime() === date.date.getTime();
        }
        else if (date.constructor === Date) {
            return this.date.getTime() === date.getTime();
        }
        else {
            return false;
        }
    }
    clone() {
        var newDate = new Date();
        newDate.setTime(this.date.getTime());
        return new DateWrapper(newDate);
    }
}
exports.DateWrapper = DateWrapper;
class DateIterator {
    constructor(referenceDate = new Date()) {
        // Should a new date object be created for each iteration?
        this.createNewDateObject = false;
        // What time should the date object be? -1 for the current time.
        this.timeOfDay = -1;
        // When should the date iterator start? null for the default start.
        this.dateToStartFrom = null;
        // When should the date iterator end? null for the default end.
        this.dateToEnd = null;
        // How much time should the iterator increment by.
        this.timeIncrement = exports.DAY_UNIX_TIME_MS;
        this.referenceDate = referenceDate;
        console.log(utils.clamp(3, 6, 1));
    }
    setIncrementByDays(days) {
        this.timeIncrement = days * exports.DAY_UNIX_TIME_MS;
    }
    iterate(action) {
    }
}
exports.DateIterator = DateIterator;

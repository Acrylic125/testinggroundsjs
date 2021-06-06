"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeIterator = exports.DateTimeCursor = exports.DateWrapper = exports.setTimeOfDay = exports.cloneDateObject = exports.isDateLaterOrEqual = exports.isDateLater = exports.isDateEarlierOrEqual = exports.isDateEarlier = exports.isDateEqual = exports.getTime = exports.getDayAsString = exports.validateDay = exports.DAY_TO_MS = exports.HOUR_TO_MS = exports.MINS_TO_MS = exports.SECONDS_TO_MS = void 0;
const utils = require("../utils");
exports.SECONDS_TO_MS = 1000;
exports.MINS_TO_MS = 60 * exports.SECONDS_TO_MS;
exports.HOUR_TO_MS = 60 * exports.MINS_TO_MS;
exports.DAY_TO_MS = 24 * exports.HOUR_TO_MS;
function validateDay(day) {
    if (day < 0 || day > 6)
        throw new RangeError(day + ' is not a valid day. (Sunday = 0 to Saturday = 6)');
}
exports.validateDay = validateDay;
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
function getTime(date) {
    console.log(date.getTime());
    return date.getTime();
}
exports.getTime = getTime;
function isDateEqual(date, compareWith) {
    return getTime(date) === getTime(compareWith);
}
exports.isDateEqual = isDateEqual;
function isDateEarlier(date, compareWith) {
    return getTime(date) < getTime(compareWith);
}
exports.isDateEarlier = isDateEarlier;
function isDateEarlierOrEqual(date, compareWith) {
    return getTime(date) <= getTime(compareWith);
}
exports.isDateEarlierOrEqual = isDateEarlierOrEqual;
function isDateLater(date, compareWith) {
    return !isDateEarlierOrEqual(date, compareWith);
}
exports.isDateLater = isDateLater;
function isDateLaterOrEqual(date, compareWith) {
    return !isDateEarlier(date, compareWith);
}
exports.isDateLaterOrEqual = isDateLaterOrEqual;
function cloneDateObject(date) {
    var newDate = new Date();
    newDate.setTime(getTime(date));
    return newDate;
}
exports.cloneDateObject = cloneDateObject;
function setTimeOfDay(date, time) {
    var realDateObject = (date instanceof DateWrapper) ? date.date : date;
    realDateObject.setHours(0);
    realDateObject.setMinutes(0);
    realDateObject.setSeconds(0);
    realDateObject.setMilliseconds(time);
}
exports.setTimeOfDay = setTimeOfDay;
class DateWrapper {
    constructor(date = new Date()) {
        this.date = date;
    }
    getDayAsString(trimmed = false) {
        return getDayAsString(this.getDay(), trimmed);
    }
    getTime() {
        return this.date.getTime();
    }
    setTime(time) {
        this.date.setTime(time);
    }
    getDay() {
        return this.date.getDay();
    }
    setDay(day) {
        this.date.setTime(this.getTime() - ((this.getDay() - day) * exports.DAY_TO_MS));
    }
    getDayTime() {
        return (this.date.getHours() * exports.HOUR_TO_MS) + (this.date.getMinutes() * exports.MINS_TO_MS) +
            (this.date.getSeconds() * exports.SECONDS_TO_MS) + this.date.getMilliseconds();
    }
    setDayTime(time) {
        setTimeOfDay(this, time);
    }
    isWeekday() {
        var day = this.date.getDay();
        return day > 0 && day < 6;
    }
    isWeekend() {
        return !this.isWeekday();
    }
    isTheSameDayAs(date) {
        if (date instanceof DateWrapper) {
            return this.date.getDate() === date.date.getDate();
        }
        else if (date instanceof Date) {
            return this.getTime() === date.getTime();
        }
        else {
            return false;
        }
    }
    isEqualTo(date) {
        return isDateEqual(this, date);
    }
    clone() {
        return new DateWrapper(cloneDateObject(this));
    }
}
exports.DateWrapper = DateWrapper;
class DateTimeCursor {
    constructor(iterator, dateToStartFrom, dateToEndTo, action) {
        this.iterator = iterator;
        this.dateToStartFrom = dateToStartFrom;
        this.dateToEndTo = dateToEndTo;
        this.action = action;
        this.cursor = new DateWrapper(cloneDateObject(dateToStartFrom));
        this.validateUse();
    }
    hasNext() {
        return this.cursor.getTime() <= this.dateToEndTo.getTime();
    }
    next() {
        if (this.iterator.timeOfDay !== -1)
            this.cursor.setDayTime(this.iterator.timeOfDay);
        this.action(this, this.cursor);
        if (this.iterator.createNewDateObject)
            this.cursor = this.cursor.clone();
        this.cursor.setTime(this.cursor.getTime() + this.iterator.timeIncrement);
    }
    validateUse() {
        if (this.dateToStartFrom.getTime() > this.dateToEndTo.getTime())
            throw new Error('The start from date must be earlier than the end to date.');
        if (this.iterator.timeIncrement < 0)
            throw new Error('The time increment must be greater than or equal to 0.');
    }
}
exports.DateTimeCursor = DateTimeCursor;
class DateTimeIterator {
    constructor(referenceDate = new Date()) {
        // Should a new date object be created for each iteration?
        this.createNewDateObject = false;
        // What time should the date object be (0ms to 86,400,000ms)? -1 for the current time.
        this.timeOfDay = -1;
        // How much time should the iterator increment by.
        this.timeIncrement = exports.DAY_TO_MS;
        this.referenceDate = referenceDate;
        console.log(utils.clamp(3, 6, 1));
    }
    setIncrementByDays(days) {
        this.timeIncrement = days * exports.DAY_TO_MS;
    }
    iterate(dateToStartFrom, dateToEndTo, action) {
        var cursor = this.createDateTimeCursor(dateToStartFrom, dateToEndTo, action);
        do {
            cursor.next();
        } while (cursor.hasNext());
    }
    createDateTimeCursor(dateToStartFrom, dateToEndTo, action) {
        return new DateTimeCursor(this, dateToStartFrom, dateToEndTo, action);
    }
}
exports.DateTimeIterator = DateTimeIterator;

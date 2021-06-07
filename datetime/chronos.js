"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeIterator = exports.DateTimeCursor = exports.setDay = exports.setTimeOfDay = exports.getTimeOfDay = exports.cloneDateObject = exports.isWeekend = exports.isWeekday = exports.isDateLaterOrEqual = exports.isDateLater = exports.isDateEarlierOrEqual = exports.isDateEarlier = exports.isDateEqual = exports.removeWeek = exports.addWeek = exports.removeTime = exports.addTime = exports.setTime = exports.getTime = exports.getDayAsString = exports.validateDay = exports.Time = exports.Day = void 0;
const utils = require("../utils");
var Day;
(function (Day) {
    Day[Day["SUNDAY"] = 0] = "SUNDAY";
    Day[Day["MONDAY"] = 1] = "MONDAY";
    Day[Day["TUESDAY"] = 2] = "TUESDAY";
    Day[Day["WEDNESDAY"] = 3] = "WEDNESDAY";
    Day[Day["THURSDAY"] = 4] = "THURSDAY";
    Day[Day["FRIDAY"] = 5] = "FRIDAY";
    Day[Day["SATURDAY"] = 6] = "SATURDAY";
})(Day = exports.Day || (exports.Day = {}));
var Time;
(function (Time) {
    Time[Time["MILLISECONDS"] = 1] = "MILLISECONDS";
    Time[Time["SECONDS"] = 1000] = "SECONDS";
    Time[Time["MINUTES"] = 60000] = "MINUTES";
    Time[Time["HOUR"] = 3600000] = "HOUR";
    Time[Time["DAY"] = 86400000] = "DAY";
    Time[Time["WEEK"] = 604800000] = "WEEK";
})(Time = exports.Time || (exports.Time = {}));
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
    return date.getTime();
}
exports.getTime = getTime;
function setTime(date, time) {
    date.setTime(time);
}
exports.setTime = setTime;
function addTime(date, time) {
    date.setTime(date.getTime() + time);
}
exports.addTime = addTime;
function removeTime(date, time) {
    date.setTime(date.getTime() - time);
}
exports.removeTime = removeTime;
function addWeek(date, weeks) {
    addTime(date, Time.WEEK);
}
exports.addWeek = addWeek;
function removeWeek(date, weeks) {
    addWeek(date, -weeks);
}
exports.removeWeek = removeWeek;
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
function isWeekday(date) {
    var day = date.getDay();
    return day > 0 && day < 6;
}
exports.isWeekday = isWeekday;
function isWeekend(date) {
    return !isWeekday(date);
}
exports.isWeekend = isWeekend;
function cloneDateObject(date) {
    var newDate = new Date();
    newDate.setTime(getTime(date));
    return newDate;
}
exports.cloneDateObject = cloneDateObject;
function getTimeOfDay(date) {
    return (date.getHours() * Time.HOUR) + (date.getMinutes() * Time.MINUTES) +
        (date.getSeconds() * Time.SECONDS) + date.getMilliseconds();
}
exports.getTimeOfDay = getTimeOfDay;
function setTimeOfDay(date, time) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(time);
}
exports.setTimeOfDay = setTimeOfDay;
function setDay(date, day) {
    date.setTime(date.getTime() - ((date.getDay() - day) * Time.DAY));
}
exports.setDay = setDay;
class DateTimeCursor {
    constructor(iterator, dateToStartFrom, dateToEndTo, action) {
        this.iterator = iterator;
        this.dateToStartFrom = dateToStartFrom;
        this.dateToEndTo = dateToEndTo;
        this.action = action;
        this.cursor = new Date(cloneDateObject(dateToStartFrom));
        this.validateUse();
    }
    hasNext() {
        return this.cursor.getTime() <= this.dateToEndTo.getTime();
    }
    next() {
        if (this.iterator.timeOfDay !== -1)
            setTimeOfDay(this.cursor, this.iterator.timeOfDay);
        this.action(this, this.cursor);
        if (this.iterator.createNewDateObject)
            this.cursor = cloneDateObject(this.cursor);
        addTime(this.cursor, this.iterator.timeIncrement);
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
        this.timeIncrement = Time.DAY;
        this.referenceDate = referenceDate;
        console.log(utils.clamp(3, 6, 1));
    }
    setIncrementByDays(days) {
        this.timeIncrement = days * Time.DAY;
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

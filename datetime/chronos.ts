import utils = require('../utils');

export const SECONDS_TO_MS = 1_000;
export const MINS_TO_MS = 60 * SECONDS_TO_MS;
export const HOUR_TO_MS = 60 * MINS_TO_MS;
export const DAY_TO_MS = 24 * HOUR_TO_MS;

export function validateDay(day: number) {
    if (day < 0 || day > 6) 
        throw new RangeError(day + ' is not a valid day. (Sunday = 0 to Saturday = 6)');
}

export function getDayAsString(day: number, trimmed: boolean): string {
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

export function getTime(date: Date | DateWrapper) {
    console.log(date.getTime());
    return date.getTime();
}

export function isDateEqual(date: Date | DateWrapper, compareWith: Date | DateWrapper) {
    return getTime(date) === getTime(compareWith);
}

export function isDateEarlier(date: Date | DateWrapper, compareWith: Date | DateWrapper) {
    return getTime(date) < getTime(compareWith);
}

export function isDateEarlierOrEqual(date: Date | DateWrapper, compareWith: Date | DateWrapper) {
    return getTime(date) <= getTime(compareWith);
}

export function isDateLater(date: Date | DateWrapper, compareWith: Date | DateWrapper) {
    return !isDateEarlierOrEqual(date, compareWith);
}

export function isDateLaterOrEqual(date: Date | DateWrapper, compareWith: Date | DateWrapper) {
    return !isDateEarlier(date, compareWith);
}

export function cloneDateObject(date: Date | DateWrapper): Date {
    var newDate = new Date();
    newDate.setTime(getTime(date));
    return newDate;
}

export function setTimeOfDay(date: Date | DateWrapper, time: number) {
    var realDateObject = (date instanceof DateWrapper) ? (<DateWrapper> date).date : <Date> date;
    realDateObject.setHours(0);
    realDateObject.setMinutes(0);
    realDateObject.setSeconds(0);
    realDateObject.setMilliseconds(time);
}

export class DateWrapper {

    date: Date;

    constructor(date: Date = new Date()) {
        this.date = date;
    }

    getDayAsString(trimmed = false): string {
        return getDayAsString(this.getDay(), trimmed);
    }

    getTime(): number {
        return this.date.getTime();
    }

    setTime(time: number) {
        this.date.setTime(time);
    }

    getDay(): number {
        return this.date.getDay();
    }

    setDay(day: number) {
        this.date.setTime(this.getTime() - ((this.getDay() - day) * DAY_TO_MS))
    }
    
    getDayTime(): number {
        return (this.date.getHours() * HOUR_TO_MS) + (this.date.getMinutes() * MINS_TO_MS) + 
                (this.date.getSeconds() * SECONDS_TO_MS) + this.date.getMilliseconds();
    }

    setDayTime(time: number) {
        setTimeOfDay(this, time);
    }

    isWeekday(): boolean {
        var day = this.date.getDay();
        return day > 0 && day < 6;
    }

    isWeekend(): boolean {
        return !this.isWeekday();
    }

    isTheSameDayAs(date: Date | DateWrapper): boolean {
        if (date instanceof DateWrapper) {
            return this.date.getDate() === date.date.getDate();
        } else if (date instanceof Date) {
            return this.getTime() === date.getTime();
        } else {
            return false;
        }
    }

    isEqualTo(date: Date | DateWrapper): boolean {
        return isDateEqual(this, date);
    }

    clone(): DateWrapper {
        return new DateWrapper(cloneDateObject(this));
    }

}

export interface DateCursorAction {
    (DateTimeCursor: DateTimeCursor, DateWrapper: DateWrapper): void;
}

export class DateTimeCursor {

    readonly iterator: DateTimeIterator;
    readonly dateToStartFrom: Date;
    readonly dateToEndTo: Date;
    readonly action: DateCursorAction;
    cursor: DateWrapper;
    
    constructor(iterator: DateTimeIterator, dateToStartFrom: Date, dateToEndTo: Date, action: DateCursorAction) {
        this.iterator = iterator;
        this.dateToStartFrom = dateToStartFrom;
        this.dateToEndTo = dateToEndTo;
        this.action = action;
        this.cursor = new DateWrapper(cloneDateObject(dateToStartFrom));
        this.validateUse();
    }

    hasNext(): boolean {
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

    private validateUse() {
        if (this.dateToStartFrom.getTime() > this.dateToEndTo.getTime())
            throw new Error('The start from date must be earlier than the end to date.');
        if (this.iterator.timeIncrement < 0) 
            throw new Error('The time increment must be greater than or equal to 0.');
    }
}

export class DateTimeIterator {

    readonly referenceDate: Date;
    // Should a new date object be created for each iteration?
    createNewDateObject = false;
    // What time should the date object be (0ms to 86,400,000ms)? -1 for the current time.
    timeOfDay = -1;
    // How much time should the iterator increment by.
    timeIncrement = DAY_TO_MS;

    constructor(referenceDate: Date = new Date()) {
        this.referenceDate = referenceDate;
        console.log(utils.clamp(3, 6, 1));
    }

    setIncrementByDays(days: number) {
        this.timeIncrement = days * DAY_TO_MS;
    }

    iterate(dateToStartFrom: Date, dateToEndTo: Date, action: DateCursorAction) {
        var cursor = this.createDateTimeCursor(dateToStartFrom, dateToEndTo, action);
        do {
            cursor.next();
        } while (cursor.hasNext());
    }

    createDateTimeCursor(dateToStartFrom: Date, dateToEndTo: Date, action: DateCursorAction): DateTimeCursor {
        return new DateTimeCursor(this, dateToStartFrom, dateToEndTo, action);
    }

}

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
        this.date.setHours(0);
        this.date.setMinutes(0);
        this.date.setSeconds(0);
        this.date.setMilliseconds(time);
    }

    isWeekday(): boolean {
        var day = this.date.getDay();
        return day > 0 && day < 6;
    }

    isWeekend(): boolean {
        return !this.isWeekday();
    }

    isEqualTo(date: Date | DateWrapper): boolean {
        if (date.constructor === DateWrapper) {
            return this.getTime() === date.date.getTime();
        } else if (date.constructor === Date) {
            return this.getTime() === date.getTime();
        } else {
            return false;
        }
    }

    clone(): DateWrapper {
        var newDate = new Date();
        newDate.setTime(this.getTime());
        return new DateWrapper(newDate);
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

    validateUse(dateToStartFrom: Date, dateToEndTo: Date) {
        if (dateToStartFrom.getTime() > dateToEndTo.getTime())
            throw new Error('The start from date must be earlier than the end to date.');
        if (this.timeIncrement < 0) 
            throw new Error('The time increment must be greater than or equal to 0.');
    }

    iterate(dateToStartFrom: Date, dateToEndTo: Date, action: (DateWrapper: DateWrapper) => void) {
        this.validateUse(dateToStartFrom, dateToEndTo);
        var cursor = new DateWrapper(dateToStartFrom);
        do {
            if (this.timeOfDay !== -1) 
                cursor.setDayTime(this.timeOfDay);
            action(cursor);
            if (this.createNewDateObject)
                cursor = cursor.clone();
            cursor.setTime(cursor.getTime() + this.timeIncrement)
        } while (cursor.getTime() <= dateToEndTo.getTime());
    }

}

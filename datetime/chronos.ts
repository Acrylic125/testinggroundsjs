import utils = require('../utils');

export enum Day {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}

export enum Time {
    MILLISECONDS = 1,
    SECONDS = 1000,
    MINUTES = SECONDS * 60,
    HOUR = MINUTES * 60,
    DAY = HOUR * 24,
    WEEK = DAY * 7
}

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

export function getTime(date: Date): number {
    return date.getTime();
}

export function setTime(date: Date, time: number) {
    date.setTime(time);
}

export function addTime(date: Date, time: number) {
    date.setTime(date.getTime() + time);
}

export function removeTime(date: Date, time: number) {
    date.setTime(date.getTime() - time);
}

export function addWeek(date: Date, weeks: number) {
    addTime(date, Time.WEEK);
}

export function removeWeek(date: Date, weeks: number) {
    addWeek(date, -weeks);
}

export function isDateEqual(date: Date, compareWith: Date): boolean {
    return getTime(date) === getTime(compareWith);
}

export function isDateEarlier(date: Date, compareWith: Date): boolean {
    return getTime(date) < getTime(compareWith);
}

export function isDateEarlierOrEqual(date: Date, compareWith: Date): boolean {
    return getTime(date) <= getTime(compareWith);
}

export function isDateLater(date: Date, compareWith: Date): boolean {
    return !isDateEarlierOrEqual(date, compareWith);
}

export function isDateLaterOrEqual(date: Date, compareWith: Date): boolean {
    return !isDateEarlier(date, compareWith);
}

export function isWeekday(date: Date): boolean {
    var day = date.getDay();
    return day > 0 && day < 6;
}

export function isWeekend(date: Date): boolean {
    return !isWeekday(date);
}

export function cloneDateObject(date: Date): Date {
    var newDate = new Date();
    newDate.setTime(getTime(date));
    return newDate;
}

export function getTimeOfDay(date: Date): number {
    return (date.getHours() * Time.HOUR) + (date.getMinutes() * Time.MINUTES) +
            (date.getSeconds() * Time.SECONDS) + date.getMilliseconds();
}

export function setTimeOfDay(date: Date, time: number) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(time);
}

export function setDay(date: Date, day: number) {
    date.setTime(date.getTime() - ((date.getDay() - day) * Time.DAY))
}

export interface DateCursorAction {
    (dateTimeCursor: DateTimeCursor, date: Date): void;
}

export class DateTimeCursor {

    readonly iterator: DateTimeIterator;
    readonly dateToStartFrom: Date;
    readonly dateToEndTo: Date;
    readonly action: DateCursorAction;
    cursor: Date;
    
    constructor(iterator: DateTimeIterator, dateToStartFrom: Date, dateToEndTo: Date, action: DateCursorAction) {
        this.iterator = iterator;
        this.dateToStartFrom = dateToStartFrom;
        this.dateToEndTo = dateToEndTo;
        this.action = action;
        this.cursor = new Date(cloneDateObject(dateToStartFrom));
        this.validateUse();
    }

    hasNext(): boolean {
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
    timeIncrement = Time.DAY;

    constructor(referenceDate: Date = new Date()) {
        this.referenceDate = referenceDate;
        console.log(utils.clamp(3, 6, 1));
    }

    setIncrementByDays(days: number) {
        this.timeIncrement = days * Time.DAY;
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

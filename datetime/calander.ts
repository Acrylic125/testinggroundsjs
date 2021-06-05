import utils = require('../utils');

export const DAY_UNIX_TIME_MS = 86_400_000;

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

    getDayAsString(trimmed: boolean): string {
        return getDayAsString(this.getDay(), trimmed);
    }

    getDay(): number {
        return this.date.getDay();
    }

    setDay(day: number) {
        this.date.setTime(this.date.getTime() - ((this.getDay() - day) * DAY_UNIX_TIME_MS))
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
            return this.date.getTime() === date.date.getTime();
        } else if (date.constructor === Date) {
            return this.date.getTime() === date.getTime();
        } else {
            return false;
        }
    }

    clone(): DateWrapper {
        var newDate = new Date();
        newDate.setTime(this.date.getTime());
        return new DateWrapper(newDate);
    }

}

export class DateIterator {

    readonly referenceDate: Date;
    // Should a new date object be created for each iteration?
    createNewDateObject = false;
    // What time should the date object be? -1 for the current time.
    timeOfDay = -1;
    // When should the date iterator start? null for the default start.
    dateToStartFrom: Date | null = null;
    // When should the date iterator end? null for the default end.
    dateToEnd: Date | null = null;
    // How much time should the iterator increment by.
    timeIncrement = DAY_UNIX_TIME_MS;

    constructor(referenceDate: Date = new Date()) {
        this.referenceDate = referenceDate;
        console.log(utils.clamp(3, 6, 1));
    }

    setIncrementByDays(days: number) {
        this.timeIncrement = days * DAY_UNIX_TIME_MS;
    }

    iterate(action: (DateWrapper: DateWrapper) => {}) {

    }

}

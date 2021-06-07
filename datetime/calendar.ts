import chronos = require('./chronos');

function transformToWeekStartAndEnd(firstDay: number, startingDate: Date, endingDate: Date) {
    chronos.setDayOfWeek(startingDate, firstDay);
    chronos.setDayOfWeek(endingDate, (firstDay + 6) % 7);
    if (firstDay > chronos.Day.SUNDAY) 
        chronos.addWeek(endingDate, 1);
}

export abstract class Calendar {
    dateTimeIterator: chronos.DateTimeIterator;
    firstDay = chronos.Day.SUNDAY;

    constructor(dateTimeIterator = new chronos.DateTimeIterator()) {
        this.dateTimeIterator = dateTimeIterator;
    }

    abstract compute(action: (dateTimeCursor: chronos.DateTimeCursor, date: Date) => void): void;
}

export class WeekCalendar extends Calendar {

    getStartEndDatesOfWeek() {
        var startingDate = chronos.cloneDateObject(this.dateTimeIterator.referenceDate);
        var endingDate = chronos.cloneDateObject(this.dateTimeIterator.referenceDate);
        transformToWeekStartAndEnd(this.firstDay, startingDate, endingDate);
        return { startingDate, endingDate };
    }

    compute(action: (dateTimeCursor: chronos.DateTimeCursor, date: Date) => void) {
        const week = this.getStartEndDatesOfWeek();
        this.dateTimeIterator.iterate(week.startingDate, week.endingDate, action);
    }

}

export class MonthCalendar extends Calendar {

    getStartEndDatesOfMonth() {
        const { referenceDate } = this.dateTimeIterator;
        const year = referenceDate.getFullYear();
        const month = referenceDate.getMonth();
        const time = chronos.getTimeOfDay(referenceDate);
        var startingDate = new Date(year, month, 1, 0, 0, 0, time);
        var endingDate = new Date(year, month, chronos.getDaysInMonth(month, year), 0, 0, 0, time);
        return { startingDate, endingDate, month, year };
    }

    compute(action: (dateTimeCursor: chronos.DateTimeCursor, date: Date) => void) {
        var month = this.getStartEndDatesOfMonth();
        this.dateTimeIterator.iterate(month.startingDate, month.endingDate, action);
    }

    computeByCompleteWeek(action: (dateTimeCursor: chronos.DateTimeCursor, date: Date, isSameMonth: boolean) => void) {
        const month = this.getStartEndDatesOfMonth();
        var originStart = chronos.cloneDateObject(month.startingDate);
        var originEnd = chronos.cloneDateObject(month.endingDate);
        transformToWeekStartAndEnd(this.firstDay, originStart, originEnd);
        this.dateTimeIterator.iterate(originStart, originEnd, (cursor, date) => {
            action(cursor, date, month.month === date.getMonth());
        });
    }

}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthCalendar = exports.WeekCalendar = exports.Calendar = void 0;
const chronos = require("./chronos");
function transformToWeekStartAndEnd(firstDay, startingDate, endingDate) {
    chronos.setDayOfWeek(startingDate, firstDay);
    chronos.setDayOfWeek(endingDate, (firstDay + 6) % 7);
    if (firstDay > chronos.Day.SUNDAY)
        chronos.addWeek(endingDate, 1);
}
class Calendar {
    constructor(dateTimeIterator = new chronos.DateTimeIterator()) {
        this.firstDay = chronos.Day.SUNDAY;
        this.dateTimeIterator = dateTimeIterator;
    }
}
exports.Calendar = Calendar;
class WeekCalendar extends Calendar {
    getStartEndDatesOfWeek() {
        var startingDate = chronos.cloneDateObject(this.dateTimeIterator.referenceDate);
        var endingDate = chronos.cloneDateObject(this.dateTimeIterator.referenceDate);
        transformToWeekStartAndEnd(this.firstDay, startingDate, endingDate);
        return { startingDate, endingDate };
    }
    compute(action) {
        const week = this.getStartEndDatesOfWeek();
        this.dateTimeIterator.iterate(week.startingDate, week.endingDate, action);
    }
}
exports.WeekCalendar = WeekCalendar;
class MonthCalendar extends Calendar {
    getStartEndDatesOfMonth() {
        const { referenceDate } = this.dateTimeIterator;
        const year = referenceDate.getFullYear();
        const month = referenceDate.getMonth();
        const time = chronos.getTimeOfDay(referenceDate);
        var startingDate = new Date(year, month, 1, 0, 0, 0, time);
        var endingDate = new Date(year, month, chronos.getDaysInMonth(month, year), 0, 0, 0, time);
        return { startingDate, endingDate, month, year };
    }
    compute(action) {
        var month = this.getStartEndDatesOfMonth();
        this.dateTimeIterator.iterate(month.startingDate, month.endingDate, action);
    }
    computeByCompleteWeek(action) {
        const month = this.getStartEndDatesOfMonth();
        var originStart = chronos.cloneDateObject(month.startingDate);
        var originEnd = chronos.cloneDateObject(month.endingDate);
        transformToWeekStartAndEnd(this.firstDay, originStart, originEnd);
        this.dateTimeIterator.iterate(originStart, originEnd, (cursor, date) => {
            action(cursor, date, month.month === date.getMonth());
        });
    }
}
exports.MonthCalendar = MonthCalendar;

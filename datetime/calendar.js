"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposedCalendar = exports.WeekCalendar = exports.BasicCalendar = exports.Calendar = void 0;
const chronos = require("./chronos");
class Calendar {
    constructor(dateTimeIterator = new chronos.DateTimeIterator()) {
        this.firstDay = chronos.Day.SUNDAY;
        this.dateTimeIterator = dateTimeIterator;
    }
}
exports.Calendar = Calendar;
class BasicCalendar extends Calendar {
    basicCompute(startingDate, endingDate, action) {
        this.dateTimeIterator.iterate(startingDate, endingDate, action);
    }
}
exports.BasicCalendar = BasicCalendar;
class WeekCalendar extends BasicCalendar {
    /**
     * ONLY_THIS - Covers on the specified week.
     * OVERLAP - Covers the last 7 days.
     * OVERLAP_AND_OVERFLOW - Covers all days within the weeks that overlaps last 7 days.
     */
    compute() {
    }
    computeOnlyDateWeek(action) {
        var startingDate = chronos.cloneDateObject(this.dateTimeIterator.referenceDate);
        var endingDate = chronos.cloneDateObject(this.dateTimeIterator.referenceDate);
        chronos.setDay(startingDate, this.firstDay);
        chronos.setDay(endingDate, (this.firstDay + 6) % 7);
        if (this.firstDay > 0)
            chronos.addWeek(endingDate, 1);
        this.basicCompute(startingDate, endingDate, action);
    }
}
exports.WeekCalendar = WeekCalendar;
class ComposedCalendar extends Calendar {
}
exports.ComposedCalendar = ComposedCalendar;

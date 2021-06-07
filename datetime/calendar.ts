import chronos = require('./chronos');

export abstract class Calendar {
    dateTimeIterator: chronos.DateTimeIterator;
    firstDay = chronos.Day.SUNDAY;

    constructor(dateTimeIterator = new chronos.DateTimeIterator()) {
        this.dateTimeIterator = dateTimeIterator;
    }
}

export abstract class BasicCalendar extends Calendar {

    protected basicCompute(startingDate: Date, endingDate: Date, action: chronos.DateCursorAction) {
        this.dateTimeIterator.iterate(startingDate, endingDate, action);
    }

}

export class WeekCalendar extends BasicCalendar {

    /**
     * ONLY_THIS - Covers on the specified week.
     * OVERLAP - Covers the last 7 days.
     * OVERLAP_AND_OVERFLOW - Covers all days within the weeks that overlaps last 7 days.
     */

    compute() {

    }

    computeOnlyDateWeek(action: chronos.DateCursorAction) {
        var startingDate = chronos.cloneDateObject(this.dateTimeIterator.referenceDate);
        var endingDate = chronos.cloneDateObject(this.dateTimeIterator.referenceDate);
        chronos.setDay(startingDate, this.firstDay);
        chronos.setDay(endingDate, (this.firstDay + 6) % 7);
        if (this.firstDay > 0) 
            chronos.addWeek(endingDate, 1);
        this.basicCompute(startingDate, endingDate, action);
    }
}

export abstract class ComposedCalendar extends Calendar {}

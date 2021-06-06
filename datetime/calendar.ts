import chronos = require('./chronos');

export abstract class Calendar {
    dateTimeIterator: chronos.DateTimeIterator;

    constructor(dateTimeIterator = new chronos.DateTimeIterator()) {
        this.dateTimeIterator = dateTimeIterator;
    }

    abstract compute(): void;

}

export abstract class BasicCalendar extends Calendar {

    protected basicCompute(startingDate: Date, endingDate: Date, action: chronos.DateCursorAction) {
        super.dateTimeIterator.iterate(startingDate, endingDate, action);
    }

}

export class WeekCalendar extends BasicCalendar {

    compute() {
        chronos.cloneDateObject(super.dateTimeIterator.referenceDate);
        
    }
}

export abstract class ComposedCalendar extends Calendar {}

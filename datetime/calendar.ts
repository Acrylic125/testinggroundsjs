import chronos = require('./chronos');

export class Calendar {
    dateTimeIterator: chronos.DateTimeIterator;

    constructor(dateTimeIterator = new chronos.DateTimeIterator()) {
        this.dateTimeIterator = dateTimeIterator;
    }

    

}
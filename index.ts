import cal = require('./datetime/chronos');

var dateTimeIterator = new cal.DateTimeIterator();
var from = new Date();
var to = new Date(from);
to.setTime(to.getTime() + (cal.DAY_TO_MS));
dateTimeIterator.timeIncrement = 864_00_000;
dateTimeIterator.iterate(from, to, (date) => {
    console.log(date.date.toString());
})
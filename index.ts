import cal = require('./datetime/chronos');

var dateTimeIterator = new cal.DateTimeIterator();
var from = new Date();
var to = new Date();
to.setTime(to.getTime() + (cal.DAY_TO_MS));
dateTimeIterator.timeIncrement = 64_00_000;
dateTimeIterator.iterate(from, to, (cursor, dateWrapper) => {
    console.log(dateWrapper.date.toString());
})

console.log(cal.isDateEarlierOrEqual(from, to));
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cal = require("./datetime/chronos");
var dateTimeIterator = new cal.DateTimeIterator();
var from = new Date();
var to = new Date();
to.setTime(to.getTime() + (cal.DAY_TO_MS));
dateTimeIterator.timeIncrement = 6400000;
dateTimeIterator.iterate(from, to, (cursor, dateWrapper) => {
    console.log(dateWrapper.date.toString());
});
console.log(cal.isDateEarlierOrEqual(from, to));

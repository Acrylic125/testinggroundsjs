"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cal = require("./datetime/chronos");
var dateTimeIterator = new cal.DateTimeIterator();
var from = new Date();
var to = new Date(from);
to.setTime(to.getTime() + (cal.DAY_TO_MS));
dateTimeIterator.timeIncrement = 86400000;
dateTimeIterator.iterate(from, to, (date) => {
    console.log(date.date.toString());
});

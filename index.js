"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cal = require("./datetime/chronos");
const calendar = require("./datetime/calendar");
var dateTimeIterator = new cal.DateTimeIterator();
var from = new Date();
var to = new Date();
to.setTime(to.getTime() + (cal.Time.DAY));
dateTimeIterator.timeIncrement = 6400000;
dateTimeIterator.iterate(from, to, (cursor, date) => {
    console.log(date.toString());
});
console.log(cal.isDateEarlierOrEqual(from, to));
var weekCalendar = new calendar.WeekCalendar();
weekCalendar.firstDay = cal.Day.MONDAY;
weekCalendar.computeOnlyDateWeek((cursor, date) => {
    console.log(date.toString());
});

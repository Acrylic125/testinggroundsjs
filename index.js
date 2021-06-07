"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronos = require("./datetime/chronos");
const calendar = require("./datetime/calendar");
var mc = new calendar.MonthCalendar();
mc.firstDay = chronos.Day.MONDAY;
mc.computeByCompleteWeek((cursor, date, sameMonth) => {
    console.log(date.toString() + '   ' + sameMonth);
});

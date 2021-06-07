import chronos = require('./datetime/chronos');
import calendar = require('./datetime/calendar');

var mc = new calendar.MonthCalendar();
mc.firstDay = chronos.Day.MONDAY;
mc.computeByCompleteWeek((cursor, date, sameMonth) => {
    console.log(date.toString() + '   ' + sameMonth);
});

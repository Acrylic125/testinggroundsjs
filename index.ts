import calander = require('./datetime/calander');

new calander.DateIterator();
var date = new Date();
date.setTime(date.getTime());
console.log(new calander.DateWrapper().isEqualTo(new calander.DateWrapper(date)));
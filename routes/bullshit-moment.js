var moment =  require('moment');
var current='2015-11-08 21:50';
console.log(moment(current).get('year'));
console.log(moment(current).get('month'));  // 0 to 11
console.log(moment(current).get('date'));
console.log(moment(current).get('hour'));
console.log(moment(current).get('minute'));
console.log(moment(current).get('second'));
console.log(moment(current).get('millisecond'));
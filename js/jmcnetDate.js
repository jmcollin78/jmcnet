'use strict';

/*----------------------------------------------------------------------------------------*\
 * Commons Date manipulations functions                                                   *
\*----------------------------------------------------------------------------------------*/

module.exports = {
    getDateHourMinuteNow : function() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    },
    getDateToday : function() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    },
    addDays : function(now, nbDays) {
        var date = new Date(now);
        date.setDate(date.getDate()+nbDays);
        return date;
    },
    addWeeks : function(now, nbWeeks) {
        var date = new Date(now);
        date.setDate(date.getDate()+(nbWeeks * 7));
        return date;
    },
    addMonths : function(now, nbMonth) {
        var date = new Date(now);
        date.setMonth(date.getMonth()+nbMonth);
        return date;
    },
    addYears : function(now, nbYear) {
        var date = new Date(now);
        date.setFullYear(date.getFullYear()+nbYear);
        return date;
    }
};
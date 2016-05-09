'use strict';

//var log = require('log4js').getLogger('jmcnet.date');

/*-------------------------------------------------------*\
 * Commons Date manipulations functions                  *
\*-------------------------------------------------------*/
var jmcnetI18n = require('./jmcnetI18n.js');

var dateFormat = (function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = '0' + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length === 1 && Object.prototype.toString.call(date) === '[object String]' && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date();
        if (isNaN(date)) throw new SyntaxError('invalid date');

        mask = String(dF.masks[mask] || mask || dF.masks['default']);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) === 'UTC:') {
            mask = mask.slice(4);
            utc = true;
        }
		
		var localNames;
		if (jmcnetI18n.getLocale().indexOf('fr') !== -1) localNames = dF.i18n.fr;
		else if (jmcnetI18n.getLocale().indexOf('de') !== -1) localNames = dF.i18n.de;
		else localNames = dF.i18n.default;

        var _ = utc ? 'getUTC' : 'get',
            d = date[_ + 'Date'](),
            D = date[_ + 'Day'](),
            m = date[_ + 'Month'](),
            y = date[_ + 'FullYear'](),
            H = date[_ + 'Hours'](),
            M = date[_ + 'Minutes'](),
            s = date[_ + 'Seconds'](),
            L = date[_ + 'Milliseconds'](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  localNames.dayNames[D],
                dddd: localNames.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  localNames.monthNames[m],
                mmmm: localNames.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? 'a'  : 'p',
                tt:   H < 12 ? 'am' : 'pm',
                T:    H < 12 ? 'A'  : 'P',
                TT:   H < 12 ? 'AM' : 'PM',
                Z:    utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
                o:    (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}());

// Some common format strings
dateFormat.masks = {
    'default':      'ddd mmm dd yyyy HH:MM:ss',
    'shortDate-fr':    'dd/mm/yyyy',
    'shortDate-en':    'mm-dd-yyyy',
    'shortDate-de':    'dd.mm.yyyy',
    mediumDate:     'mmm d, yyyy',
    longDate:       'mmmm d, yyyy',
    fullDate:       'dddd, mmmm d, yyyy',
    shortTime:      'h:MM TT',
    mediumTime:     'h:MM:ss TT',
    longTime:       'h:MM:ss TT Z',
    isoDate:        'yyyy-mm-dd',
    isoTime:        'HH:MM:ss',
    isoDateTime:    'yyyy-mm-dd\'T\'HH:MM:ss',
    isoUtcDateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\''
};

// Internationalization strings
dateFormat.i18n = {
	'default' : {
		dayNames: [
			'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
			'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
		],
		monthNames: [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
			'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
		]
	},
	'fr' : {
		dayNames: [
			'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam',
			'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
		],
		monthNames: [
			'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc',
			'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
		]
	},
	'de' : {
		dayNames: [
			'Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam',
			'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'
		],
		monthNames: [
			'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
			'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'July', 'August', 'September', 'Oktober', 'November', 'Dezember'
		]
	}
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

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
    },
	getLastMonday: function( date ) {
		var day = date.getDay() || 7;  
		if( day !== 1 ) 
			date.setHours(-24 * (day - 1)); 
		return date;
	}
};
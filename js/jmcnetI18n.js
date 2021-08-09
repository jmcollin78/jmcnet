'use strict';

/**
 * This module aims to give some i18n format functions
 * @author : Jean-Marc COLLIN
 */

var
	jmcnetResourceBundle = require('./jmcnetResourceBundle.js'),
	_ = require('lodash'),
	util = require('util'),
	ejs = require('ejs');
var log = require('log4js').getLogger('jmcnet.i18n');

var gLocale = 'fr'; // the global locale value
var gCurrencySymbol = '€';
var gFallbackLocale = 'fr';

// Loading locale resources
var i18nRsc = new jmcnetResourceBundle.ResourceBundle(__dirname + '/../resources', 'jmcnetI18n', {
	reloadOnChange: false
});
i18nRsc.loadFiles();

/**
 * Gets the locale String from request from accept-language header. This extracted locale is alos set as default locale for format functions below
 * @
 */
var getLocaleFromRequest = function (req) {
	log.trace('Try to get Accept-Language from request. request.headers is "%s"', util.inspect(req.headers));
	var ret = req.headers['accept-language'];
	log.trace('Accepted language are : %s', ret);
	if (ret) {
		var idx = ret.indexOf(';');
		if (idx !== -1) {
			ret = ret.substring(0, idx);
		}
		if (_.includes(ret, 'en')) ret = 'en';
		else if (_.includes(ret, 'de')) ret = 'de';
		else ret = gFallbackLocale;
		log.trace('We get a locale from the Accept-Language request : "%s"', ret);
	} else ret = gFallbackLocale;
	log.debug('getStringLocale : returns "%s"', ret);
	gLocale = ret;
	return ret;
};

/**
 * Set the locale used by following functions
 * @param locale String the locale
 */
var setLocale = function (locale) {
	log.debug('Setting current locale with "%s"', locale);
	gLocale = locale;
	return this;
};

var getLocale = function () {
	return gLocale;
};

/**
 * Set the currency symbol used by following functions
 * @param currency symbol String the locale
 */
var setCurrencySymbol = function (cs) {
	log.debug('Setting current currency symbol with "%s"', cs);
	gCurrencySymbol = cs;
	return this;
};

var getCurrencySymbol = function () {
	return gCurrencySymbol;
};

/**
 * Replace template value in String with context values. The template String comes from a file.get(key)
 * @return String the replaced String or null if key is not present in file
 */
var getLocaleString = function (file, key, context) {
	var keyValue = file.get(key, undefined);
	if (!keyValue) return null;
	return ejs.render(keyValue, context);
};

/**
 *  Extract float part number (thousands, units and cents) from a Number value given in argument
 * @param value Number the value to extract
 * @return Object { mills : the thousand part, units : the units part, cents : the cent part }
 * @example : extractFloatNumber(1234.56) -> { mills : 1, units : 234, cents : 56 }
 */
var extractFloatNumber = function extractFloatNumber(value) {

	var units = 0;
	if (value >= 0) units = Math.floor(value / 100);
	else units = Math.ceil(value / 100);

	var cents = Math.abs(value - (units * 100));

	var mills = 0;
	if (units >= 0) mills = Math.floor(units / 1000);
	else mills = Math.ceil(units / 1000);

	units = units - (mills * 1000);

	if (mills < 0) {
		units = -units;
	}

	return {
		mills: mills,
		units: units,
		cents: cents
	};
};

/**
 * Left pad a string (supposed to contains digits) with 0 until size of string is 2
 * @param str String a String to be left-padded with 0
 */
var formatPad2Digits = function formatPad2Digits(str) {
	if (str.length >= 2) return str;
	if (str.length === 1) return '0' + str;
	if (str.length === 0) return '00';
};

/**
 * Left pad a string (supposed to contains digits) with 0 until size of string is 3
 * @param str String a String to be left-padded with 0
 */
var formatPad3Digits = function formatPad3Digits(str) {
	if (str.length >= 3) return str;
	if (str.length === 2) return '0' + str;
	if (str.length === 1) return '00' + str;
	if (str.length === 0) return '000';
};

/**
 * Formats a Number into currency using the current locale
 * @param currencyValue Number The value to format
 * @param withoutEuroSign boolean if true, removes the euro sign to formatted string
 * @param flatNumberFormat boolean if true, removes the . or , separator betweeen mills and unit
 * @return the format currency value
 * @see setLocale, getLocaleFromRequest, setCurrencySymbol
 */
var formatCurrency = function formatCurrency(currencyValue, withoutCurrencySign, flatNumberFormat) {
	var messages = i18nRsc.getLocaleFile(gLocale);

	if (currencyValue === undefined || currencyValue === null || isNaN(currencyValue)) return '';
	if (withoutCurrencySign === undefined || withoutCurrencySign === null) withoutCurrencySign = false;
	if (flatNumberFormat === undefined || flatNumberFormat === null) flatNumberFormat = false;

	var extract = extractFloatNumber(currencyValue);
	var mills = extract.mills,
		euros = extract.units,
		cents = extract.cents;
	var millsStr, eurosStr, centsStr;

	if (mills !== 0) {
		millsStr = '' + mills;
		eurosStr = formatPad3Digits('' + euros);
		centsStr = formatPad2Digits('' + cents);

		if (withoutCurrencySign)
			if (flatNumberFormat)
				return getLocaleString(messages, 'jmcnet.currency-milliers.withoutCurrencySign.flat.format', {
					'currencySymbol': gCurrencySymbol,
					'millsStr': millsStr,
					'unitsStr': eurosStr,
					'centsStr': centsStr
				});
			else
				return getLocaleString(messages, 'jmcnet.currency-milliers.withoutCurrencySign.format', {
					'currencySymbol': gCurrencySymbol,
					'millsStr': millsStr,
					'unitsStr': eurosStr,
					'centsStr': centsStr
				});
		else
			if (flatNumberFormat)
				return getLocaleString(messages, 'jmcnet.currency-milliers.flat.format', {
					'currencySymbol': gCurrencySymbol,
					'millsStr': millsStr,
					'unitsStr': eurosStr,
					'centsStr': centsStr
				});
			else
				return getLocaleString(messages, 'jmcnet.currency-milliers.format', {
					'currencySymbol': gCurrencySymbol,
					'millsStr': millsStr,
					'unitsStr': eurosStr,
					'centsStr': centsStr
				});
	} else {
		eurosStr = '' + euros;
		centsStr = formatPad2Digits('' + cents);
		if (withoutCurrencySign)
			if (flatNumberFormat)
				return getLocaleString(messages, 'jmcnet.currency.withoutCurrencySign.flat.format', {
					'currencySymbol': gCurrencySymbol,
					'unitsStr': eurosStr,
					'centsStr': centsStr
				});
			else
				return getLocaleString(messages, 'jmcnet.currency.withoutCurrencySign.format', {
					'currencySymbol': gCurrencySymbol,
					'unitsStr': eurosStr,
					'centsStr': centsStr
				});
		else
			if (flatNumberFormat)
				return getLocaleString(messages, 'jmcnet.currency.flat.format', {
					'currencySymbol': gCurrencySymbol,
					'unitsStr': eurosStr,
					'centsStr': centsStr
				});
			else
				return getLocaleString(messages, 'jmcnet.currency.format', {
					'currencySymbol': gCurrencySymbol,
					'unitsStr': eurosStr,
					'centsStr': centsStr
				});
	}
};

/**
 * Formats a Number into a float value using the current locale
 * @param floatCentValue Number The value to format
 * @param forceDeci boolean if true, force the decimal part to be added (eventually with 0)
 * @see setLocale, getLocaleFromRequest
 */
var formatFloatCent = function (floatCentValue, forceDeci) {
	if (_.isNull(floatCentValue) || _.isUndefined(floatCentValue) || _.isNaN(floatCentValue)) return '';
	if (forceDeci === undefined || forceDeci === null) forceDeci = false;

	let messages = i18nRsc.getLocaleFile(gLocale);

	let extract = extractFloatNumber(floatCentValue);
	let mills = extract.mills,
		units = extract.units,
		cents = extract.cents;

	if (cents !== 0) forceDeci = true;

	let millsStr, unitsStr, centsStr;

	if (mills !== 0) {
		millsStr = '' + mills;
		unitsStr = formatPad3Digits('' + units);
		centsStr = formatPad2Digits('' + cents);
		if (forceDeci)
			return getLocaleString(messages, 'jmcnet.floatNumber-milliers.format', {
				'millsStr': millsStr,
				'unitsStr': unitsStr,
				'centsStr': centsStr
			});
		else
			return getLocaleString(messages, 'jmcnet.floatNumber-milliers.withoutDecimal.format', {
				'millsStr': millsStr,
				'unitsStr': unitsStr
			});
	} else {
		unitsStr = '' + units;
		centsStr = formatPad2Digits('' + cents);
		if (forceDeci)
			return getLocaleString(messages, 'jmcnet.floatNumber.format', {
				'unitsStr': unitsStr,
				'centsStr': centsStr
			});
		else
			return getLocaleString(messages, 'jmcnet.floatNumber.withoutDecimal.format', {
				'unitsStr': unitsStr
			});
	}
};

/**
 * Formats a value into a percentage (add a % symbol at the end)
 * @param floatCentValue Number the value to be formatted (ie: 15.35)
 * @param forceDeci boolean if true force the decimal part to be present eventually with 0
 * @return the value formatted according to current locale and the '%' symbol
 */
var formatPercent = function (floatCentValue, forceDeci) {
	var value = formatFloatCent(floatCentValue, forceDeci) + ' %';
	return value;
};

/**
 * An helper to display a date correctly
 */
var formatDate = function formatDate(d) {
	return d.format('shortDate-' + gLocale);
};

/**
 * A helper to display file volume correctly
 */
var formatFloatVolume = function formatFloatVolume(floatCentValue, forceDeci) {
	if (_.isNil(floatCentValue) || _.isNaN(floatCentValue)) return '';
	if (_.isNil(forceDeci)) forceDeci = false;
	
	var messages = i18nRsc.getLocaleFile(gLocale);

	let cents = 0,
		units;
	let unit;
	// Go
	if (floatCentValue >= 1024 * 1024 * 1024) {
		let v = floatCentValue / 1024 / 1024 / 1024;
		units = Math.floor(v);
		cents = Math.round((v - units) * 100);
		unit = getLocaleString(messages, 'jmcnet.volume.gb');
	} else
	if (floatCentValue >= 1024 * 1024) {
		let v = floatCentValue / 1024 / 1024;
		units = Math.floor(v);
		cents = Math.round((v - units) * 100);
		unit = getLocaleString(messages, 'jmcnet.volume.mb');
	} else
	if (floatCentValue >= 1024) {
		let v = floatCentValue / 1024;
		units = Math.floor(v);
		cents = Math.round((v - units) * 100);
		unit = getLocaleString(messages, 'jmcnet.volume.kb');
	} else {
		units = floatCentValue;
		cents = 0;
		unit = getLocaleString(messages, 'jmcnet.volume.b');
	}
	var unitsStr, centsStr;

	if (cents !== 0) forceDeci = true;

	unitsStr = '' + units;
	centsStr = formatPad2Digits('' + cents);
	if (forceDeci)
		return getLocaleString(messages, 'jmcnet.floatNumber.format', {
			'unitsStr': unitsStr,
			'centsStr': centsStr
		}) + ' ' + unit;
	else
		return getLocaleString(messages, 'jmcnet.floatNumber.withoutDecimal.format', {
			'unitsStr': unitsStr
		}) + ' ' + unit;
};

module.exports = {
	getLocaleFromRequest: getLocaleFromRequest,
	setLocale: setLocale,
	getLocale: getLocale,
	setCurrencySymbol: setCurrencySymbol,
	getCurrencySymbol: getCurrencySymbol,
	formatCurrency: formatCurrency,
	formatDate: formatDate,
	formatPad2Digits: formatPad2Digits,
	formatPad3Digits: formatPad3Digits,
	formatFloatCent: formatFloatCent,
	formatPercent: formatPercent,
	getLocaleString: getLocaleString,
	formatFloatVolume: formatFloatVolume
};
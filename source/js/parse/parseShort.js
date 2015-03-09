var utils = require('../utils');
var phrases = require('./journalPhrases.js');

var cfgShort = processShortRaw(phrases);

module.exports = parseShort;

/**
 * Метод разбирает действие из журнала
 * @param {string} msg - строка действия в журнале
 * @return {object} act
 * @return {boolean} act.isMe - герой/моб
 * @return {string} act.type - тип hit/might/...
 * @return {string} act.sec - вторичный тип как vamp в [eva,vamp]
 * @return {string} act.actor - значение из фигурных скобок
 * @return {string} act.victim - значение из фигурных скобок
 * @return {string} act.item - значение из фигурных скобок
 * @return {string} act.value - значение из фигурных скобок
 * */
function parseShort(msg) {
	msg = msg.replace(/ё/g, 'е');
	var act;
	for (var i = 0; i < cfgShort.length; i++) {
		var cfgParsedLine = cfgShort[i];
		var paramNames = cfgParsedLine.params;
		var values = cfgParsedLine.regex.exec(msg);

		if (values) {
			values = values.slice(1);

			act = {};
			act.type = cfgParsedLine.type;
			if (cfgParsedLine.sec) act.sec = cfgParsedLine.sec;
			for (var paramIndex = 0; paramIndex < paramNames.length; paramIndex++) {
				var param = paramNames[paramIndex];
				act[param] = isNaN(values[paramIndex]) ? values[paramIndex] : +values[paramIndex];
			}

			act.isMe = !!(act.actor ? utils.isMyName(act.actor) : (act.victim ? !utils.isMyName(act.victim) : true));
			if (!utils.settings.settingsValues.heroNameStart) act.isMe = 0;

		}
	}
	return act;
}

/**
 * Прекомпиляция конфига фраз для разбора
 * */
function processShortRaw(phrases) {
	var ESCAPE = /[?.]/g;
	var anyRegExp = new RegExp('({})', 'g');
	var numbersRegExp = new RegExp('({value})', 'g');
	var paramsRegExp = new RegExp('({[a-zA-Z]+})', 'g');
	var namesRegExp = '([а-яА-ЯёЁa-zA-Z\\d _\\-\']+)';

	var paramReg = /{([a-zA-Z]+)}/g;
	var result = [];

	var typeReg = /^\[([a-zA-Z]+)(?:,([a-zA-Z]+))?\]/;

	for (var i = 0; i < phrases.length; i++) {
		var cfgString = phrases[i].replace(/ё/g, 'е');
		var parsedCfg = {};

		var p = typeReg.exec(cfgString);
		if (p) {
			if (p[1]) parsedCfg.type = p[1];
			if (p[2]) parsedCfg.sec = p[2];
//				else parsedCfg.sec = 'vamp';
			cfgString = cfgString.replace(p[0], '');
		}
		if (cfgString.charAt(0) !== '~') {
			cfgString = '^' + cfgString;
			cfgString = cfgString + '$';
		}

		var paramNames = [];
		do {
			p = paramReg.exec(cfgString);
			if (p) paramNames.push(p[1]);
		} while (p);
		parsedCfg.params = paramNames;

		cfgString = cfgString
			.replace(ESCAPE, '\\$&')
			.replace(/\(/g, '(?:')
			.replace(/\)/g, ')?')
			.replace(anyRegExp, '.+')
			.replace(numbersRegExp, '(\\d+)')
			.replace(paramsRegExp, namesRegExp);
		parsedCfg.regex = new RegExp(cfgString);
		result[i] = parsedCfg;
	}
	return result;
}


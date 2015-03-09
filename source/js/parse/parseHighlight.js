var phrasesHighlight = require('./journalPhrasesHighlight.js');
var cfgHighlight = processHighlightRaw(phrasesHighlight);

module.exports = parseHighlight;

/**
* Метод выделяет ключевые слова в строке действия в журнале
* */
function parseHighlight(msg, act) {
	for (var i = 0; i < cfgHighlight.length; i++) {
		var regExp = cfgHighlight[i].regex;
		var type = cfgHighlight[i].type || 'value';
		msg = msg.replace(regExp, '<span class="' + type + '">$&</span>');
	}
	for (var cls in act) if (act.hasOwnProperty(cls)) {
		var value = act[cls];
		if (cls !== 'value' && cls !== 'type') {
			msg = msg.replace(value, '<span class="' + cls + '">' + value + '</span>');
		}
	}
	return msg;
}



/**
 * Прекомпилящия конфига фраз для выделения
 * */
function processHighlightRaw(phrasesHighlight) {
	var typeReg = /^\[[a-zA-Z]+\]/g;
	var result = [];
	for (var i = 0; i < phrasesHighlight.length; i++) {
		var cfgString = phrasesHighlight[i];
		var parsedCfg = {};

		var p = typeReg.exec(cfgString);
		if (p && p[0]) {
			parsedCfg.type = p[0].substring(1, p[0].length - 1);
		}
		cfgString = cfgString.replace(typeReg, '');

		parsedCfg.regex = new RegExp(cfgString);
		result.push(parsedCfg);
	}
	return result;
}



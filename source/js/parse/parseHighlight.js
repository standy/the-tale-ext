import {journalPhrasesHighlight} from './journalPhrasesHighlight';

const cfgHighlight = processHighlightRaw(journalPhrasesHighlight);


/**
* Метод выделяет ключевые слова в строке действия в журнале
* */
export function parseHighlight(msg, act) {
	for (let i = 0; i < cfgHighlight.length; i++) {
		const regExp = cfgHighlight[i].regex;
		const type = cfgHighlight[i].type || 'value';
		msg = msg.replace(regExp, `<span class="${type}">$&</span>`);
	}
	for (const cls in act) {
		if (act.hasOwnProperty(cls)) {
			const value = act[cls];
			if (cls !== 'value' && cls !== 'type') {
				msg = msg.replace(value, `<span class="${cls}">${value}</span>`);
			}
		}
	}
	return msg;
}



/**
 * Прекомпилящия конфига фраз для выделения
 * */
function processHighlightRaw(phrasesHighlight) {
	const typeReg = /^\[[a-zA-Z]+\]/g;
	const result = [];
	for (let i = 0; i < phrasesHighlight.length; i++) {
		let cfgString = phrasesHighlight[i];
		const parsedCfg = {};

		const p = typeReg.exec(cfgString);
		if (p && p[0]) {
			parsedCfg.type = p[0].substring(1, p[0].length - 1);
		}
		cfgString = cfgString.replace(typeReg, '');

		parsedCfg.regex = new RegExp(cfgString);
		result.push(parsedCfg);
	}
	return result;
}



const pgf = require('pgf');
const _const = require('./const');


function setLog(name, messages) {
	try {
		if (name === 'messagesLog') {
			const max = /*_settings.settingsValues.maxLogLength || */_const.MAX_LOG_LENGTH;
			pgf.base.settings.set(name, JSON.stringify(messages.slice(messages.length - max)));
		} else {
			pgf.base.settings.set(name, JSON.stringify(messages));
		}
	} catch (e) {
		console.warn('setLog', name, e);
	}
}
function getLog(name) {
	const g = pgf.base.settings.get(name);
	return g ? JSON.parse(g) : '';
}
function logToConsole(name) {
	const strLog = pgf.base.settings.get(name);
	const s = strLog
		.replace(/\],\[/g, '],\n\t[')
		.replace(/\},{/g, '},\n\t{')
		.replace(/"(action|base|energy|habits|secondary|turn)"/g, '\n\t\t"$1"');
	console.log(s);
}
function toStr(messages) {
	const strLog = JSON.stringify(messages);
	const s = strLog
		.replace(/\],\[/g, '],\n\t[')
		.replace(/"(action|base|energy|habits|secondary|turn)"/g, '\n\t\t"$1"');
	return s;
}
function size() {
	let t = 0;
	for (const x in localStorage) {
		if (localStorage.hasOwnProperty(x)) {
			t += localStorage[x].length * 2;
		}
	}
	return t;
}


module.exports = {
	toConsole: logToConsole,
	toStr: toStr,
	get: getLog,
	size: size,
	set: setLog,
};

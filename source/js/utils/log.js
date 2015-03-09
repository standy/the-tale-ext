var pgf = require('pgf');
var _const = require('./const.js');


function setLog(name, messages) {
	try {
		if (name === 'messagesLog') {
			var max = /*_settings.settingsValues.maxLogLength || */_const.MAX_LOG_LENGTH;
			pgf.base.settings.set(name, JSON.stringify(messages.slice(messages.length - max)));
		} else {
			pgf.base.settings.set(name, JSON.stringify(messages));
		}
	} catch (e) {
		console.warn('setLog', name, e);
	}
}
function getLog(name) {
	var g = pgf.base.settings.get(name);
	return g ? JSON.parse(g) : '';
}
function logToConsole(name) {
	var strLog = pgf.base.settings.get(name);
	var s = strLog
		.replace(/\],\[/g, '],\n\t[')
		.replace(/\},{/g, '},\n\t{')
		.replace(/"(action|base|energy|habits|secondary|turn)"/g, '\n\t\t"$1"');
	console.log(s);
}
function toStr(messages) {
	var strLog = JSON.stringify(messages);
	var s = strLog
		.replace(/\],\[/g, '],\n\t[')
		.replace(/"(action|base|energy|habits|secondary|turn)"/g, '\n\t\t"$1"');
	return s;
}
function size() {
	var t = 0;
	for (var x in localStorage) if (localStorage.hasOwnProperty(x)) {
		t += localStorage[x].length * 2;
	}
	return t;
}


module.exports = {
	toConsole: logToConsole,
	toStr: toStr,
	get: getLog,
	size: size,
	set: setLog
};

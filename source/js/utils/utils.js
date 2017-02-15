const _utils = {};
_utils.capitalize = function(text) {
	return text.substring(0, 1).toUpperCase() + text.substring(1);
};
_utils.declensionByNumber = function(number, titles, addCount) {
	return (addCount ? number + ' ' : '') + titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5] ];
};
_utils.timeSpan = function(timeSpan) {
	timeSpan = Math.floor(+timeSpan) || 0;
	const h = Math.floor(timeSpan / 60 / 60);
	const m = Math.floor(timeSpan / 60) % 60;
	const s = timeSpan % 60;
	return (h ? h + ':' : '') + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
};

module.exports = _utils;

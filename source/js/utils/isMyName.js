var _settings = require('./settings.js');

module.exports = function(str) {
	return str.indexOf(_settings.settingsValues.heroNameStart) >= 0;
};

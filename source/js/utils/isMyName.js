const _settings = require('./settings');

module.exports = function(str) {
	return str.indexOf(_settings.settingsValues.heroNameStart) >= 0;
};

var archiveGroups = require('./archiveGroups.js');
var downgradeArchiveGroup = require('./downgradeArchiveGroup.js');
var utils = require('../../utils/index.js');
var _const = utils.const;
var _settings = utils.settings;
var _log = utils.log;

function saveArchiveGroups() {
	var max = _settings.settingsValues.maxArchiveLength || _const.MAX_ARCHIVE_LENGTH;

	archiveGroups = archiveGroups.slice(archiveGroups.length - max);
	var toSave = archiveGroups.map(downgradeArchiveGroup);
	_log.set('archiveGroups', toSave);
}

module.exports = saveArchiveGroups;

var archiveGroups = require('./archiveGroups');
var downgradeArchiveGroup = require('./downgradeArchiveGroup');
var utils = require('../../utils/');
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

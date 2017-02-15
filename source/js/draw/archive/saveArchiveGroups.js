let archiveGroups = require('./archiveGroups');
const downgradeArchiveGroup = require('./downgradeArchiveGroup');
const utils = require('../../utils/');
const _const = utils.const;
const _settings = utils.settings;
const _log = utils.log;

function saveArchiveGroups() {
	const max = _settings.settingsValues.maxArchiveLength || _const.MAX_ARCHIVE_LENGTH;

	archiveGroups = archiveGroups.slice(archiveGroups.length - max);
	const toSave = archiveGroups.map(downgradeArchiveGroup);
	_log.set('archiveGroups', toSave);
}

module.exports = saveArchiveGroups;

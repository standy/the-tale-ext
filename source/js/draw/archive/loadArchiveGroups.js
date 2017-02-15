const utils = require('../../utils/');
const _log = utils.log;
const upgradeArchiveGroup = require('./upgradeArchiveGroup');

function loadArchiveGroups() {
	const _archiveGroups = _log.get('archiveGroups') || [];
	_archiveGroups.sort(function(a, b) {
		return a.ts[0] - b.ts[0];
	});
	for (let i = 0; i < _archiveGroups.length - 1; i++) { /* remove doubles */
		if (_archiveGroups[i].ts[0] === _archiveGroups[i + 1].ts[0]) {
			_archiveGroups.splice(i, 1);
			i--;
		}
	}
	_archiveGroups.map(upgradeArchiveGroup);
	/* FIXME результат не используется? */
	return _archiveGroups;
}

module.exports = loadArchiveGroups;


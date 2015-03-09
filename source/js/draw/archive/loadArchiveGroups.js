var $ = require('jquery');
var utils = require('./../../utils/index.js');
var _log = utils.log;
var archiveGroups = require('./archiveGroups.js');
var upgradeArchiveGroup = require('./upgradeArchiveGroup.js');

function loadArchiveGroups() {
	var _archiveGroups = _log.get('archiveGroups') || [];
	_archiveGroups.sort(function(a, b) {
		return a.ts[0] - b.ts[0];
	});
	for (var i = 0; i < _archiveGroups.length - 1; i++) { /* remove doubles */
		if (_archiveGroups[i].ts[0] === _archiveGroups[i + 1].ts[0]) {
			_archiveGroups.splice(i, 1);
			i--;
		}
	}
	_archiveGroups.map(upgradeArchiveGroup);
	archiveGroups = _archiveGroups;
}

module.exports = loadArchiveGroups;


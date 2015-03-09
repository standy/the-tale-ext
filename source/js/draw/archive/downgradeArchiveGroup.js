var $ = require('jquery');

function downgradeArchiveGroup(fullStats) {
	var archiveGroup = $.extend({}, fullStats);
	delete archiveGroup.total;
	delete archiveGroup.level;
	return archiveGroup;
}

module.exports = downgradeArchiveGroup;

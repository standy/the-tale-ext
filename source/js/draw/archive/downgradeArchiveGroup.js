const $ = require('jquery');

function downgradeArchiveGroup(fullStats) {
	const archiveGroup = $.extend({}, fullStats);
	delete archiveGroup.total;
	delete archiveGroup.level;
	return archiveGroup;
}

module.exports = downgradeArchiveGroup;

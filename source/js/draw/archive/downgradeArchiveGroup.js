import $ from 'jquery';

export function downgradeArchiveGroup(fullStats) {
	const archiveGroup = $.extend({}, fullStats);
	delete archiveGroup.total;
	delete archiveGroup.level;
	return archiveGroup;
}

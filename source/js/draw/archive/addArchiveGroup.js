var archiveGroups = require('./archiveGroups.js');
var countArchiveFromGroup = require('./countArchiveFromGroup.js');

function addArchiveGroup(group) {
	if (!group) return;
	var archiveGroup = countArchiveFromGroup(group);

	if (!archiveGroup) return;

	var lastStatGroup = archiveGroups[archiveGroups.length - 1];
	if (!lastStatGroup || lastStatGroup.ts[0] === archiveGroup.ts[0]) {
		/* последняя группа обновляется каждый ход*/
		archiveGroups[archiveGroups.length - 1] = archiveGroup;
	} else if (lastStatGroup.ts[0] < archiveGroup.ts[0]) {
		archiveGroups.push(archiveGroup);
	} else {
		var isInArr = false;
		for (var i = 0; i < archiveGroups.length; i++) {
			var sg = archiveGroups[i];
			if (sg.ts[0] === archiveGroup.ts[0]) {
				archiveGroups[i] = archiveGroup;
				isInArr = true;
				break;
			}
		}
		if (!isInArr) {
			archiveGroups.push(archiveGroup);
			archiveGroups.sort(function(a, b) {
				return a.ts[0] - b.ts[0];
			});
//					console.log('add to millde', archiveGroup);
		}
	}
}

module.exports = addArchiveGroup;

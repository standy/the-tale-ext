import {archiveGroups} from './archiveGroups';
import {countArchiveFromGroup} from './countArchiveFromGroup';

export function addArchiveGroup(group) {
	if (!group) return;
	const archiveGroup = countArchiveFromGroup(group);

	if (!archiveGroup) return;

	const lastStatGroup = archiveGroups[archiveGroups.length - 1];
	if (!lastStatGroup || lastStatGroup.ts[0] === archiveGroup.ts[0]) {
		/* последняя группа обновляется каждый ход*/
		archiveGroups[archiveGroups.length - 1] = archiveGroup;
	} else if (lastStatGroup.ts[0] < archiveGroup.ts[0]) {
		archiveGroups.push(archiveGroup);
	} else {
		let isInArr = false;
		for (let i = 0; i < archiveGroups.length; i++) {
			const sg = archiveGroups[i];
			if (sg.ts[0] === archiveGroup.ts[0]) {
				archiveGroups[i] = archiveGroup;
				isInArr = true;
				break;
			}
		}
		if (!isInArr) {
			archiveGroups.push(archiveGroup);
			archiveGroups.sort((a, b) => a.ts[0] - b.ts[0]);
//					console.log('add to millde', archiveGroup);
		}
	}
}

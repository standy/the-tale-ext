import {upgradeArchiveGroup} from './upgradeArchiveGroup';
import log from '../../utils/log';

export function loadArchiveGroups() {
	const _archiveGroups = log.get('archiveGroups') || [];
	_archiveGroups.sort((a, b) => a.ts[0] - b.ts[0]);
	for (let i = 0; i < _archiveGroups.length - 1; i++) { /* remove doubles */
		if (_archiveGroups[i].ts[0] === _archiveGroups[i + 1].ts[0]) {
			_archiveGroups.splice(i, 1);
			i--;
		}
	}
	_archiveGroups.map(upgradeArchiveGroup);
}

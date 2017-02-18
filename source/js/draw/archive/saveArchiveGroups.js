import {archiveGroups} from './archiveGroups';
import {downgradeArchiveGroup} from './downgradeArchiveGroup';
import CONST from '../../utils/const';
import {settingsValues} from '../../settings/settings';
import log from '../../utils/log';

export function saveArchiveGroups() {
	const max = settingsValues.maxArchiveLength || CONST.MAX_ARCHIVE_LENGTH;

	const archiveGroupsForSave = archiveGroups.slice(archiveGroups.length - max);
	const toSave = archiveGroupsForSave.map(downgradeArchiveGroup);
	log.set('archiveGroups', toSave);
}

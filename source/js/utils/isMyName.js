import {settingsValues} from '../settings/settings';

export function isMyName(str) {
	return str.indexOf(settingsValues.heroNameStart) >= 0;
}

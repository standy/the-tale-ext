import {settingsValues} from '../settings/settings';

export function isMyName(str) {
	return str.includes(settingsValues.heroNameStart);
}

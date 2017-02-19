import {settingsValues} from '../../settings/settings';
import {drawGroupInner} from './drawGroupInner';
import {messagesGrouped} from './messagesGrouped';


export function drawGroup(group, index, isOpen) {
	isOpen = isOpen || settingsValues.groupOpenOnDefault;
	const html =
		`<div class="group${isOpen ? ' open' : ''}" data-index="${index}">${drawGroupInner(group, messagesGrouped[index + 1])}</div>`;
	return html;
}

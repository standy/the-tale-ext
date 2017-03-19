import storage from '../../storage/storage';
import ICONS from '../const/icons';

export function act(modificator: string, shortMsg: string) {
	return `<span class="act ${modificator}">${shortMsg}</span>`;
}

export function actPositive(actor: string|undefined, shortMsg: string) {
	const isCompanion = actor === storage.companionName;
	const isPositive = isCompanion || actor === storage.heroName;
	return `<span class="act ${isPositive ? 'positive' : 'negative'}">${isCompanion ? ICONS.companion : ''}${shortMsg}</span>`;
}

export function actNegative(actor: string|undefined, shortMsg: string) {
	const isCompanion = actor === storage.companionName;
	const isPositive = !isCompanion && actor !== storage.heroName;
	return `<span class="act ${isPositive ? 'positive' : 'negative'}">${isCompanion ? ICONS.companion : ''}${shortMsg}</span>`;
}

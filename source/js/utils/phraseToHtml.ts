///<reference path="../typings.d.ts"/>
import actFight from './act/act-fight';
import groupFight from './act/group-fight';
import actTravel from './act/act-travel';

export const actsByIds: ActsByIds = Object.assign(
	{},
	groupFight,
	actFight,
	actTravel,
);

export function actToHtmlShort(act: Act, message: Message) {
	return `<span title="${details(message)}">${act.fn(message[MSG.PhraseData])}</span>`;
}

export function actToHtmlDefault(message: Message) {
	return `<span title="${details(message)}">${message[MSG.PhraseSting]}</span>`;
}

function details(message: Message) {
	const timeSting = message[MSG.TimeSting];
	const phraseSting = message[MSG.PhraseSting];
	const phraseId = message[MSG.PhraseId];
	const phraseData = message[MSG.PhraseData];
	return `[${timeSting}] ${phraseSting}\n${phraseId}: ${JSON.stringify(phraseData).replace(/"/g, '&quot;')}`;
}

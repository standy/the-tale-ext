///<reference path="../../node_modules/@types/jquery/index.d.ts"/>
///<reference path="../../node_modules/typescript/lib/lib.es6.d.ts"/>

declare module "*.css" {
	const css: any;
	export default css;
}

declare const pgf: any;

declare type PhraseData = {
	attacker?: string,
	damage?: number,
	defender?: string,
	actor?: string,
	attacker_damage?: string,
	health?: number,
	companion_owner?: string,
	mob?: string,
	hero?: string,
	destination?: string,
	current_destination?: string,
	coins?: number,
	artifact?: string,
}

declare const enum MSG {
	TimeStamp = 0,
	TimeSting = 1,
	PhraseSting = 2,
	PhraseId = 3,
	PhraseData = 4,
}

declare type Message = [
	number, //timestamp,
	string, //timeSting,
	string, //phraseSting,
	number, //phraseId,
	PhraseData //phraseData,
];

declare type GameData = any;

declare type ActType = 'block'|'inline';
declare type ActToHtml = (phraseData: PhraseData) => string;
declare type Act = {
	fn: ActToHtml;
	type: ActType
}
declare type ActsByIds = {
	[id: number]: Act;
}


declare type Icon = string;


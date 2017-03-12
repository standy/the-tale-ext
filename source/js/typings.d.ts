///<reference path="../../node_modules/@types/jquery/index.d.ts"/>
///<reference path="../../node_modules/typescript/lib/lib.es6.d.ts"/>
///<reference path="../../node_modules/typescript/lib/lib.es2016.array.include.d.ts"/>

interface Window {
	ext: any;
	extPath: string;
}

declare module "*.css" {
	const css: any;
	export default css;
}

declare const pgf: any;

type PhraseNumberKey = 'damage' | 'health' | 'coins' | 'sell_price';

declare type PhraseDataRaw = {
	[key: string]: string;
}

declare const enum SkillOwner {
	me = 0,
	mob = 1,
	companion = 2,
}

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
	sell_price?: number,
	old_artifact?: string,
}

declare type PhraseMeta = {
	/* чей скилл сработал */
	owner: SkillOwner,
}

declare const enum MSG {
	TimeStamp = 0,
	TimeSting = 1,
	PhraseSting = 2,
	PhraseId = 3,
	PhraseData = 4,
	PhraseMeta = 5,
}

declare type MessageRaw = [
	number, //timestamp,
	string, //timeSting,
	string, //phraseSting,
	number, //phraseId,
	PhraseDataRaw //phraseData,
];

declare type Message = [
	number, //timestamp,
	string, //timeSting,
	string, //phraseSting,
	number, //phraseId,
	PhraseData, //phraseData,
	PhraseMeta //phraseMeta,
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

type PlainObject<T> = {
    [key: string]: T;
};




type SetInput = {
	type: string;
	name: string;
	value?: any,
	addOn?: string,
	isInline?: boolean;
}
type SetField0 = {
	label: string;
	name: string;
	note?: string;
	isToggle?: boolean;
	isInline?: boolean;
	value?: any;
	inputs?: SetInput[];
}
type SetField1 = SetField0 & {
	subs?: SetField0[];
}

type SetField = SetField0 & {
	subs?: SetField1[];
}

type Sets = {
	title: string,
	fields: SetField[];
}

type SettingsValue = number|string|boolean|null;
type SettingsData = {
	name: string;
	value: SettingsValue;
};
type SettingsValues = PlainObject<SettingsValue>;

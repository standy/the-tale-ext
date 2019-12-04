///<reference path="../../node_modules/@types/jquery/index.d.ts"/>
///<reference path="../../node_modules/typescript/lib/lib.es6.d.ts"/>
///<reference path="../../node_modules/typescript/lib/lib.es2016.array.include.d.ts"/>

interface Window {
	ext: any;
	extPath: string;
	API_CLIENT: string;
	widgets: any;
}

declare module '*.css' {
	const css: any;
	export default css;
}

declare const pgf: any;

type PhraseNumberKey = 'damage' | 'health' | 'coins' | 'sell_price';

declare type PhraseDataRaw = {
	[key: string]: string;
};

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
	companion?: string,
	mob?: string,
	hero?: string,
	destination?: string,
	current_destination?: string,
	coins?: number,
	artifact?: string,
	sell_price?: number,
	old_artifact?: string,
	experience?: number,
};

declare type PhraseMeta = {
	/* чей скилл сработал */
	owner: SkillOwner,
};

declare const enum MSG {
	TimeStamp = 0,
	TimeSting = 1,
	PhraseSting = 2,
	PhraseId = 3,
	PhraseData = 4,
	PhraseMeta = 5,
}

declare type MessageRaw = [
	number, // timestamp,
	string, // timeSting,
	string, // phraseSting,
	number, // phraseId,
	PhraseDataRaw // phraseData,
];

declare type Message = [
	number, // timestamp,
	string, // timeSting,
	string, // phraseSting,
	number, // phraseId,
	PhraseData, // phraseData,
	PhraseMeta // phraseMeta,
];

declare type GameData = any;

declare type ActType = 'block'|'inline';
declare type ActToHtml = (phraseData: PhraseData) => string;
declare type Act = {
	fn: ActToHtml;
	type: ActType
};
declare type ActsByIds = {
	[id: number]: Act;
};


declare type Icon = string;

type PlainObject<T> = {
	[key: string]: T;
};

type Callback<DataType> = ((arg: DataType) => void);




type SetInput = {
	type: string;
	name: keyof SettingsValues;
	value?: any,
	addOn?: string,
	isInline?: boolean;
};
type SetField0 = {
	label: string;
	name: keyof SettingsValues|'';
	note?: string;
	isToggle?: boolean;
	isInline?: boolean;
	value?: any;
	inputs?: SetInput[];
};
type SetField1 = SetField0 & {
	subs?: SetField0[];
};

type SetField = SetField0 & {
	subs?: SetField1[];
};

type Sets = {
	title: string,
	fields: SetField[];
};

type SettingsValues = {
	notify: boolean;
	notifyQuestChoose: boolean;
	notifyHeroIdle: boolean;
	notifyHeroHp: boolean;
	notifyHeroHpLowerValue: number;
	notifyHeroEnergy: boolean;
	notifyHeroEnergyGreaterValue: number;
	extHtml: boolean;
	maxLogLength: number;
	autohelp: boolean;
	autohelpNotify: boolean;
	autohelpIdle: boolean;
	autohelpDead: boolean;
	autohelpHp: boolean;
	autohelpHpLowerValue: number;
	autohelpHpBoss: boolean;
	autohelpCompanion: boolean;
	autohelpCompanionHp: number;
	autohelpEnergy: boolean;
	autohelpEnergyGreaterValue: number;
	autohelpEnergyFight: boolean;
	autohelpEnergyRest: boolean;
	autohelpEnergyWalk: boolean;
	autohelpEnergyTradeMed: boolean;
	autoquest: boolean;
	autoquestNotify: boolean;
	autoquestHonor: boolean;
	autoquestHonorPlus: boolean;
	autoquestHonorMinus: boolean;
	autoquestPeace: boolean;
	autoquestPeacePlus: boolean;
	autoquestPeaceMinus: boolean;
	autocard: boolean;
	cleanInventory: boolean;
	cleanInventorySlots: number;
	autoFollowHero: boolean;
};
type SettingsValue = SettingsValues[keyof SettingsValues];
type SettingsData = {
	name: keyof SettingsValues;
	value: SettingsValue;
};


declare const enum ACTION_TYPE_NAMES {
	idle, // безделие
	quest, // задание
	walk, // путешествие между городами
	fight, // сражение 1x1 с монстром
	dead, // воскрешение
	city, // действия в городе
	rest, // отдых
	equip, // экипировка
	trade, // торговля
	nearcity, // путешествие около города
	energy, // восстановление энергии
	noeffect, // действие без эффекта на игру
	proxy, // прокси-действия для взаимодействия героев
	pvp, // PvP 1x1
	test, // проверочное действие
	companionHeal, // уход за спутником
}

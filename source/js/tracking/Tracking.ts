///<reference path="../typings.d.ts"/>
import EventEmitter from "../utils/EventEmitter";
import {MAX_LOG_LENGTH, PHRASE_NUMBER_KEYS} from '../utils/const/vars';
import clientStorage from '../utils/clientStorage';
import storage from '../storage/storage';

const NEGATIVE_PHRASE_ID = [
	1,
	11,
	12,
	280001,
	280004,
	280010,
	280014,
	280016,
	280019,
];
const COMPANION_PHRASE_ID = [
	580003,
	580004,
];

/**
 * Позволяет подписаться на обновление данных
 */
export default class Tracking {
	messagesLog: MessageRaw[] = clientStorage.get('messagesLog') || [];
	onNewTurn = EventEmitter<any>();
	onNewMessages = EventEmitter<Message[]>();
	onLoad = EventEmitter();

	private onLoadDone = false;

	constructor() {
		this.emitLoad();
	}


	getMessagesLog(): Message[] {
		return this.messagesLog.map(Tracking.convertMessageFromRaw);
	}

	static convertMessageFromRaw(messageRaw: MessageRaw): Message {
		return [
			messageRaw[MSG.TimeStamp],
			messageRaw[MSG.TimeSting],
			messageRaw[MSG.PhraseSting],
			messageRaw[MSG.PhraseId],
			Tracking.convertPhraseDataFromRaw( messageRaw[MSG.PhraseData]), /*phraseData*/
			Tracking.getMeta(messageRaw), /*phraseMeta*/
		] as Message;
	}

	static convertPhraseDataFromRaw(phraseDataRaw: PhraseDataRaw): PhraseData {
		const phraseData = Object.assign({}, phraseDataRaw) as PhraseData;
		for (let i = 0; i < PHRASE_NUMBER_KEYS.length; i++) {
			const key = PHRASE_NUMBER_KEYS[i];
			if (typeof phraseDataRaw[key] === 'string') phraseData[key] = +phraseDataRaw[key];
		}
		return phraseData;
	}

	static getMeta(message: MessageRaw): PhraseMeta {
		const phraseId = message[MSG.PhraseId];
		const phraseDataRaw = message[MSG.PhraseData];
		const actor = phraseDataRaw.attacker || phraseDataRaw.actor;
		const isMyName = actor === storage.heroName;
		const isMe = isMyName !== NEGATIVE_PHRASE_ID.includes(phraseId);
		const isCompanion = !isMyName && actor === storage.companionName || COMPANION_PHRASE_ID.includes(phraseId);
		const owner = isMe
			? SkillOwner.me
			: isCompanion
				? SkillOwner.companion
				: SkillOwner.mob;

		return {owner: owner};
	}

	private track(game_data: GameData) {
		if (!this.onLoadDone) return;

		const hero = game_data.account.hero;
		if (!hero) return;

		const messagesLog = this.messagesLog;

		const lastLog = messagesLog[messagesLog.length - 1] || [];
		const lastTimestamp = lastLog[MSG.TimeStamp];
		const messages: MessageRaw[] = hero.messages;
		const messagesNew: Message[] = [];
		for (let i = 0; i < messages.length; i++) {
			const messageRaw = messages[i];
			const message = Tracking.convertMessageFromRaw(messageRaw);

			// console.log('time>', lastTimestamp, message[0], message[0] > lastTimestamp, lastLog[1], message[1]);
			if (!lastTimestamp || message[MSG.TimeStamp] > lastTimestamp) {
				messagesLog.push(messageRaw);
				messagesNew.push(message);
			}
		}

		this.messagesLog = messagesLog.slice(messagesLog.length - MAX_LOG_LENGTH);
		clientStorage.set('messagesLog', this.messagesLog);

		this.onNewTurn.emit(hero);
		if (messagesNew.length) {
			this.onNewMessages.emit(messagesNew);
		}
	}


	private emitMessages() {
		$(document).on(`${pgf.game.events.DATA_REFRESHED}.ext-tracking`, (e, game_data) => {
			this.track(game_data);
		});
	}
	private emitLoad() {
		this.onLoadDone = false;
		$(document).on('ajaxSuccess.ext', (event, XMLHttpRequest, setting, result) => {
			if (this.onLoadDone || setting.url.indexOf('/game/api/info') !== 0) {
				return;
			}
			const game_data = result.data;
			if (game_data.account.is_old) {
				return;
			}
			this.onLoadDone = true;

			const hero = game_data.account.hero;
			storage.heroName = hero.base.name;
			storage.companionName = hero.companion && hero.companion.name.toLowerCase();

			this.onLoad.emit(game_data);
			this.track(game_data);
			this.emitMessages();

			$(document).off('ajaxSuccess.ext');
		});
	}

	clear() {
		clientStorage.set('messagesLog', '');
		this.messagesLog = [];
	}
}

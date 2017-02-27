///<reference path="../typings.d.ts"/>
import EventEmitter from "../utils/EventEmitter";
import {MAX_LOG_LENGTH} from '../utils/const';
import clientStorage from '../utils/clientStorage';
import store from '../storage/storage';


/**
 * Позволяет подписаться на обновление данных
 */
export default class Tracking {
	messagesLog:Message[] = clientStorage.get('messagesLog');
	onNewTurn = EventEmitter<Message[]>();
	onNewMessages = EventEmitter<Message[]>();
	onLoad = EventEmitter();

	private onLoadDone = false;

	constructor() {
		this.emitMessages();
		this.emitLoad();
	}


	getMessagesLog() {
		return this.messagesLog;
	}

	private track(game_data: GameData) {
		if (!this.onLoadDone) return;

		const hero = game_data.account.hero;
		if (!hero) return;

		const messagesLog = this.messagesLog;

		const lastLog = messagesLog[messagesLog.length - 1] || [];
		const lastTimestamp = lastLog[MSG.TimeStamp];
		const messages:Message[] = hero.messages;
		const messagesNew:Message[] = [];
		for (let i = 0; i < messages.length; i++) {
			const message = messages[i];
			// console.log('time>', lastTimestamp, message[0], message[0] > lastTimestamp, lastLog[1], message[1]);
			if (!lastTimestamp || message[MSG.TimeStamp] > lastTimestamp) {
				messagesLog.push(message);
				messagesNew.push(message);
			}
		}

		this.messagesLog = messagesLog.slice(messagesLog.length - MAX_LOG_LENGTH);
		clientStorage.set('messagesLog', this.messagesLog);

		this.onNewTurn.emit(messagesNew);
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
			store.heroName = hero.base.name;
			store.companionName = hero.companion && hero.companion.name.toLowerCase();

			this.onLoad.emit(game_data);

			$(document).off('ajaxSuccess.ext');
		});
	}
}

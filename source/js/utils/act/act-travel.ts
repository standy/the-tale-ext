///<reference path="../../typings.d.ts"/>
import ICONS from '../icons';
import {act} from './act';

export default {
	120001: {fn: travel(ICONS.travel), type: 'block'}, // Журнал: Путешествие
	120002: {fn: travel(ICONS.travel), type: 'block'}, // Журнал: Путешествие, дальняя дорога
	120003: {fn: travel(ICONS.travelWagon), type: 'block'}, // Журнал: Подвезли караваном
	180001: {fn: rest(ICONS.rest), type: 'inline'}, // Журнал: Отдых
	220001: {fn: tradeSell, type: 'inline'}, // Журнал: Продажа

	80001: {fn: tradeBuy, type: 'inline'}, // Дневник: Покупка артефакта
	80002: {fn: tradeChange, type: 'inline'}, // Дневник: Покупка артефакта и замена
	80003: {fn: tradeChange, type: 'inline'}, // Дневник: Покупка аналогичного артефакта и замена

} as ActsByIds;


function tradeSell(phraseData: PhraseData) {
	// coins	количество монет
	// hero	герой
	// artifact	предмет
	return act('trade', `<span class="artifact">${phraseData.artifact}</span>→<span class="coins">${phraseData.coins}${ICONS.trade}</span>`);
}

function tradeBuy(phraseData: PhraseData) {
	// coins	количество монет
	// hero	герой
	// artifact	предмет
	return act('trade', `<span class="coins">${phraseData.coins}${ICONS.trade}→<span class="artifact">${phraseData.artifact}</span></span>`)
}

function tradeChange(phraseData: PhraseData) {
	// sell_price	цена продажи
	// hero	герой
	// old_artifact?	старый артефакт
	// coins	количество монет
	// artifact	предмет

	return (
		tradeSell({
			artifact: phraseData.old_artifact || phraseData.artifact,
			hero: phraseData.hero,
			coins: phraseData.sell_price,
		}) +
		'|' +
		tradeBuy({
			artifact: phraseData.artifact,
			hero: phraseData.hero,
			coins: phraseData.coins,
		})
	)
}

function rest(icon: Icon) {
	// hero	герой
	// health	количество здоровья
	return (phraseData: PhraseData) => act('positive', `${icon}<span class="heal">${phraseData.health}</span>`);
}

function travel(icon: Icon) {
	// destination	конечное место назначения
	// hero	герой
	// current_destination	текущее место назначения
	return (phraseData: PhraseData) => act('', `${icon} ${phraseData.destination}`);
}

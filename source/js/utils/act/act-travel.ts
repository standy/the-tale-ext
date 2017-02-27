///<reference path="../../typings.d.ts"/>
import ICONS from '../icons';
import {act} from './act';

export default {
	120001: {fn: travel(ICONS.travel), type: 'block'}, // Журнал: Путешествие
	120002: {fn: travel(ICONS.travel), type: 'block'}, // Журнал: Путешествие, дальняя дорога
	120003: {fn: travel(ICONS.travelWagon), type: 'block'}, // Журнал: Подвезли караваном
	180001: {fn: rest(ICONS.rest), type: 'inline'}, // Журнал: Отдых
	220001: {fn: trade(ICONS.trade), type: 'inline'}, // Журнал: Продажа
} as ActsByIds;

function fn(phraseData: PhraseData) {
	return 'rest';
}

function trade(icon: Icon) {
	// coins	количество монет
	// hero	герой
	// artifact	предмет
	return (phraseData: PhraseData) => act('trade', `<span class="artifact">${phraseData.artifact}</span>→<span class="coins">${phraseData.coins}${icon}</span>`);
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

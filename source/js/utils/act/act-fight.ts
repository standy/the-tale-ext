///<reference path="../../typings.d.ts"/>
import ICONS from '../const/icons';
import {actPositive, actNegative} from './act';

declare type Icon = string;

export default {
	1: {fn: debuff(ICONS.stun), type: 'inline'}, // 'Журнал: Стан'
	11: {fn: dot(ICONS.flame), type: 'inline'}, // Журнал: Периодический урон огнём
	12: {fn: dot(ICONS.poisoncloud), type: 'inline'}, // Журнал: Периодический урон ядом

	280000: {fn: damage(ICONS.fire), type: 'inline'}, // Журнал: Пиромания
	280001: {fn: miss(ICONS.fire), type: 'inline'}, // Журнал: Пиромания (промах)
	280002: {fn: cast(ICONS.slow), type: 'inline'}, // Журнал: Контроль
	280003: {fn: damage(''), type: 'inline'}, // Журнал: Удар
	280004: {fn: miss(ICONS.hit), type: 'inline'}, // Журнал: Удар (Промах)
	280005: {fn: buff(ICONS.miss), type: 'inline'}, // Журнал: Последний шанс
	280006: {fn: buff(ICONS.strength), type: 'inline'}, // Журнал: Ярость
	280007: {fn: cast(ICONS.poison), type: 'inline'}, // Журнал: Ядовитость
	280008: {fn: heal(ICONS.heal), type: 'inline'}, // Журнал: Регенерация
	280009: {fn: damage(ICONS.stunHit), type: 'inline'}, // Журнал: Ошеломление
	280010: {fn: miss(ICONS.stunHit), type: 'inline'}, // Журнал: Ошеломление (промах)
	280011: {fn: cast(ICONS.disorientation), type: 'inline'}, // Журнал: Дезориентация
	280012: {fn: cast(ICONS.speed), type: 'inline'}, // Журнал: Ускорение
	280013: {fn: damage(ICONS.might), type: 'inline'}, // Журнал: Сильный удар
	280014: {fn: miss(ICONS.might), type: 'inline'}, // Журнал: Сильный удар (промах)
	280015: {fn: vampire(ICONS.vampire), type: 'inline'}, // Журнал: Вампиризм
	280016: {fn: miss(ICONS.vampire), type: 'inline'}, // Журнал: Вампиризм (промах)
	280017: {fn: companionHeal(ICONS.heal), type: 'inline'}, // Журнал: Герой лечит спутника
	280018: {fn: reckless(ICONS.reckless), type: 'inline'}, // Журнал: Безрассудная атака
	280019: {fn: miss(ICONS.reckless), type: 'inline'}, // Журнал: Безрассудная атака (промах)

	580003: {fn: companionDefended(ICONS.miss), type: 'inline'}, // Журнал: спутник защитил своего владельца от удара
	580004: {fn: companionInjured(), type: 'inline'}, // Журнал: спутник защитил своего владельца от удара, но получил рану
} as ActsByIds;


function damage(icon: Icon) {
	// attacker	атакующий
	// damage	количество урона
	// defender	защищающийся
	return (phraseData: PhraseData) => actPositive(
		phraseData.attacker,
		`<span class="damage">${phraseData.damage}</span>${icon}`
	);
}
function miss(icon: Icon) {
	// attacker	атакующий
	// defender	защищающийся
	return (phraseData: PhraseData) => actNegative(
		phraseData.attacker,
		`${icon}<span class="sub-icon">${ICONS.miss}</span>`
	);
}
function cast(icon: Icon) {
	// attacker	атакующий
	// defender	защищающийся
	return (phraseData: PhraseData) => actPositive(
		phraseData.attacker,
		`${icon}`
	);
}
function buff(icon: Icon) {
	// actor	герой или монстр
	return (phraseData: PhraseData) => actPositive(
		phraseData.actor,
		`${icon}`
	);
}
function debuff(icon: Icon) {
	// actor	герой или монстр
	return (phraseData: PhraseData) => actNegative(
		phraseData.actor,
		`${icon}`
	);
}
function reckless(icon: Icon) {
	// attacker	атакующий
	// defender	защищающийся
	// damage	количество урона
	// attacker_damage	количество урона по атакующему
	return (phraseData: PhraseData) => actPositive(
		phraseData.attacker,
		`<span class="damage">${phraseData.damage}</span>${icon}<span class="damage-reverse">${phraseData.attacker_damage}</span>`
	);
}
function vampire(icon: Icon) {
	// attacker	атакующий
	// health	количество вылеченного здоровья
	// damage	количество урона
	// defender	защищающийся
	return (phraseData: PhraseData) => actPositive(
		phraseData.attacker,
		`<span class="damage">${phraseData.damage}</span>${icon}<span class="vamp">${phraseData.health}</span>`
	);
}
function dot(icon: Icon) {
	// damage	количество урона
	// actor	герой или монстр
	return (phraseData: PhraseData) => actNegative(
		phraseData.actor,
		`<span class="damage">${phraseData.damage}</span>${icon}`
	);
}
function heal(icon: Icon) {
	// health	количество вылеченного здоровья
	// actor	герой или монстр
	return (phraseData: PhraseData) => actPositive(
		phraseData.actor,
		`<span class="heal">${phraseData.health}</span>${icon}`
	);
}
function companionHeal(icon: Icon) {
	// actor	герой или монстр
	// companion	спутник
	// health	количество вылеченного здоровья
	return (phraseData: PhraseData) => actPositive(
		phraseData.actor,
		`${ICONS.companion}<span class="heal">${phraseData.health}</span>${icon}`
	);
}
function companionDefended(icon: Icon) {
	// companion_owner	владелец спутника
	// companion	спутник
	// attacker	атакущий спутника
	return (phraseData: PhraseData) => actPositive(
		phraseData.companion_owner,
		`${ICONS.companion}${icon}`
	);
}
function companionInjured() {
	// companion_owner	владелец спутника
	// companion	спутник
	// attacker	атакущий спутника
	// damage	урон
	return (phraseData: PhraseData) => actPositive(
		phraseData.attacker,
		`${ICONS.companion}${phraseData.damage}`
	);
}

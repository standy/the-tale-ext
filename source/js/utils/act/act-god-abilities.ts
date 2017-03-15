///<reference path="../../typings.d.ts"/>
import ICONS from '../const/icons';
import {act} from './act';

const CRIT = '!';

export default {
	// 240002: {fn: test, type: 'block'}, // Журнал: Вызов ремонтника
	// 240003: {fn: test, type: 'block'}, // Журнал: Вызов ремонтника (критический эффект)
	// 240004: {fn: test, type: 'block'}, // Журнал: Выкинуть самый дешёвый предмет из рюкзака
	// 240005: {fn: test, type: 'block'}, // Журнал: Выкинуть самый дешёвый предмет из рюкзака (критическое срабатывание)
	240006: {fn: abilityExp(), type: 'block'}, // Журнал: Получение опыта
	240008: {fn: abilityHeal(''), type: 'inline'}, // Журнал: Лечение
	240009: {fn: abilityHeal('', CRIT), type: 'inline'}, // Журнал: Лечение (критический эффект)
	240010: {fn: abilityDamage(), type: 'inline'}, // Журнал: Нанесение урона
	240011: {fn: abilityDamage(CRIT), type: 'inline'}, // Журнал: Нанесение урона (критический эффект)
	240012: {fn: abilityCoins(), type: 'inline'}, // Журнал: Создание денег
	240013: {fn: abilityCoins(CRIT), type: 'inline'}, // Журнал: Создание денег (критический эффект)
	240014: {fn: abilityText('воскрешение'), type: 'block'}, // Журнал: Воскрешение
	240015: {fn: abilityMove('телепорт'), type: 'block'}, // Журнал: Короткий телепорт
	240016: {fn: abilityMove('телепорт', CRIT), type: 'block'}, // Журнал: Короткий телепорт (критический эффект)
	240017: {fn: abilityMove('начало задания'), type: 'block'}, // Журнал: Начало задания.
	240018: {fn: abilityText('запасение энергии'), type: 'block'}, // Журнал: Запасение энергии
	240019: {fn: abilityText('запасение энергии', CRIT), type: 'block'}, // Журнал: Запасение энергии (критический эффект)
	240020: {fn: abilityHeal(ICONS.companion), type: 'inline'}, // Журнал: Лечение спутника
	240021: {fn: abilityHeal(ICONS.companion, CRIT), type: 'inline'}, // Журнал: Лечение спутника (критический эффект)
	300006: {fn: abilityGiftReturn(), type: 'block'}, // Журнал: Детский подарок вернулся к ребёнку
} as ActsByIds;


function abilityText(text: string, crit = '') {
	return (phraseData: PhraseData) =>
		act('god', `${ICONS.god}${text}${crit}`);
}

function abilityGiftReturn() {
	// hero	герой
	// artifact	артефакт
	return (phraseData: PhraseData) =>
		act('god', `${ICONS.god}${phraseData.artifact}→вернулся ребёнку`);
}

function abilityMove(text: string, crit = '') {
	// hero	герой
	return (phraseData: PhraseData) =>
		act('god', `${ICONS.god}${ICONS.travel}${text}${crit}`);
}

function abilityExp(crit = '') {
	// hero	герой
	// experience	количество опыта
	return (phraseData: PhraseData) =>
		act('god', `${ICONS.god}+${phraseData.experience}${crit} опыта`);
}

function abilityCoins(crit = '') {
	// coins	количество монет
	// hero	герой
	return (phraseData: PhraseData) =>
		act('god', `${ICONS.god}${phraseData.coins}${crit}${ICONS.trade}`);
}

function abilityHeal(icon: string, crit = '') {
	// hero	герой
	// health	количество здоровья
	// companion?	спутник
	return (phraseData: PhraseData) =>
		act('god', `${ICONS.god}${phraseData.health}${crit}${ICONS.heal}${icon}`);
}

function abilityDamage(crit = '') {
	// attacker	атакующий
	// damage	количество урона
	// defender	защищающийся
	return (phraseData: PhraseData) => act('god',
		`${ICONS.god}<span class="damage">${phraseData.damage}${crit}</span>${ICONS.hit}`
	);
}

///<reference path="../../typings.d.ts"/>
import ICONS from '../const/icons';
import MOBS from '../const/mobs';
import ARTIFACTS from '../const/artifacts';
import {act} from './act';

export default {
	// 3: {fn: fn, type: 'block'}, // Дневник: Герой убит'
	// 4: {fn: fn, type: 'block'}, // Дневник: Получить опыт за убийство монстра'
	// 5: {fn: fn, type: 'block'}, // Журнал: Герой убит'
	6: { fn: flightStart(ICONS.fight, ICONS.death), type: 'block' }, // Журнал: Убить до боя'
	7: { fn: flightStart(ICONS.fight, ICONS.travel), type: 'block' }, // Журнал: Противник бежит в страхе'
	8: { fn: mobAct(ICONS.death), type: 'inline' }, // Журнал: Монстр убит'
	9: { fn: lootEmpty, type: 'block' }, // Журнал: Нет добычи'
	10: { fn: flightStart(ICONS.peace), type: 'block' }, // Журнал: Мирно разойтись с разумным двуногим противником'
	13: { fn: loot(''), type: 'block' }, // Журнал: Герой забрал добычу'
	14: { fn: loot('drop', ' (нет места)'), type: 'block' }, // Журнал: Нет места в рюкзаке'
	15: { fn: flightStart(ICONS.fight), type: 'block' }, // Журнал: Начало боя'
	16: { fn: flightStart(ICONS.fight, ICONS.companion), type: 'block' }, // Журнал: спутник героя изгоняет демона'
	// 17: {fn: fn, type: 'block'}, // Дневник: Герой и враг убили друг друга'
	// 18: {fn: fn, type: 'block'}, // Журнал: Герой и враг убили друг друга'
} as ActsByIds;


function flightStart(icon: string, icon2 = '') {
	// mob	монстр
	// hero	герой
	// companion?	спутник
	return (phraseData: PhraseData) => {
		const mob = MOBS.filter(m => m.name === phraseData.mob)[0] ||
			({ level: 'неизвестен', id: "неизвестен" });
		return act('', `${icon} ${icon2} ${phraseData.mob} (уровень ${mob.level}) <a href="/guide/mobs/${mob.id}">#</a>`);
	}
}

function mobAct(icon: string) {
	// mob	монстр
	// hero	герой
	return (phraseData: PhraseData) => {
		return act('', `${icon} ${phraseData.mob}`);
	}
}

function lootEmpty(phraseData: PhraseData) {
	// mob	монстр
	// hero	герой
	return act('loot empty', `нет добычи`);
}

function loot(modificator: string, msg: string = '') {
	// mob	монстр
	// hero	герой
	// artifact	предмет
	return (phraseData: PhraseData) => {
		const artifact = ARTIFACTS.filter(m => m.name === phraseData.artifact)[0];
		const artifactHtml = artifact
			? `<a href="/guide/artifacts/${artifact.id}">${phraseData.artifact}</a>`
			: phraseData.artifact;
		return act(`loot ${modificator}`, `${ICONS.loot} <span class="artifact">${artifactHtml}</span>${msg}`);
	}
}

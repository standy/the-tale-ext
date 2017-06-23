///<reference path="../../typings.d.ts"/>

import {createTab} from '../tabs';
import actFight from '../../utils/act/act-fight';
import {PHRASE_ID_TO_TEXT} from '../../utils/const/texts';
import {PHRASE_NUMBER_KEYS} from '../../utils/const/vars';
import ICONS from '../../utils/const/icons';

type StatsByPhraseAndOwner = PhraseMeta & {
	phraseId: number,
	count: number,
	example: string,
	phraseData: PhraseData,
};

export default class Stats {
	tab = createTab('статистика');
	statistics: StatsByPhraseAndOwner[] = [];

	static drawCellByStat(stat?: StatsByPhraseAndOwner) {
		if (!stat) return '';
		const phraseId = stat.phraseId;

		const averagePhraseData: PhraseData = {} as PhraseData;
		Object.keys(stat.phraseData).forEach((key: keyof PhraseData) => {
			const value = stat.phraseData[key];
			if (PHRASE_NUMBER_KEYS.includes(key as PhraseNumberKey)) {
				if (value) {
					averagePhraseData[key] = Math.round((value as number) / stat.count);
				}
			} else {
				averagePhraseData[key] = value;
			}
		});

		const cell =
			`<span title="${stat.example}\n${JSON.stringify(averagePhraseData).replace(/"/g, '&quot;')}">` +
				`${actFight[phraseId].fn(averagePhraseData)}x${stat.count}` +
			`</span>`;
		return cell;
	}

	static drawTotalCount(count: number, icon: string = '') {
		return `<span class="act">${icon}x${count}</span>`;
	}

	addToStats(messages: Message[]) {
		this.addPhrases(messages);
		this.drawStats();
	}

	clear() {
		this.statistics = [];
		this.tab.$content.html('');
	}

	private addPhrases(messages: Message[]) {
		for (let i = 0; i < messages.length; i++) {
			const message = messages[i];

			const phraseId = message[MSG.PhraseId];
			if (statsList.includes(phraseId)) {
				this.addPhrase(message);
			}
		}
	}

	private addPhrase(message: Message) {

		const phraseSting = message[MSG.PhraseSting];
		const phraseId = message[MSG.PhraseId];
		const phraseData = message[MSG.PhraseData];
		const phraseMeta = message[MSG.PhraseMeta];

		const owner = phraseMeta.owner;
		const statInList = this.statistics.find(s => s.owner === owner && s.phraseId === phraseId);
		if (!statInList) {
			this.statistics.push({
				owner: owner,
				phraseId: phraseId,
				count: 1,
				example: phraseSting,
				phraseData: phraseData,
			});
		} else {
			statInList.count++;
			for (let i = 0; i < PHRASE_NUMBER_KEYS.length; i++) {
				const numberKey = PHRASE_NUMBER_KEYS[i];
				const value = phraseData[numberKey];
				if (value) {
					statInList.phraseData[numberKey] = (statInList.phraseData[numberKey] || 0) + value;
				}
			}
		}
	}

	private drawStats() {
		const phraseIds: number[] = [];
		for (let i = 0; i < this.statistics.length; i++) {
			const stat = this.statistics[i];
			if (!phraseIds.includes(stat.phraseId)) phraseIds.push(stat.phraseId);
		}
		phraseIds.sort((a, b) => a - b);

		let html = ``;

		let countMe = 0;
		let countCompanion = 0;
		let countMob = 0;
		for (let i = 0; i < phraseIds.length; i++) {
			const phraseId = phraseIds[i];
			const text = (PHRASE_ID_TO_TEXT as any)[phraseId];
			const statsMe = this.statistics.find(s => s.owner === SkillOwner.me && s.phraseId === phraseId);
			const statsCompanion = this.statistics.find(s => s.owner === SkillOwner.companion && s.phraseId === phraseId);
			const statsMob = this.statistics.find(s => s.owner === SkillOwner.mob && s.phraseId === phraseId);
			if (statsMe) countMe += statsMe.count;
			if (statsCompanion) countCompanion += statsCompanion.count;
			if (statsMob) countMob += statsMob.count;
			html +=
				`<tr>` +
					`<th>${text}</th>` +
					`<td>${
						Stats.drawCellByStat(statsMe) +
						(statsMe && statsCompanion ? `<br>` : '') +
						Stats.drawCellByStat(statsCompanion)
					}</td>` +
					`<td>${Stats.drawCellByStat(statsMob)}</td>` +
				`</tr>`;
		}

		html +=
			`<tr>` +
				`<th>Всего кол-во</th>` +
				`<td>${
					Stats.drawTotalCount(countMe) +
					(countCompanion
						? `<br>${Stats.drawTotalCount(countCompanion, ICONS.companion)}`
						: ''
					)
				}</td>` +
				`<td>${Stats.drawTotalCount(countMob)}</td>` +
			`</tr>`;

		const $root = this.tab.$content;
		$root.html(
			`<table class="table-stats">` +
				`<thead>` +
					`<tr>` +
						`<td></td>` +
						`<td>Герой</td>` +
						`<td>Моб</td>` +
					`</tr>` +
				`</thead>` +
				`<tbody>` +
					html +
				`</tbody>` +
			`</table>`
			// `<pre>${JSON.stringify(this.statistics, null, 2)}</pre>`
		);
	}
}


const statsList = [
	1, // 'Журнал: Стан'
	11, // Журнал: Периодический урон огнём
	12, // Журнал: Периодический урон ядом
	280000, // Журнал: Пиромания
	280001, // Журнал: Пиромания (промах)
	280002, // Журнал: Контроль
	280003, // Журнал: Удар
	280004, // Журнал: Удар (Промах)
	280005, // Журнал: Последний шанс
	280006, // Журнал: Ярость
	280007, // Журнал: Ядовитость
	280008, // Журнал: Регенерация
	280009, // Журнал: Ошеломление
	280010, // Журнал: Ошеломление (промах)
	280011, // Журнал: Дезориентация
	280012, // Журнал: Ускорение
	280013, // Журнал: Сильный удар
	280014, // Журнал: Сильный удар (промах)
	280015, // Журнал: Вампиризм
	280016, // Журнал: Вампиризм (промах)
	280017, // Журнал: Герой лечит спутника
	280018, // Журнал: Безрассудная атака
	280019, // Журнал: Безрассудная атака (промах)
	580003, // Журнал: спутник защитил своего владельца от удара
	580004, // Журнал: спутник защитил своего владельца от удара, но получил рану
];

import CONST from '../utils/const';

export const setsGame = [
	{
		title: 'Персонаж',
		fields: [{
			label: 'Начало имени героя:',
			note: 'Общая часть имени для всех падежей',
			inputs: [{
				name: 'heroNameStart',
				type: 'text',
			}],

		}],
	},
	{
		title: 'Уведомления',
		fields: [{
			label: 'Отправлять уведомления',
			name: 'notify',
			isToggle: 1,
			value: true,
			subs: [{
				label: 'Выбор в задании',
				name: 'notifyQuestChoose',
				isToggle: 1,
				value: true,
			}, {
				label: 'Герой бездействует',
				name: 'notifyHeroIdle',
				isToggle: 1,
				value: true,
			/*}, {
				label: 'Герой воскресает',
				name: 'notifyHeroDead',
				isToggle: 1,
				value: true*/
			}, {
				label: 'Здоровье ниже ',
				name: 'notifyHeroHp',
				isToggle: 1,
				value: true,
				inputs: [{
					type: 'num',
					name: 'notifyHeroHpLowerValue',
					value: 200,
				}],
			}, {
				label: 'Энергия выше ',
				name: 'notifyHeroEnergy',
				isToggle: 1,
				value: true,
				inputs: [{
					type: 'num',
					name: 'notifyHeroEnergyGreaterValue',
					value: 9,
				}],
			}],
		}],
	},
	{
		title: 'Статистика',
		fields: [{
			label: 'Уровень героя: последний, или',
			name: 'statsByLevel',
			isToggle: 1,
			value: true,
			inputs: [{
				type: 'num',
				name: 'statsByLevelValue',
			}],
		}, {
			label: 'Монстр: последний, или',
			name: 'statsByMob',
			isToggle: 1,
			value: true,
			inputs: [{
				type: 'num',
				name: 'statsByMobId',
				addOn: 'ID',
			}],
			subs: [{
				label: 'Статистика героя против монстра',
				name: 'myStatsByMob',
				isToggle: 1,
				value: false,
			}],
		}, {
			label: 'Количество действий в статистике:',
			inputs: [{
				name: 'statsActionsCount',
				type: 'num',
			}],
		}],
	},
	{
		title: 'Отображение',
		fields: [{
			label: 'Выводить подробности действий',
			name: 'groupOpenOnDefault',
			isToggle: 1,
			value: true,
		}, {
			label: 'Показывать архив',
			name: 'showArchive',
			isToggle: 1,
			value: false,
		}],
	},
	{
		title: 'Хранилище <span id="storage-size"></span>',
		fields: [{
			label: 'Сообщений в кратком журнале:',
			inputs: [{
				name: 'maxLogLength',
				type: 'num',
				value: CONST.MAX_LOG_LENGTH,
			}],
		}, {
			label: 'Действий в архиве:',
			inputs: [{
				name: 'maxArchiveLength',
				type: 'num',
				value: CONST.MAX_ARCHIVE_LENGTH,
			}],
		}, {
			label: '<span class="link-ajax" id="reset-stats">Очистить хранилище</span>',
		}],
	},
];

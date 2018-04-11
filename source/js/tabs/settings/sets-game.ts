const MAX_LOG_LENGTH = 100000;

export const setsGame: Sets[] = [
	{
		title: 'Уведомления',
		fields: [{
			label: 'Отправлять уведомления (<span class="link-ajax" id="test-notifications">тест</span>)',
			name: 'notify',
			isToggle: true,
			value: false,
			subs: [{
				label: 'Выбор в задании',
				name: 'notifyQuestChoose',
				isToggle: true,
				value: true,
			}, {
				label: 'Герой бездействует',
				name: 'notifyHeroIdle',
				isToggle: true,
				value: true,
			}, {
				label: 'Здоровье ниже ',
				name: 'notifyHeroHp',
				isToggle: true,
				value: true,
				inputs: [{
					type: 'num',
					name: 'notifyHeroHpLowerValue',
					value: 200,
				}],
			}, {
				label: 'Энергия выше ',
				name: 'notifyHeroEnergy',
				isToggle: true,
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
		title: 'Отображение',
		fields: [{
			label: 'Использовать глобальные стили расширения',
			name: 'extHtml',
			isToggle: true,
			value: true,
		}],
	},
	{
		title: 'Хранилище <span id="storage-size"></span>',
		fields: [{
			label: 'Сохранять последние сообщения:',
			name: '',
			inputs: [{
				name: 'maxLogLength',
				type: 'num',
				value: MAX_LOG_LENGTH,
			}],
		}, {
			name: '',
			label: '<span class="link-ajax" id="reset-stats">Очистить хранилище</span>',
		}],
	},
];

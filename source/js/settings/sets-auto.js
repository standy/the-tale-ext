export const setsAuto = [{
	title: 'Помощь герою (<span class="link-ajax" data-auto="rest">миролюбие</span>/<span class="link-ajax" data-auto="fight">агрессия</span>)',
	fields: [{
		label: 'Автоматическая помощь',
		note: 'Внимание! Настройки применяются в момент нажатия',
		name: 'autohelp',
		isToggle: 1,
		value: false,
		subs: [{
			label: 'Уведомлять о помощи',
			name: 'autohelpNotify',
			isToggle: 1,
			value: false,
		}, {
			label: 'Использовать бонусную энергию, оставить',
			note: 'Указанный запас энергии тратиться не будет',
			name: 'autohelpEnergyBonus',
			isToggle: 1,
			value: false,
			inputs: [{
				name: 'autohelpEnergyBonusMax',
				type: 'num',
			}],
		}, {
			label: 'Герой бездействует',
			name: 'autohelpIdle',
			isToggle: 1,
			value: true,
		}, {
			label: 'Герой воскресает',
			name: 'autohelpDead',
			isToggle: 1,
			value: true,
		}, {
			label: 'Здоровье в бою ниже ',
			name: 'autohelpHp',
			isToggle: 1,
			value: true,
			inputs: [{
				type: 'num',
				name: 'autohelpHpLowerValue',
				value: 200,
			}],
			subs: [{
				label: 'только против босса',
				name: 'autohelpHpBoss',
				isToggle: 1,
				isInline: 1,
				value: true,
			}],
		}, {
			label: 'Лечение спутника, если его здоровье меньше',
			name: 'autohelpCompanion',
			isToggle: 1,
			isInline: 1,
			value: true,
			inputs: [{
				type: 'num',
				name: 'autohelpCompanionHp',
				isInline: 1,
				value: 20,
			}],
		}, {
			label: 'Энергия выше ',
			name: 'autohelpEnergy',
			isToggle: 1,
			value: true,
			inputs: [{
				type: 'num',
				name: 'autohelpEnergyGreaterValue',
				value: 10,
			}],
			subs: [{
				label: 'в бою',
				name: 'autohelpEnergyFight',
				isToggle: 1,
				isInline: 1,
				value: false,
			}, {
				label: 'вне боя',
				name: 'autohelpEnergyRest',
				isToggle: 1,
				isInline: 1,
				value: false,
			}, {
				label: 'в пути',
				name: 'autohelpEnergyWalk',
				isToggle: 1,
				isInline: 1,
				value: true,
			}, {
				label: 'торг/медитация',
				name: 'autohelpEnergyTradeMed',
				isToggle: 1,
				isInline: 1,
				value: true,
			}, /*, {
				label: 'Починка',
				name: 'autohelpEnergyRepairBuilding',
				isToggle: 1,
				value: false,
				inputs: [{
					type: 'num',
					addOn: 'ID',
					name: 'autohelpEnergyRepairBuildingID'
				}, {
					type: 'num',
					addOn: 'X',
					name: 'autohelpEnergyRepairBuildingX'
				}, {
					type: 'num',
					addOn: 'Y',
					name: 'autohelpEnergyRepairBuildingY'
				}, {
					type: 'num',
					addOn: '%',
					name: 'autohelpEnergyRepairBuildingPercent'
				}]
			}*/
			],
		}],
	}, {
		label: 'Автоматический выбор в задании',
		name: 'autoquest',
		isToggle: 1,
		value: false,
		subs: [{
			label: 'Уведомлять о выборе',
			name: 'autoquestNotify',
			isToggle: 1,
			value: false,
		}, {
			label: 'Задания, влияющие на честь',
//					note: 'Доставка, сопроводить караван, пошпионить',
			name: 'autoquestHonor',
			isToggle: 1,
			value: true,
			subs: [{
				label: 'честно',
				name: 'autoquestHonorPlus',
				isToggle: 1,
				isInline: 1,
				value: true,
			}, {
				label: 'бесчестно',
				name: 'autoquestHonorMinus',
				isToggle: 1,
				isInline: 1,
				value: false,
			}],
		}, {
			label: 'Задания, влияющие на миролюбие',
//					note: 'Выбить долг',
			name: 'autoquestPeace',
			isToggle: 1,
			value: true,
			subs: [{
				label: 'миролюбиво',
				name: 'autoquestPeacePlus',
				isToggle: 1,
				isInline: 1,
				value: true,
			}, {
				label: 'воинственно',
				name: 'autoquestPeaceMinus',
				isToggle: 1,
				isInline: 1,
				value: false,
			}],
		}],
	}, {
		label: 'Брать карты',
		name: 'autocard',
		isToggle: 1,
		value: false,
	}],
}];

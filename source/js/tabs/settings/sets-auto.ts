export const setsAuto: Sets[] = [{
	title: 'Помощь герою (<span class="link-ajax" data-auto="rest">миролюбие</span>/<span class="link-ajax" data-auto="fight">агрессия</span>)',
	fields: [{
		label: 'Автоматическая помощь',
		note: 'Внимание! Настройки применяются в момент нажатия',
		name: 'autohelp',
		isToggle: true,
		value: false,
		subs: [{
			label: 'Уведомлять о помощи',
			name: 'autohelpNotify',
			isToggle: true,
			value: false,
		}, {
			label: 'Герой бездействует',
			name: 'autohelpIdle',
			isToggle: true,
			value: true,
		}, {
			label: 'Герой воскресает',
			name: 'autohelpDead',
			isToggle: true,
			value: true,
		}, {
			label: 'Здоровье в бою ниже ',
			name: 'autohelpHp',
			isToggle: true,
			value: true,
			inputs: [{
				type: 'num',
				name: 'autohelpHpLowerValue',
				value: 200,
			}],
			subs: [{
				label: 'только против босса',
				name: 'autohelpHpBoss',
				isToggle: true,
				isInline: true,
				value: true,
			}],
		}, {
			label: 'Лечение спутника, если его здоровье меньше',
			name: 'autohelpCompanion',
			isToggle: true,
			isInline: true,
			value: true,
			inputs: [{
				type: 'num',
				name: 'autohelpCompanionHp',
				isInline: true,
				value: 20,
			}],
		}, {
			label: 'Энергия выше ',
			name: 'autohelpEnergy',
			isToggle: true,
			value: true,
			inputs: [{
				type: 'num',
				name: 'autohelpEnergyGreaterValue',
				value: 10,
			}],
			subs: [{
				label: 'в бою',
				name: 'autohelpEnergyFight',
				isToggle: true,
				isInline: true,
				value: false,
			}, {
				label: 'вне боя',
				name: 'autohelpEnergyRest',
				isToggle: true,
				isInline: true,
				value: false,
			}, {
				label: 'в пути',
				name: 'autohelpEnergyWalk',
				isToggle: true,
				isInline: true,
				value: true,
			}, {
				label: 'торг/медитация',
				name: 'autohelpEnergyTradeMed',
				isToggle: true,
				isInline: true,
				value: true,
			}, /*, {
				label: 'Починка',
				name: 'autohelpEnergyRepairBuilding',
				isToggle: true,
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
		isToggle: true,
		value: false,
		subs: [{
			label: 'Уведомлять о выборе',
			name: 'autoquestNotify',
			isToggle: true,
			value: false,
		}, {
			label: 'Задания, влияющие на честь',
			// note: 'Доставка, сопроводить караван, пошпионить',
			name: 'autoquestHonor',
			isToggle: true,
			value: true,
			subs: [{
				label: 'честно',
				name: 'autoquestHonorPlus',
				isToggle: true,
				isInline: true,
				value: true,
			}, {
				label: 'бесчестно',
				name: 'autoquestHonorMinus',
				isToggle: true,
				isInline: true,
				value: false,
			}],
		}, {
			label: 'Задания, влияющие на миролюбие',
			// note: 'Выбить долг',
			name: 'autoquestPeace',
			isToggle: true,
			value: true,
			subs: [{
				label: 'миролюбиво',
				name: 'autoquestPeacePlus',
				isToggle: true,
				isInline: true,
				value: true,
			}, {
				label: 'воинственно',
				name: 'autoquestPeaceMinus',
				isToggle: true,
				isInline: true,
				value: false,
			}],
		}],
	}, {
		label: 'Брать карты',
		name: 'autocard',
		isToggle: true,
		value: false,
	}, {
		label: 'Держать пустой слот в рюкзаке',
		name: 'cleanInventory',
		isToggle: true,
		value: false,
		inputs: [{
			type: 'num',
			name: 'cleanInventorySlots',
			value: 1,
		}]
	}, {
		label: 'Следить за героем на карте',
		name: 'autoFollowHero',
		isToggle: true,
		value: false,
	}],
}];

export const MAX_LOG_LENGTH = 1000;

export const PHRASE_NUMBER_KEYS: PhraseNumberKey[] = ['damage', 'health', 'coins'];

export const PHRASE_ID_TO_TEXT = {
	1: 'Стан',
	11: 'Горение',
	12: 'Яд',
	280000: 'Пиромания',
	280001: 'Пиромания', //  (промах)
	280002: 'Контроль',
	280003: 'Удар',
	280004: 'Удар', //  (Промах)
	280005: 'Последний шанс',
	280006: 'Ярость',
	280007: 'Ядовитость',
	280008: 'Регенерация',
	280009: 'Ошеломление',
	280010: 'Ошеломление', //  (промах)
	280011: 'Дезориентация',
	280012: 'Ускорение',
	280013: 'Сильный удар',
	280014: 'Сильный удар', //  (промах)
	280015: 'Вампиризм',
	280016: 'Вампиризм', //  (промах)
	280017: 'Лечение',
	280018: 'Безрассудная атака',
	280019: 'Безрассудная атака', //  (промах)
	580003: 'Спутник увернулся', //  защитил своего владельца от удара
	580004: 'Спутник ранен', //  защитил своего владельца от удара, но получил рану
};

export default {
	MAX_LOG_LENGTH,
	MAX_ARCHIVE_LENGTH: 2000,

	ACTION_TYPE_NAMES: {
		0: 'idle',         //безделие
		1: 'quest',        //задание
		2: 'walk',         //путешествие между городами
		3: 'fight',        //сражение 1x1 с монстром
		4: 'dead',         //воскрешение
		5: 'city',         //действия в городе
		6: 'rest',         //отдых
		7: 'equip',        //экипировка
		8: 'trade',        //торговля
		9: 'nearcity',     //путешествие около города
		10: 'energy',       //восстановление энергии
		11: 'noeffect',     //действие без эффекта на игру
		12: 'proxy',        //прокси-действия для взаимодействия героев
		13: 'pvp',          //PvP 1x1
		14: 'test',         //проверочное действие
		15: 'companionHeal', //уход за спутником
	},
	ACTION_TYPE_TEXTS: {
		idle: 'безделие',
		quest: 'задание',
		walk: 'путешествие между городами',
		fight: 'сражение 1x1 с монстром',
		dead: 'воскрешение',
		city: 'действия в городе',
		rest: 'отдых',
		equip: 'экипировка',
		trade: 'торговля',
		nearcity: 'путешествие около города',
		energy: 'восстановление энергии',
		noeffect: 'действие без эффекта на игру',
		proxy: 'прокси-действия для взаимодействия героев',
		pvp: 'PvP 1x1',
		undefined: 'неизвестное действие',
		companionHeal: 'уход за спутником',
		broken: 'неразобранное действие',
	},
	ACTION_TYPE_ICONS: {
		idle: '<span class="glyphicon glyphicon-home"></span>',
		quest: '<span class="glyphicon glyphicon-globe"></span>',
		walk: '<span class="glyphicon glyphicon-road"></span>',
		fight: '<span class="glyphicon glyphicon-leaf"></span>',
		dead: '<span class="glyphicon glyphicon-remove"></span>',
		city: '<span class="glyphicon glyphicon-home"></span>',
		rest: '<span class="glyphicon glyphicon-heart-empty"></span>',
		equip: '<span class="glyphicon glyphicon-collapse-down"></span>',
		trade: '<span class="glyphicon glyphicon-copyright-mark"></span>',
		nearcity: '<span class="glyphicon glyphicon-globe"></span>',
		energy: '<span class="glyphicon glyphicon-flash"></span>',
		noeffect: '<span class="glyphicon glyphicon-music"></span>',
		companionHeal: '<span class="glyphicon glyphicon-user"></span>',
		broken: '<span class="glyphicon glyphicon-ban-circle"></span>',
	},
	ERROR_CODES: {
		1: 'Неполное действие',
		2: 'Не найдено начало боя',
		3: 'Не найден конец боя',
		4: 'Дыра в середине действия',
		5: 'Запись обрывается',
	},
	ACTION_TRANSLATE: {
		hit: 'Удар',
		crit: 'Критический удар',
		stunHit: 'Разбег-толчок',
		stun: 'Шок',
		might: 'Тяжёлый удар',
		slow: 'Заморозка',
		speed: 'Ускорение',
		fire: 'Шар огня',
		flame: 'Пламя',
		mush: 'Волшебный гриб',
		ue: 'Шаг в сторону',
		eva: 'Увернулся',
		poisoncloud: 'Ядовитое облако',
		poison: 'Отравление',
		vamp: 'Удар вампира',
		heal: 'Регенерация',
		dmgSum: 'Всего',
	},
};



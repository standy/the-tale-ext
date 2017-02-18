export default {
	MAX_LOG_LENGTH: 1000,
	MAX_ARCHIVE_LENGTH: 2000,
	FIGHT_START: 'fight'.split(/,\s*/),
	FIGHT: 'hit, might, fire, poisoncloud, vamp, stunHit, crit, flame, poison, slow, mush, speed, ue, eva, stun, heal'.split(/,\s*/),
	FIGHT_VALUES: 'hit, might, fire,              vamp, stunHit, crit, flame, poison,                                   heal'.split(/,\s*/),
	FIGHT_COUNTS: '                  poisoncloud,                                     slow, mush, speed, ue, eva, stun      '.split(/,\s*/),
	DMG: 'hit, might, fire, poisoncloud, vamp, stunHit, crit                                                       '.split(/,\s*/),
	DOT: '                                                    flame, poison                                        '.split(/,\s*/),
	DEBUFF: '                                                                   slow                                  '.split(/,\s*/),
	BUFF: '                                                                         mush, speed, ue                 '.split(/,\s*/),
	ACTIVE: 'hit, might, fire, poisoncloud, vamp, stunHit,                            mush,        ue                 '.split(/,\s*/),
	PASSIVE: '                                              crit, flame, poison, slow,       speed,     eva, stun, heal'.split(/,\s*/),

	SUM_TO_MAIN: {flame: 'fire', poison: 'poisoncloud', crit: 'hit'},
	LOOT: ['pickup', 'empty', 'drop', 'death'],
	REST: ['rest'],
	SHORT: ['hit', 'might', 'fire', 'flame', 'poison', 'vamp', 'slow', 'poisoncloud', 'mush', 'ue', 'eva', 'heal', 'godheal', 'rest', 'coins', 'godcoins', 'speed', 'stunHit', 'stun', 'pvpeff', 'pvpice', 'pvpflame', 'pvpfail', 'companion'],
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
	ICONS: {
		hit: '<span class="glyphicon glyphicon-leaf"></span>',
		crit: '<span class="glyphicon glyphicon-star"></span>',
		might: '<span class="glyphicon glyphicon-tower"></span>',
		fire: '<span class="glyphicon glyphicon-fire"></span>',
		flame: '<span class="glyphicon glyphicon-fire small"></span>',
		poisoncloud: '<span class="glyphicon glyphicon-tint"></span>',
		poison: '<span class="glyphicon glyphicon-tint small"></span>',
		vamp: '<span class="glyphicon glyphicon-cutlery"></span>',

		ue: '<span class="glyphicon glyphicon-refresh"></span> ',
		eva: '<span class="glyphicon glyphicon-transfer"></span> ',
		slow: '<span class="glyphicon glyphicon-link"></span>',
		mush: '<span class="glyphicon glyphicon-arrow-up"></span>',
		speed: '<span class="glyphicon glyphicon-forward"></span>',

		stunHit: '<span class="glyphicon glyphicon-step-forward"></span>',
		stun: '<span class="glyphicon glyphicon-bell"></span>',

		rest: '<span class="glyphicon glyphicon-heart-empty"></span>',
		heal: '<span class="glyphicon glyphicon-heart"></span>',

		dmgSum: '<span class="glyphicon glyphicon-asterisk"></span>',

		godheal: '<span class="glyphicon glyphicon-heart-empty"></span>',
		coins: '<span class="glyphicon glyphicon-copyright-mark"></span>',
		godcoins: '<span class="glyphicon glyphicon-copyright-mark"></span>',

		pickup: '<span class="glyphicon glyphicon-ok-circle"></span>',
		empty: '<span class="glyphicon glyphicon-remove-circle"></span>',
		drop: '<span class="glyphicon glyphicon-ban-circle"></span>',
		death: '<span class="glyphicon glyphicon-remove-sign"></span>',

		pvpeff: '<span class="glyphicon glyphicon-flash"></span>',
		pvpice: '<span class="glyphicon glyphicon-cloud-upload"></span>',
		pvpflame: '<span class="glyphicon glyphicon-cloud-download"></span>',
		pvpfail: '<span class="glyphicon glyphicon-cloud"></span>',
		companion: '<span class="glyphicon glyphicon-user"></span>',
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
	MOBS: [
		null, 'олень', 'одичавшая одежда', 'осы', 'хищный кустик', 'кабан-секач', 'бродячий дуб', 'волк', 'дух леса', 'оскорблённая эльфийка',
		'блюститель природы', 'медведь', 'аристократ', 'единорог', 'призрачный волк', 'астральный охотник', 'головастик', 'домашний поползень',
		'одичавшие светлячки', 'ползун', 'пиявка', 'гигантская росянка', 'сбежавший эксперимент', 'слизь', 'гидра', 'щупальце', 'химический мусорник', 'упырь',
		'кикимора', 'бесхозный голем', 'охотник за реагентами', 'мутировавший гоблин', 'василиск', 'ожившее пугало', 'хищный хомяк', 'борец за справедливость',
		'саранча', 'маньяк-извращенец', 'карточный шулер', 'богомол', 'благородный разбойник', 'одержимый колдун', 'механический дракончик', 'дварф-изгнанник',
		'неистовый сектант', 'механический голем', 'убийца', 'полоумный маг', 'шакал', 'скорпион', 'налётчик', 'огненная лиса', 'орк-изгнанник', 'скарабей',
		'гремучая змея', 'саламандра', 'пустынный дракончик', 'джинн', 'берсерк', 'смерч', 'заблудший шаман', 'шайтан', 'крыса', 'бандит', 'призрак',
		'неупокоенный', 'гремлин', 'подыльник', 'странствующий рыцарь', 'нага', 'охотник за головами', 'суккуб', 'вирика', 'див', 'додо', 'ангиак', 'бхут',
		'гвиллион', 'вилах', 'вендиго', 'галд', 'ачери', 'земляная даппи', 'огненная даппи', 'анчутка', 'жихарь', 'йиена', 'мара', 'боец Серого Ордена',
		'спятивший лорд', 'волколак', 'медвелак', 'аколит огня', 'ламия', 'баргест', 'вий', 'гьюнальский паук', 'дэра', 'гриндель', 'грим', 'кагир', 'друджи',
		'даса', 'стая ичетики', 'кера', 'куд', 'ларва', 'егви', 'каменный великан', 'каннибал', 'ламашту', 'лахама', 'наркоман', 'бывший палач', 'мародёр',
		'страхолев', 'злоцвет', 'варвар', 'ночная хныка', 'омерзень', 'смрадень', 'глыдень', 'песчаный холерник', 'мать анаконд', 'белая гиена',
		'мраморный бык', 'язвомор', 'лишайница', 'жирница', 'бульг', 'костогрыз', 'каменник', 'вирница', 'тигр', 'барбегаз', 'бродячий огонек', 'скальник',
		'пупырник', 'стогница', 'куропатка гуанила', 'пёстробородый', 'капитан Серых Плащей', 'аколит льда', 'семиглаз', 'гюрза', 'медвежук',
		'снежная росомаха', 'койот', 'горный манул', 'мастер огня', 'мастер льда', 'кобольд', 'пожиратель плоти', 'главарь пестробородых', 'ученик Силы',
		'гомункул', 'некромант', 'тагар', 'стрига', 'приземник', 'лесной тролль', 'вурдалак', 'болотный тролль', 'бескуд', 'атач',
	],
};

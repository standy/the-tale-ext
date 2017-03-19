declare function require(path: string): string;

export default {
	fight: require('../../../svg/fight.svg'),
	peace: require('../../../svg/peace.svg'),

	hit: require('../../../svg/hit.svg'),
	might: require('../../../svg/might.svg'),
	fire: require('../../../svg/fire.svg'),
	flame: require('../../../svg/flame.svg'),
	poisoncloud: require('../../../svg/poisoncloud.svg'),
	poison: require('../../../svg/poison.svg'),
	vampire: require('../../../svg/vampire.svg'),
	reckless: require('../../../svg/reckless.svg'),
	disorientation: require('../../../svg/disorientation.svg'),

	miss: require('../../../svg/miss.svg'),
	slow: require('../../../svg/slow.svg'),
	strength: require('../../../svg/strength.svg'),
	speed: require('../../../svg/speed.svg'),

	stunHit: require('../../../svg/stunHit.svg'),
	stun: require('../../../svg/stun.svg'),

	heal:  require('../../../svg/heal.svg'),

	companion: `<span class="companion">${require('../../../svg/companion.svg')}</span>`,

	god: `<span class="god-icon">${require('../../../svg/god.svg')}</span>`,

	trade: require('../../../svg/coin.svg'),
	rest: require('../../../svg/rest.svg'),
	loot: require('../../../svg/loot.svg'),

	death: require('../../../svg/death.svg'),
	travel: require('../../../svg/travel.svg'),
	travelWagon: require('../../../svg/travelWagon.svg'),
};

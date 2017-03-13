declare function require(path: string): string;

export default {
	fight: require('../../../svg/fight.svg'),

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

	trade: require('../../../svg/coin.svg'),
	rest: require('../../../svg/rest.svg'),
	dmgSum: '<span class="glyphicon glyphicon-asterisk"></span>',

	godheal: '<span class="glyphicon glyphicon-heart-empty"></span>',
	coins: '<span class="glyphicon glyphicon-copyright-mark"></span>',
	godcoins: '<span class="glyphicon glyphicon-copyright-mark"></span>',

	pickup: '<span class="glyphicon glyphicon-ok-circle"></span>',
	empty: '<span class="glyphicon glyphicon-remove-circle"></span>',
	drop: '<span class="glyphicon glyphicon-ban-circle"></span>',
	death: require('../../../svg/death.svg'),
	travel: require('../../../svg/travel.svg'),
	travelWagon: require('../../../svg/travelWagon.svg'),

	pvpeff: '<span class="glyphicon glyphicon-flash"></span>',
	pvpice: '<span class="glyphicon glyphicon-cloud-upload"></span>',
	pvpflame: '<span class="glyphicon glyphicon-cloud-download"></span>',
	pvpfail: '<span class="glyphicon glyphicon-cloud"></span>',
};

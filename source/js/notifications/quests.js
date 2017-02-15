const utils = require('./../utils/');
const _subscribe = utils.subscribe;

const _quests = module.exports = {};
_quests.checkQuests = require('./checkQuests');


_subscribe('preload', function() {
	_subscribe('newMessages', function(messagesNew, game_data) {
		const hero = game_data.account.hero;
		const quests = hero.quests.quests;
		_quests.checkQuests(quests);
	});
});



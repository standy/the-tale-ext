var utils = require('./../utils/');
var _subscribe = utils.subscribe;

var _quests = module.exports = {};
_quests.checkQuests = require('./checkQuests');


_subscribe('preload', function() {
	_subscribe('newMessages', function(messagesNew, game_data) {
		var hero = game_data.account.hero;
		var quests = hero.quests.quests;
		_quests.checkQuests(quests);
	});
});



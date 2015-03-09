var _settings = require('./settings.js');
var _publish = require('./pubsub.js').publish;
var _subscribe = require('./pubsub.js').subscribe;
var _notification = require('./notifications.js');
var heroName = require('./heroName.js'); /* todo heroName */

var lastQuests;
function checkQuests(quests) {
	var line = quests[1].line;
	var lineOld = lastQuests && lastQuests[1] && lastQuests[1].line || [];
	var newLines = [];
	for (var i = 0; i < line.length; i++) {
		var q = line[i];
		var qOld = lineOld[i];
		if (!qOld || !isSameQuest(q, qOld)) {

			if (_settings.settingsValues.notifyQuestChoose && q.choice_alternatives && q.choice_alternatives.length) {
//					console.info('quest!', q.type, _ext.heroName + ' ' + q.action + '!', q);
				if (_settings.settingsValues.notify) {
					_notification.sendNotify(q.name,  {
						tag: 'quest',
						body: heroName + ' ' + q.action + '!',
						icon: window.extPath + 'img/quest/caravan.png', //window.extPath + 'img/quest/' + q.type + '.png',
						addTime: 1
					});
				}
			}
			newLines.push(q);

		}
	}
	if (newLines.length) {
		_publish('questUpdate', line);
	}
	lastQuests = quests;
}

function isSameQuest(q1, q2) {
	var tests = ['action', 'choice', 'name', 'type', 'uid'];
	for (var s in tests) if (tests.hasOwnProperty(s)) {
		var key = tests[s];
		if (q1[key] !== q2[key]) return false;
	}
	return true;
}

var _quests = {
	checkQuests: checkQuests
};

module.exports = _quests;


_subscribe('preload', function() {
	_subscribe('newMessages', function(messagesNew, game_data) {
		var hero = game_data.account.hero;
		var quests = hero.quests.quests;
		_quests.checkQuests(quests);
	});
});


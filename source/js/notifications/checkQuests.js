var utils = require('./../utils/');
var _settings = utils.settings;
var _publish = utils.publish;
var sendNotify = require('./sendNotify');

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
					sendNotify(q.name,  {
						tag: 'quest',
						body: utils.heroName + ' ' + q.action + '!',
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

module.exports = checkQuests;



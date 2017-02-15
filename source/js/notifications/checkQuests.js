const utils = require('./../utils/');
const _settings = utils.settings;
const _publish = utils.publish;
const sendNotify = require('./sendNotify');

let lastQuests;
function checkQuests(quests) {
	const line = quests[1].line;
	const lineOld = lastQuests && lastQuests[1] && lastQuests[1].line || [];
	const newLines = [];
	for (let i = 0; i < line.length; i++) {
		const q = line[i];
		const qOld = lineOld[i];
		if (!qOld || !isSameQuest(q, qOld)) {
			if (_settings.settingsValues.notifyQuestChoose && q.choice_alternatives && q.choice_alternatives.length) {
//					console.info('quest!', q.type, _ext.heroName + ' ' + q.action + '!', q);
				if (_settings.settingsValues.notify) {
					sendNotify(q.name, {
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
	const tests = ['action', 'choice', 'name', 'type', 'uid'];
	for (const s in tests) {
		if (tests.hasOwnProperty(s)) {
			const key = tests[s];
			if (q1[key] !== q2[key]) return false;
		}
	}
	return true;
}

module.exports = checkQuests;



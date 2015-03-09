/** пересчет группы в архив */

var $ = require('jquery');
var utils = require('../../utils/index.js');
var _subscribe = utils.subscribe;
var _const = utils.const;
var _elements = utils.elements;
var _settings = utils.settings;
var _log = utils.log;
var isActType = utils.isActType;
var archiveGroups = require('./archiveGroups.js');
var upgradeArchiveGroup = require('./upgradeArchiveGroup.js');

function countArchiveFromGroup(group) {
	var groupData = group.data;
	var messages = group.messages;
	if (!messages.length) { return false; }
	var isBroken = groupData.isBroken;
	var dataType = groupData.type;
	var first = messages[0];
	var last = messages[messages.length - 1];
	var archiveGroup = $.extend({}, {
		ts: [first[0], last[0]],
		type: dataType,
		text: groupData.actionName,
		broken: isBroken
	});

	if (dataType === 'fight' && !isBroken) {
		archiveGroup.me = {};
		archiveGroup.enemy = {};
		if (groupData.info_link) {
			var mobId = groupData.info_link.replace('/guide/mobs/', '').replace('/info', '');
			if (+mobId) {
				archiveGroup.mobId = +mobId;
			}
		}

		/* пересчет последней группы */
		for (var i = 0; i < messages.length; i++) {
			var message = messages[i];
			var act = message[4];
			if (!act) continue;
			var type = act.type; /* тип фразы */
			if (isActType('FIGHT', type)) {
				var isMe = act.isMe;
				var addTo = archiveGroup[isMe ? 'me' : 'enemy'];
				if (isActType('FIGHT_VALUES', type)) {
					addTo[type] = addTo[type] || [];
					addTo[type].push(act.value);
				} else {
					addTo[type] = addTo[type] || 0;
					addTo[type]++;
				}
			} else if (isActType('LOOT', type)) {
				archiveGroup.loot = type;
			}
		}
	}

	upgradeArchiveGroup(archiveGroup);
	return archiveGroup;
}



module.exports = countArchiveFromGroup;

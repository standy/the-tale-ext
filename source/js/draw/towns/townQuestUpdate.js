var $ = require('jquery');
var utils = require('../../utils/');
var _subscribe = utils.subscribe;

var init = require('./init');

function townQuestUpdate(quests) {
	if (init.isInited) {
		_prevArguments.forEach(function(args) {
			doJob.apply(this, args);
		});
		deleteArguments();
		doJob(quests);
	} else {
		saveArguments(quests);
	}
}



var _prevArguments = [];
function saveArguments() {
	_prevArguments.push(arguments);
}
function deleteArguments() {
	_prevArguments = [];
}


function doJob(quests) {
	$('.place-row .quest').html('');
	for (var questsIndex = 0; questsIndex < quests.length; questsIndex++) {
		var quest = quests[questsIndex];
		var actors = quest.actors;
		for (var i = 0; i < actors.length; i++) {
			var actor = actors[i];
			var isFrom = i === 0 && actors.length > 1;
			var actorType = actor[0];
			var actorTypeId = +actor[1];
			var placeId = actorTypeId === 1 ? actor[2].id : actor[2].place;
			var $placeRow = $('.place-row[data-place-id="' + placeId + '"]');
			var $townQuest = $placeRow.find('.quest');
			var questHtml =
				(isFrom ? '<span class="glyphicon glyphicon-arrow-right"></span>' : '<span class="glyphicon glyphicon-arrow-left"></span>') +
				'<span class="quest-icon-mini pgf-quest-icon ' + quest.type + '" title="' + actorType + '"></span> ';
			$townQuest.append(questHtml);
		}
	}
}


_subscribe('questUpdate', function(quest) {
	townQuestUpdate(quest);
});


module.exports = townQuestUpdate;

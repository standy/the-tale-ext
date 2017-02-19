import $ from 'jquery';
import {init} from './init';

let _prevArguments = [];
export function townQuestUpdate(quests) {
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



function saveArguments() {
	_prevArguments.push(arguments);
}
function deleteArguments() {
	_prevArguments = [];
}


function doJob(quests) {
	$('.place-row .quest').html('');
	for (let questsIndex = 0; questsIndex < quests.length; questsIndex++) {
		const quest = quests[questsIndex];
		const actors = quest.actors;
		for (let i = 0; i < actors.length; i++) {
			const actor = actors[i];
			const isFrom = i === 0 && actors.length > 1;
			const actorType = actor[0];
			const actorTypeId = +actor[1];
			const placeId = actorTypeId === 1 ? actor[2].id : actor[2].place;
			const $placeRow = $(`.place-row[data-place-id="${placeId}"]`);
			const $townQuest = $placeRow.find('.quest');
			const questHtml =
				`${isFrom
					? '<span class="glyphicon glyphicon-arrow-right"></span>'
					: '<span class="glyphicon glyphicon-arrow-left"></span>'
				}<span class="quest-icon-mini pgf-quest-icon ${quest.type}" title="${actorType}"></span> `;
			$townQuest.append(questHtml);
		}
	}
}

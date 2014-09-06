var _const = _ext.const;
var _trace = _ext.trace;
var _elements = _ext.elements;
var _icons = _const.ICONS;

function isActType(types, actType) {
	return _const[types].indexOf(actType) >= 0;
}


/* towns */
var _towns = (function(_towns) {
	var $townsContent = _elements.getTabInner('towns');
	$('body')
		.on('click.town', '.town', function() {
			if (!mapData) return;
			var id = $(this).data('place-id');
			showMapDialogById(id);
		})
		.on('click.town', '.reload', function() {
			if (_ext.map_version) {
				_towns.mapDataUpdate(_ext.map_version)
					.done(function(mapData) {
						townParams(mapData);
					});
			}
		});


	$townsContent.html('<span class="link-ajax pull-right reload glyphicon glyphicon-repeat"></span>');



	var mapData;
	function mapDataUpdate(map_version) {
		return $.ajax({
			url: '/dcont/map/region-' + map_version + '.js',
			dataType: 'json',
			type: 'get'
		})
			.done(function(map_data) {
				_towns.mapData = mapData = map_data;
				_ext.publish('townsInit', map_data);
			});
	}

	function init() {
		var places = mapData.places;
		var html = '';
		for (var i in places) if (places.hasOwnProperty(i)) {
			var place = places[i];
			html +=
				'<tr class="place-row" data-place-id="' + place.id + '">' +
					'<td class="size"><span class="badge">' + place.size + '</span></td>' +
					'<td>' +
						'<span class="link-ajax town" data-place-id="' + place.id + '">' + place.name + '</span>' +
						' <span class="quest"></span>' +
					'</td>' +
//						'<td data-city-param="1" class="production"></td>' +
					'<td data-city-param="размер экономики"></td>' +
					'<td data-city-param="безопасность"></td>' +
					'<td data-city-param="транспорт"></td>' +
					'<td data-city-param="свобода"></td>' +
				'</tr>';
		}
		html =
			'<table class="table table-towns table-noborder table-hover-dark table-condensed">' +
				'<thead>' +
					'<th class="size" title="Размер города">Р</th>' +
					'<th>Название</th>' +
//						'<th>Произв.</th>' +
					'<th title="Размер экономики">Э</th>' +
					'<th title="Безопасность">Безоп.</th>' +
					'<th title="Транспорт">Транс.</th>' +
					'<th title="Свобода">Своб.</th>' +
				'</thead>' +
				'<tbody>' +
					html +
				'</tbody>' +
			'</table>';
		var $table = $(html).appendTo($townsContent);
		window.tables.makeSortable($table);



		_towns.townQuestUpdate = function(quests) {
			$('.place-row .quest').html('');
			for (var questsIndex=0;questsIndex<quests.length;questsIndex++) {
				var quest = quests[questsIndex];
				var actors = quest.actors;
				for (var i=0; i<actors.length; i++) {
					var actor = actors[i];
					var isFrom = i === 0 && actors.length > 1;
					var actorType = actor[0];
					var actorTypeId = actor[1];
					var placeId = actorTypeId == 1 ? actor[2].id : actor[2].place;
					var $placeRow = $('.place-row[data-place-id="' + placeId + '"]');
					var $townQuest = $placeRow.find('.quest');
					var questHtml =
						(isFrom ? '<span class="glyphicon glyphicon-arrow-right"></span>' : '<span class="glyphicon glyphicon-arrow-left"></span>') +
						'<span class="quest-icon-mini pgf-quest-icon ' + quest.type + '" title="' + actorType + '"></span> ';
					$townQuest.append(questHtml);
				}
			}
		};

		for (var i=0; i<_prevParams.length; i++) {
			_towns.townQuestUpdate.apply(_towns, _prevParams[i]);
		}

	}
	var _prevParams = [];
	_towns.townQuestUpdate = function() {
		_prevParams.push(arguments);
	};

	function townParams(mapData) {
		var places = mapData.places;
		for (var i in places) {
			(function(placeIndex) {
				var place = places[placeIndex];
				requestPlace(place.pos.x, place.pos.y)
					.done(function(html) {
						var parsed = parsePlaceHtml(html);
						var $placeRow = $('.place-row[data-place-id="' + placeIndex + '"]');
						parsed.cityParams.forEach(function(item) {
							var val = item.value;
							if (val < 100) val = '&nbsp;' + val;
							$placeRow.children('[data-city-param="' + item.name + '"]').html(val);
						});
					});
			})(i);
		}
	}


	function parsePlaceHtml(html) {
		var $info = $(html);

		var cityParams = [];
		var $cityParamsRows = $info.find('#pgf-cell-place-parameters').find('tr').slice(1);
		$cityParamsRows.each(function() {
			var $row = $(this);
			var paramName = $.trim($row.children('th').first().text());
			var valueText = $row.children('td').first().text();
			var value = parseFloat(valueText);
			cityParams.push({
				name: paramName,
				value: value
			});
		});
		return {
			cityParams: cityParams
		};
	}

	function requestPlace(x,y) {
		return $.ajax({
			url: '/game/map/cell-info?x=' + x + '&y=' + y + '&_=' + (+new Date()),
			method: 'get',
			dataType: 'html'
		});
	}


	function showMapDialogById(id) {
		var place = mapData.places[id];
		showMapDialog(place.pos.x, place.pos.y);
	}
	function showMapDialog(x, y) {
		pgf.ui.dialog.Create({ fromUrl: pgf.urls['game:map:cell_info'](x, y),
			OnOpened: function(dialog) {
				pgf.base.InitializeTabs('game-map-cell-info', 'map',
					[[jQuery('.pgf-cell-description-button', dialog), 'description'],
						[jQuery('.pgf-cell-persons-button', dialog), 'persons'],
						[jQuery('.pgf-cell-place-parameters-button', dialog),'place-parameters'],
						[jQuery('.pgf-cell-place-demographics-button', dialog),'place-demographics'],
						[jQuery('.pgf-cell-place-bills-button', dialog),'place-bills'],
						[jQuery('.pgf-cell-place-modifiers-button', dialog), 'place-modifiers'],
						[jQuery('.pgf-cell-place-chronicle-button', dialog), 'place-chronicle'],
						[jQuery('.pgf-cell-building-button', dialog), 'building'],
						[jQuery('.pgf-cell-map-button', dialog), 'map'],
						[jQuery('.pgf-cell-debug-button', dialog), 'debug']]);
				jQuery('[rel="tooltip"]', dialog).tooltip(pgf.base.tooltipsArgs);

				if (widgets.abilities) {
					widgets.abilities.UpdateButtons();
					widgets.abilities.RenderAbility(pgf.game.constants.abilities.building_repair);
					jQuery('.angel-ability', dialog).toggleClass('pgf-hidden', false);
				}

			},
			OnClosed: function(dialog) {
				pgf.base.HideTooltips(dialog);
			}
		});
	}

	$.extend(_towns, {
		init : init,
		mapDataUpdate : mapDataUpdate,
		showMapDialogById : showMapDialogById
	});
	return _towns;
})({});

_ext.subscribe('preload', function() {
	if (_ext.map_version) {
		_towns.mapDataUpdate(_ext.map_version)
			.done(function() {
				_towns.init();
			});
	}
});
_ext.subscribe('questUpdate', function(quest) {
	_towns.townQuestUpdate(quest);
});
/* eo towns */

/* shortMessages */
var _shortMessages = (function(_shortMessages) {
//		var $shortContainer = _elements.getTabInner('short');
	function htmlMessages(messages) {
		var html = '';
		for (var i=0; i<messages.length; i++) {
			var message = messages[i];
//				var m = JSON.stringify(message);  data-m=\''+ m +'\'
			var htmlShortMsg = htmlMessage(message);
			var timestamp = message[0];
			var time = message[1];
			var htmlMsg;
			if (htmlShortMsg) {
				while (messages[i+1] && messages[i+1][1] === time) {
					var htmlShortMsg2 = htmlMessage(messages[i+1]);
					if (!htmlShortMsg2) break;
					htmlShortMsg += htmlShortMsg2;
					i++;
				}
				htmlMsg = '<li data-ts="'+timestamp+'" class="log-record-short">' + htmlShortMsg + '</li>';
			} else {
				var htmlLongMsg = htmlLongMessage(message);
				htmlMsg = '<li data-ts="'+timestamp+'" class="log-record">' + htmlLongMsg + '</li>';
			}
			html = htmlMsg + html;
		}
		return html;
	}

	function htmlMessage(message) {
		var time = message[1];
		var msg = message[2];
		var act = message[4]; //_ext.parse.message(message, 'message');

		var htmlMsg;
		if (!act || !act.type) return '';
		var isMe = act.isMe;
		var type = act.type;
		var sec = act.sec;
		var t = '';
		var val = act.value || '';
		var icon = _icons[type];
//			if (sec) console.log(sec, message[3], time)
		if (sec) icon += '<span class="sub-icon">' + _icons[sec] + '</span>';
		if (type === 'hit') t = val;
		else if (type === 'vamp') t = val + icon + '<span class="vamp">' + act.vamp + '</span>';
		else if (isActType('SHORT', type)) t = val + icon;

		if (t) htmlMsg = '<span class="submessage act act-' + act.type + (isMe ? ' me' : ' enemy') + '" title="' + time + '> ' + msg + '">' + t + '</span>';
		return htmlMsg || '';
	}

	function htmlLongMessage(message) {
		var time = message[1];
		var msg = message[2];
		var act = message[4];

		var actType = '';
		if (act && act.type) {
			var isMe = act.isMe ;
			actType = ' msg msg-' + act.type + (isMe ? ' me' : ' enemy');
		}
		var messageHighlight = _ext.parse.highlight(msg, act);


		var htmlLongMsg =
			'<div class="pgf-time time">' + time + '</div>' +
				'<div class="pgf-message message">' +
				'<div class="submessage' + actType + '">' + messageHighlight + '</div>' +
			'</div>';

		return htmlLongMsg;
	}

	$.extend(_shortMessages, {
		htmlMessage: htmlMessage,
		htmlLongMessage: htmlLongMessage,
		htmlMessages: htmlMessages
	});
	return _shortMessages;
})({});

/* eo shortMessages */


/* group */
var _groupMessages = (function(_groupMessages) {

	var $groupsContent = _elements.getTabInner('group');
	var $lastGroup;

	var messagesGrouped = [];

	function addMessages(messagesList) {
		for (var i=0; i<messagesList.length; i++) {
			addMessage(messagesList[i]);
		}
		return messagesGrouped;
	}

	/*
	data: {
		actionName: "пытается одолеть волка"
		info_link: "/guide/mobs/7/info"
		type: "fight"
		typeId: 3
	}*/
	function addMessage(message) {
		var hero = message[3];
		var act = message[4];
		var action = hero.action || false;

		var currGr = messagesGrouped[messagesGrouped.length-1];
		var isFirstGrouop = !currGr;

		if (isFirstGrouop) {
			/* самая первая группа */
			currGr = { /* заглушка */
				data: {}
			}
		} else {
			var currActionName = currGr.data.actionName;
			var currType = currGr.data.type;
			var currInfoLink = currGr.data.info_link;
			var currTypeId = currGr.data.typeId;
		}


		if (action) {
			var actionName = action.description;
			var actionTypeId = action.type;
			var actionType = _const.ACTION_TYPE_NAMES[actionTypeId];
			var actionInfoLink = action.info_link;

			if (!currActionName) currGr.data.actionName = currActionName = actionName;
			if (!currType) currGr.data.type = currType = actionType;
			if (!currInfoLink) currGr.data.info_link = currInfoLink = actionInfoLink;
			if (!currTypeId) currGr.data.typeId = currTypeId = actionTypeId;
			var grData = {
				actionName: actionName,
				type: actionType,
				info_link: actionInfoLink,
				typeId: actionTypeId
			};
			if (isFirstGrouop) grData.isBroken = 1; // first group
		}


		if (act) {
			var actType = act.type;
			var isFightStart = isActType('FIGHT_START', actType);
			var isFightEnd = isActType('LOOT', actType);
			if (actType === 'godheal' || actType === 'godhit') {
				grData = $.extend(grData, {god: 1});
			}

			if (isFightStart) {
				if (!isFirstGrouop) finishGroup();
				newGroup(message, {fightStarted: 1}); //fight started, not finished
				return;
			}
			if (isFightEnd) {
				if (isFirstGrouop) {
					newGroup(message, grData)
				} else {
					var lastG = addToLastGroup(message, {
						actionName: 'в бою',
						type: 'fight',
						info_link: '',
						typeId: 3
					});
					if (lastG.data.fightStarted) {
						delete lastG.data.fightStarted;
						if (lastG.data.isBroken !== 4 && lastG.data.isBroken !== 5) {
							delete lastG.data.isBroken;
						}
					} else {
						lastG.data.isBroken = 2; //fight ended, but not started
					}
					finishGroup();
				}

				if (action && actionName !== currActionName) {
					newGroup([message[0], message[1], actionName, false, false], grData);
				}
				return;
			}
			if (currGr.messages && currGr.messages.length && !currGr.data.fightStarted && isActType('FIGHT', act.type)) {
				grData = $.extend(grData, {isBroken: 5});
			}

		}


		if (action && actionName && currActionName && actionName !== currActionName) {
			finishGroup();
			newGroup(message, grData);
			return;
		}
		if (isFirstGrouop) {
			newGroup(message, grData)
		} else {
			addToLastGroup(message, grData);
		}

		function addToLastGroup(message, data) {
			var lastG = messagesGrouped[messagesGrouped.length-1];
			if (data) lastG.data = $.extend(data, lastG.data);
			if (lastG.messages.length) {
				var prevMsg = lastG.messages[lastG.messages.length-1];
				if (message[0] - prevMsg[0] > 1200) lastG.data.isBroken = 4; // hole in messages 20 min
			}
			lastG.messages.push(message);
			return lastG;
		}

		function finishGroup(data) {
			var lastG = messagesGrouped[messagesGrouped.length-1];
			delete lastG.data.unfinished;
			if (lastG.data.fightStarted) {
				lastG.data.isBroken = 3; // fight started, not ended
			}
			if (data) lastG.data = $.extend(data, lastG.data);
			_ext.publish('groupFinished', lastG, messagesGrouped.length-1);
		}
		function newGroup(message, data) {
			var newG = {
				data: {unfinished: 1},
				messages: []
			};
			if (data) newG.data = $.extend(data, newG.data);
			if (message) newG.messages.push(message);
			messagesGrouped[messagesGrouped.length] = newG;
			_ext.publish('groupStarted', newG, messagesGrouped.length-1);
		}
	}

	function redrawGroup(index, isOpen) {
		var $group = $groupsContent.children('.group[data-index="'+index+'"]');
		if ($group.length) {
			if (typeof isOpen !== 'undefined') {
				$group.toggleClass('open', isOpen);
			}
			$group.html(drawGroupInner(messagesGrouped[index], messagesGrouped[index+1]));
		} else {
			$groupsContent.prepend(drawGroup(messagesGrouped[index], index, isOpen));
		}
	}


	function drawGroup(group, index, isOpen) {
		isOpen = isOpen || _ext.settings.settingsValues.groupOpenOnDefault;
		var html =
			'<div class="group' + (isOpen ? ' open' : '') + '" data-index="' + index + '">' +
				drawGroupInner(group, messagesGrouped[index+1]) +
			'</div>';
		return html;
	}
	function drawGroupInner(group, groupNext) {
		if (!group || !group.messages || !group.messages.length) { return ''; }
		var messages = group.messages;
		var groupData = group.data;

		var messageFirst = messages[0];
		var messageLast = messages[messages.length-1];

		var groupType = groupData.type;
		var groupLink = (groupData.info_link || '').replace('/info', '');
		var htmlGroupIcon = _const.ACTION_TYPE_ICONS[groupType] || '';
		var iconAttr = 'class="action-icon ' + groupType + '" title="' + _const.ACTION_TYPE_TEXTS[groupType] + '"';

		if (groupData.isBroken && !groupData.unfinished) {
			htmlGroupIcon = _const.ACTION_TYPE_ICONS['broken'];
			var title = _const.ERROR_CODES[groupData.isBroken || 1];
			iconAttr = 'class="action-icon broken" title="' + title + '"';
		}
		if (groupLink) {
			htmlGroupIcon = '<a ' + iconAttr + ' href="'+groupLink+'" target="_blank">' + htmlGroupIcon + '</a>';
		} else {
			htmlGroupIcon = '<span ' + iconAttr + '">' + htmlGroupIcon + '</span>';
		}


		var htmlTitle = '<span class="action-name">' + (groupData.actionName || 'неизвестное действие') + '</span>';

		var timeStart = messageFirst[0];
		var timeEnd = messageLast[0];
		if (groupType !== 'fight' && groupNext && groupNext.messages[0]) {
			var timeStartNext = groupNext.messages[0] && groupNext.messages[0][0];
			if (timeStartNext - timeEnd < 120) timeEnd = timeStartNext; // проверка на случай сломанной группы
		}
		var timeSpan = timeEnd - timeStart;
		var htmlTime = /*'<span class="glyphicon glyphicon-time"></span> ' +*/
			'<span class="group-time ' + (timeSpan > 600 ? 'bad' : timeSpan > 300 ? 'average' : '') + '">' +
				_ext.utils.timeSpan(timeSpan) +
			'</span> ';



		var htmlGroupList = _shortMessages.htmlMessages(messages);

		var html =
				'<div class="group-title on-close' + (groupData.god ? ' god' : '') + '">' + htmlGroupIcon + htmlTime + htmlTitle +'</div>' +
//					'<div class="group-stats on-close">' + htmlStats + '</div>' +
				'<div class="group-controls">' +
					'<span class="group-toggle on-close text-muted glyphicon glyphicon-chevron-up"></span>' +
					'<span class="group-toggle on-open text-muted glyphicon glyphicon-chevron-down"></span>' +
				'</div>' +
				'<ul class="unstyled pgf-log-list on-open">' + htmlGroupList + '</ul>';

		return html;
	}
	function drawMessages(messagesGrouped) {
		var html = '';
		for (var i=0; i<messagesGrouped.length; i++) {
			html = drawGroup(messagesGrouped[i], i) + html;
		}
		$groupsContent.html(html);
		$lastGroup = $groupsContent.children('.group').first();
	}
	function drawFakeMessage(message) {
		var html = _shortMessages.htmlLongMessage(message);
		$lastGroup.prepend(html);
	}


	$.extend(_groupMessages, {
		list: messagesGrouped,
		addMessages: addMessages,
		drawFakeMessage: drawFakeMessage,
//			addMessage: addMessage,
//			group: group,
		drawMessages: drawMessages,
		redrawGroup: redrawGroup
	});

	return _groupMessages;
})({});

_ext.subscribe('init', function() {
	_groupMessages.addMessages(_trace.messagesLog);
	_groupMessages.drawMessages( _groupMessages.list );
//		_ext.subscribe('groupFinished', function(group, index) {
//			_groupMessages.redrawGroup(index);
//		});
	_ext.subscribe('groupStarted', function(group, index) {
		_groupMessages.redrawGroup(index-1);
	});
	_ext.subscribe('newTurn', function(messagesNew) {
		_groupMessages.addMessages(messagesNew);
		_groupMessages.redrawGroup(_groupMessages.list.length-1);
	});

});

_elements.getTabInner('group').on('click', '.group-title', function() {
	var $group = $(this).closest('.group');
	var index = $group.data('index');
	console.log('group>', _groupMessages.list[index]);
});
/* eo group */

_ext.elements.addControl('group-toggle', {title: 'Только действия / Подробности', content: '<span class="glyphicon glyphicon-chevron-' + (_ext.settings.settingsValues.groupOpenOnDefault ? 'down' : 'up') + '"></span>'})
	.on('click', function() {
//			_ext.elements.activeTab('group');
		var $icon = $(this).children('.glyphicon');
		var isOpen = $icon.hasClass('glyphicon-chevron-up');
		_elements.getTabInner('group')
			.children('.group').toggleClass('open', isOpen);
		_elements.getTabInner('archive')
			.find('.group').toggleClass('open', isOpen);
		$icon.toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
	});



/* archive */
var _archive = (function(_archive) {
	var showArchive = _ext.settings.settingsValues.showArchive;
	var $archiveTab = _elements.getTab('archive').toggle(showArchive);

	_ext.subscribe('settingsChange', function(key, value) {
		if (key === 'showArchive') {
			showArchive = value;
			$archiveTab.toggle(showArchive);
			if (!showArchive) $archiveContent.html('');
		}
	});

	var $archiveTabContent = _elements.getTabInner('archive');

	$('<span class="link-ajax archive-renew">обновить</span>').appendTo($archiveTabContent)
		.on('click', function() {
			drawArchiveGroups(_archive.archiveGroups);
		});
	var $archiveContent = $('<div class="archive-content"></div>').appendTo($archiveTabContent);

	$archiveContent.on('click', '.group-toggle', function() {
		$(this).closest('.group').toggleClass('open');
	});

	function drawArchiveGroups(archiveGroups) {
		var levelIndex = 0;
		var levelsLog = _ext.log.get('levelsLog') || [];
		for (var i=0; i<archiveGroups.length; i++) {
			var group = archiveGroups[i];
			var ts = group.ts[1];
			var lv = levelsLog[levelIndex] || [];
			while (ts > lv[0]) {
				levelIndex++;
				var lvlHtml = '<div class="level">' + lv[1] + ' уровень!</div>';
				$archiveContent.prepend(lvlHtml);
				var lv = levelsLog[levelIndex] || [];
			}
			drawArchiveGroup(archiveGroups[i], i, archiveGroups);
		}
	}

	function drawArchiveGroup(archiveGroup, index, archiveGroups) {
		var isOpen =  _ext.settings.settingsValues.groupOpenOnDefault;
		var groupType = archiveGroup.broken ? 'broken' : archiveGroup.type;
		if (archiveGroup.mobId) {
			var groupLink = '/guide/mobs/' + archiveGroup.mobId;
		}
		var htmlGroupIcon = _const.ACTION_TYPE_ICONS[groupType] || '';
		if (groupLink) {
			htmlGroupIcon = '<a class="action-icon ' + groupType + '" href="'+groupLink+'" target="_blank">' + htmlGroupIcon + '</a>';
		} else {
			htmlGroupIcon = '<span class="action-icon ' + groupType + '">' + htmlGroupIcon + '</span>';
		}
		var title = (archiveGroup.text || 'неизвестное действие');
		var htmlTitle = '<span class="action-name">' + title + '</span>';


		var timeStart = archiveGroup.ts[0];
		var timeEnd = archiveGroup.ts[1];
		var archiveGroupNext = archiveGroups[index+1];
		if (groupType !== 'fight' && archiveGroupNext && archiveGroupNext.ts) {
			var timeStartNext = archiveGroupNext.ts[0];
			if (timeStartNext - timeEnd < 120) timeEnd = timeStartNext; // проверка на случай сломанной группы (3)
		}
		var timeSpan = timeEnd - timeStart;

		var htmlTime = /*'<span class="glyphicon glyphicon-time"></span> ' +*/
			'<span class="group-time ' + (timeSpan > 600 ? 'bad' : timeSpan > 300 ? 'average' : '') + '">' +
				_ext.utils.timeSpan(timeSpan) +
			'</span> ';


		var htmlGroupList = '';
		if (archiveGroup.total && (archiveGroup.type === 'fight' || archiveGroup.type === 'fight-god')) {
			htmlGroupList =
				'<span class="stats-archive stats-archive-me">' +
					drawArchiveActStat(archiveGroup.total.me) +
				'</span>' +
				'<span class="stats-archive stats-archive-enemy">' +
					drawArchiveActStat(archiveGroup.total.enemy) +
				'</span>';
		} else {
			var actName = _const.ACTION_TYPE_TEXTS[archiveGroup.type || 'undefined'];
			if (archiveGroup.broken) {
				actName = _const.ERROR_CODES[archiveGroup.broken || 1]
			}
			htmlGroupList = '<span class="stats-archive">' + actName + '</span>';
		}
		var html =
				'<div class="group-title">' + htmlGroupIcon + htmlTime + htmlTitle +'</div>' +
				'<div class="group-controls">' +
					'<span class="group-toggle on-close text-muted glyphicon glyphicon-chevron-up"></span>' +
					'<span class="group-toggle on-open text-muted glyphicon glyphicon-chevron-down"></span>' +
				'</div>' +
				'<div class="archive-log-list on-open">' + htmlGroupList + '</div>';

		html =
			'<div class="group' + (isOpen ? ' open' : '') + '" data-index="' + index + '">' +
				html +
			'</div>';

		$archiveContent.prepend(html);

	}

	function drawArchiveActStat(stats) {

		var types = ['dmgSum'].concat(_const.FIGHT);
		var html = '';
//			html += JSON.stringify(stats)
		for (var i=0; i<types.length; i++) {
			var type = types[i];
			if (stats[type]) {
				var stat = stats[type];
				var htmlStat = '';
				var htmlStatName = _icons[type];
				var count = stat.count;
				var sum = stat.sum;
				if (isActType('FIGHT_COUNTS', type)) {
					htmlStat += count + 'x' + htmlStatName;
				} else {
					if (type === 'dmgSum') {
						htmlStat += htmlStatName + '=<b>' + sum + '</b> ';
					} else {
						htmlStat +=  count + 'x' + htmlStatName;
						htmlStat += '=' + sum + ' ';
					}
				}

				html += '<span class="stats-archive-act stats-archive-' + type + '">' + htmlStat + '</span>';
			}
		}
		return html;

	}


	/* пересчет группы в архив */
	function countArchiveFromGroup(group) {
		var groupData = group.data;
		var messages = group.messages;
		if (!messages.length) return false;
		var isBroken = groupData.isBroken;
		var dataType = groupData.type;
		var first = messages[0];
		var last = messages[messages.length-1];
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
				if (+mobId) archiveGroup.mobId = +mobId;
			}

			for (var i=0; i<messages.length; i++) {
				var message = messages[i];
				var act = message[4];
				if (!act) continue;
				var type = act.type;
				if (isActType('FIGHT', type)) {
					var isMe = act.isMe;
					var addTo = archiveGroup[isMe ? 'me' : 'enemy'];
					var isFightValues = isActType('FIGHT_VALUES', type);
					if (!addTo[type]) {
						if (isFightValues) addTo[type] = [act.value];
						else addTo[type] = 1;
					} else {
						if (isFightValues) addTo[type].push(act.value);
						else addTo[type]++;
					}
				} else if (isActType('LOOT', type)) {
					archiveGroup.loot = type;
				}
			}
		}

		upgradeArchiveGroup(archiveGroup);
		return archiveGroup;
	}



	/* добавляет к архивам поле total */
	function upgradeArchiveGroup(archiveGroup, index) {
		if (!archiveGroup || !archiveGroup.ts) return archiveGroup;
		if (archiveGroup.me) {
			$.extend(archiveGroup, {
				total:{
					me: countTotalFromArchive(archiveGroup.me, 'me'),
					enemy: countTotalFromArchive(archiveGroup.enemy, 'enemy', archiveGroup.mobId == 66)
				}
			});
		}
		return archiveGroup;

		/* подсчет всех сумм из архива */
		function countTotalFromArchive(archiveGroupFrom) {
			var addTo = {dmgSum: {count:0, sum:0}};
			for (var type in archiveGroupFrom) if (archiveGroupFrom.hasOwnProperty(type)) {
				var vals = archiveGroupFrom[type];
				var isPassive = isActType('PASSIVE', type);
				var isHeal = type === 'heal';

				var count;
				var sum;
				if (typeof vals === 'number') {
					count = vals;
					sum = 0;
				} else {
					count = vals.length;
					sum = vals.reduce(function(pv, cv) { return pv + cv; }, 0) || 0;
				}

				var av;
				var critMin;
				var critVals;
				var critCount = 0;
				addTo[type] = addTo[type] || {sum: 0, count: 0};
				if (type === 'hit' && sum) {
					av = sum/count;
					critMin = av * 1.35;
					critVals = vals.filter(function(item) { return item > critMin;});
					critCount = critVals.length;
				}
				if (critCount) {
					addTo.crit = addTo.crit || {sum: 0, count: 0};
					var critSum = critVals.reduce(function(pv, cv) { return pv + cv; }, 0)||0;
					addTo.crit.count += critCount;
					addTo.crit.sum += critSum;
				}
				addTo[type].count += count;
				addTo[type].sum += sum;


				var typeSumTo = _const.SUM_TO_MAIN[type];
				if (typeSumTo) {
					addTo[typeSumTo] = addTo[typeSumTo] || {sum: 0, count: 0};
					addTo[typeSumTo].sum += sum;
				}
				if (!isHeal) {
					if (!isPassive) {
						addTo.dmgSum.count += count;
					}
					addTo.dmgSum.sum += sum;
				}
			}
			return addTo;
		}
	}
	function downgradeArchiveGroup(fullStats) {
		var archiveGroup = $.extend({}, fullStats);
		delete archiveGroup.total;
		delete archiveGroup.level;
		return archiveGroup;
	}

	function addArchiveGroup(group) {
		var _archiveGroups = _archive.archiveGroups;
		if (!group) return;
		var archiveGroup = countArchiveFromGroup(group);

		if (!archiveGroup) return;

		var lastStatGroup = _archiveGroups[_archiveGroups.length-1];
		if (!lastStatGroup || lastStatGroup.ts[0] === archiveGroup.ts[0]) {
			/* последняя группа обновляется каждый ход*/
			_archiveGroups[_archiveGroups.length-1] = archiveGroup;
		} else if (lastStatGroup.ts[0] < archiveGroup.ts[0]) {
			_archiveGroups.push(archiveGroup);
		} else {
			var isInArr = false;
			for (var i=0; i<_archiveGroups.length; i++) {
				var sg = _archiveGroups[i];
				if (sg.ts[0] === archiveGroup.ts[0]) {
					_archiveGroups[i] = archiveGroup;
					isInArr = true;
					break;
				}
			}
			if (!isInArr) {
				_archiveGroups.push(archiveGroup);
				_archiveGroups.sort(function(a,b) {
					return a.ts[0] - b.ts[0];
				});
//					console.log('add to millde', archiveGroup);
			}
		}
	}
	function loadArchiveGroups() {
		var _archiveGroups = _ext.log.get('archiveGroups') || [];
		_archiveGroups.sort(function(a,b) {
			return a.ts[0] - b.ts[0];
		});
		for (var i=0; i<_archiveGroups.length-1; i++) { /* remove doubles */
			if (_archiveGroups[i].ts[0] === _archiveGroups[i+1].ts[0]) {
				_archiveGroups.splice(i, 1);
				i--;
			}
		}
		_archiveGroups.map(upgradeArchiveGroup);
		_archive.archiveGroups = _archiveGroups;
	}
	function saveArchiveGroups() {
		var _archiveGroups = _archive.archiveGroups;
		var max = _ext.settings.settingsValues.maxArchiveLength || _const.MAX_ARCHIVE_LENGTH;

		_archiveGroups = _archiveGroups.slice(_archiveGroups.length-max);
		var toSave = _archiveGroups.map(downgradeArchiveGroup);
		_ext.log.set('archiveGroups', toSave);
	}

	$.extend(_archive, {
		drawArchiveGroups: drawArchiveGroups,

		loadArchiveGroups: loadArchiveGroups,
		saveArchiveGroups: saveArchiveGroups,
		addArchiveGroup: addArchiveGroup
	});
	return _archive;
})({});
_ext.subscribe('init', function() {
	_archive.loadArchiveGroups();
	for (var i=1; i<_groupMessages.list.length; i++) {
		var gr = _groupMessages.list[i];
		_archive.addArchiveGroup(gr);
	}
	_archive.saveArchiveGroups();


	_ext.subscribe('newMessages', function() {
		var group = _groupMessages.list[_groupMessages.list.length - 1];

		_archive.addArchiveGroup(group);
	});
	_ext.subscribe('groupFinished', function(group, index) {
		_archive.addArchiveGroup(group);
		_archive.saveArchiveGroups();
	});
});
_elements.getTabInner('archive').on('click', '.group-title', function() {
	var $group = $(this).closest('.group');
	var index = $group.data('index');
	var ts = _archive.archiveGroups[index].ts || [];
	console.log('archive>', _archive.archiveGroups[index], index, new Date(ts[0] * 1000));
});
/* eo archive */



/* stats */
/* статистика собирается из архива */
var _stats = (function(_stats) {
	_ext.elements.addTab('stats-side', {zone: 'equip', title: 'стат', content: '<div class="stats" />'});
	_ext.elements.activeTab('stats-side');
	var $stats = _ext.elements.getTabInner('stats-side');


	function addToStats(addTo, addFrom) {
		for (var type in addFrom) if (addFrom.hasOwnProperty(type)) {
			var st = addFrom[type];
			addTo[type] = addTo[type] || {sum: 0, count: 0};
			if (typeof st === 'number') {
				addTo[type].count += st;
			} else {
				addTo[type].count += st.count;
				addTo[type].sum += st.sum;
			}
		}

	}

	function countStatsTotal(archiveGroups, count) {
		archiveGroups = archiveGroups || _archive.archiveGroups;
		count = count || archiveGroups.length;
		var me = {};
		var enemy = {};
		var fights = 0;
		var loot = { pickup: 0, empty: 0, drop: 0};
		var meByMob = {};
		var enemyByMob = {};
		var actionsTimes = {};
		var actionsCounts = {};
		var actionsSum = 0;
		var actionsTime = 0;
		var fightRestTime = 0;
		var otherTime = 0;
		var mobId;

		for (var i=Math.max(archiveGroups.length-count, 0); i<archiveGroups.length; i++) {
			var fullStats = archiveGroups[i];
			var type = fullStats.broken ? 'broken' : fullStats.type;
			if (!fullStats.ts || type==='broken') continue;
			if (type === 'fight') {
				mobId = fullStats.mobId;
				addToStats(me, fullStats.total.me );
				addToStats(enemy, fullStats.total.enemy);
				meByMob[mobId] = meByMob[mobId] || {};
				addToStats(meByMob[mobId], fullStats.total.me);
				enemyByMob[mobId] = enemyByMob[mobId] || {};
				addToStats(enemyByMob[mobId], fullStats.total.enemy);

				fights++;
				var lt = fullStats.loot;
				if (lt) {
					loot[lt]++;
				}
			}
			var nextFullStats = archiveGroups[i+1];
			var timeStart = fullStats.ts[0];
			var timeEnd = fullStats.ts[1];
			if (type !== 'fight' && nextFullStats && nextFullStats.ts) {
				var timeStartNext = nextFullStats.ts[0];
				if (timeStartNext - timeEnd < 120) timeEnd = timeStartNext; // проверка на случай сломанной группы (2)
			}
			var time = timeEnd - timeStart;
//				lastTimeEnd = fullStats.ts[1];
			if (type === 'fight' || type === 'rest') {
				fightRestTime += time;
			} else {
				otherTime += time;
			}
			type = type || 'undefined';
			actionsTimes[type] = (actionsTimes[type] || 0) + time;
			actionsCounts[type] = (actionsCounts[type] | 0) + 1;
			actionsTime += time;
			actionsSum++;
		}



		var statsTotal = {
			fights: fights,
			fightRestTime: fightRestTime,
			otherTime: otherTime,
			actionsTime: actionsTime,
			actionsTimes: actionsTimes,
			actionsCounts: actionsCounts,
			actionsSum: actionsSum,
			loot: loot,
			me: me,
			enemy: enemy,
			meByMob: meByMob,
			enemyByMob: enemyByMob
		};
		if (mobId) statsTotal.lastMobId = mobId;
		return statsTotal;
	}

	_ext.subscribe('settingsChange', function(key, value) {
		if (key==='statsByMob' || key==='statsByMobId' || key==='myStatsByMob' || key==='statsActionsCount' || key==='statsByLevel' || key==='statsByLevelValue') {
			drawStatsSide();
		}
	});
//		var statsActionsCount = _ext.settings.settingsValues.statsActionsCount;
//		var statsByMob = _ext.settings.settingsValues.statsByMob;
	function groupsByLevel(archiveGroups, level) {
		var levelsLog = _ext.log.get('levelsLog') || [];
		if (level) {
			var lv1 = levelsLog.filter(function(item) { return item[1] === level;})[0] || [];
			var lv2 = levelsLog.filter(function(item) { return item[1] === level+1;})[0] || [];
		} else {
			lv1 = levelsLog[levelsLog.length-1];
			lv2 = [];
		}
		var time1 = lv1[0];
		var time2 = lv2[0];
		var i1 = null;
		var i2 = null;
		for (var i=0; i<archiveGroups.length; i++) {
			var ts1 = archiveGroups[i].ts[0];
			var ts2 = archiveGroups[archiveGroups.length - 1 - i].ts[0];
			if (i1===null && ts1>time1) i1 = i;
			if (i2===null && ts2<time2) i2 = archiveGroups.length - 1 - i;
		}
		return (i1!==null && !time2) ? archiveGroups.slice(i1) : archiveGroups.slice(i1|0, i2|0);
	}
	function drawStatsSide(archiveGroups) {
		archiveGroups = archiveGroups || _archive.archiveGroups;
		var groups =  _ext.settings.settingsValues.statsByLevel ? groupsByLevel(archiveGroups, _ext.settings.settingsValues.statsByLevelValue) : archiveGroups;

		var statsTotal = countStatsTotal(groups, _ext.settings.settingsValues.statsActionsCount);
		var mobId = _ext.settings.settingsValues.statsByMob && (_ext.settings.settingsValues.statsByMobId || statsTotal.lastMobId);

		var html = '';
		var htmlMe;
		if(_ext.settings.settingsValues.myStatsByMob && mobId) {
			htmlMe = drawStatsSideByActor(statsTotal.meByMob[mobId]);
		} else {
			htmlMe = drawStatsSideByActor(statsTotal.me);
		}
		var htmlEnemy;
		if (mobId) {
			htmlEnemy =
				'<tr class="unhover">' +
					'<td class="stats-against" colspan="5"><a href="/guide/mobs/' + mobId + '" target="_blank">' + _const.MOBS[mobId] + '</a></td>' +
				'</tr>' +
				drawStatsSideByActor(statsTotal.enemyByMob[mobId]);
		} else {
			htmlEnemy =
				'<tr class="unhover">' +
					'<td class="stats-against" colspan="5">бестии</td>' +
				'</tr>' +
				drawStatsSideByActor(statsTotal.enemy);
		}
		var statsTable =
			'<table class="table table-condensed table-noborder table-hover-dark table-stats">' +
				'<tr class="unhover">' +
					'<th class="stats-name"></th>' +
					'<th class="stats-average" title="среднее значение">средн</th>' +
					'<th class="stats-count" title="количество срабатываний из 100 ударов">шанс</th>' +
					'<th class="stats-sum" title="доля от общего урона">урон</th>' +
					'<th class="stats-bonus" title="прибавка к урону от умения">эфф</th>' +
				'</tr>' +
				'<tbody class="stats-me">' +
					htmlMe +
				'</tbody>' +
				'<tbody class="stats-enemy">' +
					htmlEnemy +
				'</tbody>' +
			'</table>';


		var loot = statsTotal.loot;
		var htmlLoot = '<span class="stats-name" title="Поднял/Пусто/Выбросил">' + _icons.pickup + '</span> ' +
			'<span title="Поднял">' + loot.pickup + '</span> / <span title="Пусто">' + loot.empty + '</span> / <span title="Выбросил">' + loot.drop + '</span>';


		var htmlTime =
			'<b>' + statsTotal.actionsSum + '</b> ' + _ext.utils.declenstionByNumber(statsTotal.actionsSum, ['действие', 'действия', 'действий']) + ' за ' + _ext.utils.timeSpan(statsTotal.actionsTime) + '<br />';
		var interestAverageActions = [{
			type: 'fight,rest',
			text: 'бой/отдых',
			icon: '<span class="glyphicon glyphicon-flag"></span>'
		}, {
			type: 'walk',
			text: 'в пути'
		}, {
			type: 'quest,city,nearcity,noeffect',
			text: 'задания'
		}, {
			type: 'idle',
			text: 'безделье'
		}, {
			type: 'dead',
			text: 'воскресание'
		}, {
			type: 'energy',
			text: 'восстановление'
		}, {
			type: 'trade,equip',
			text: 'торговля и экипировка'
		}, {
			type: 'broken,proxy,pvp,undefined',
			text: 'остальное'
		}, {
			title: '<br/><b>В среднем:</b>'
		}, {
			type: 'fight,rest',
			countType: 'fight',
			countAverage: 1,
			icon: '<span class="glyphicon glyphicon-flag"></span>',
			text: 'на бой с учетом отдыха'
		}, {
			type: 'fight',
			countAverage: 1,
			text: 'на бой'
		}, {
			type: 'rest',
			countAverage: 1,
			text: 'на отдых'
		}];
		for (var i=0; i<interestAverageActions.length; i++) {
			var act = interestAverageActions[i];
			if (act.title) {
				htmlTime += act.title + '<br />';
				continue;
			}

			var types = act.type.split(',');
			var count = 0;
			var countTotal = 0;
			var time = 0;
			for (var j=0; j<types.length; j++) {
				var type = types[j];
				time += statsTotal.actionsTimes[type]||0;
				countTotal += statsTotal.actionsCounts[type]||0;
				if (!act.countType) count += statsTotal.actionsCounts[type];
			}
			type = types[0];
			if (act.countType) count = statsTotal.actionsCounts[act.countType];
			var timePercent = Math.round(time / statsTotal.actionsTime * 1000) / 10;
			if (act.countAverage) time = time/count;


			if (time) {
				htmlTime += '<span class="action-icon ' + (act.countType || type) + '" title="' + types.map(function(item) { return _const.ACTION_TYPE_TEXTS[item]; }).join(', ') + '">' + (act.icon || _const.ACTION_TYPE_ICONS[type]) + '</span>';
				if (!act.countAverage) {
					htmlTime += '<span title="' +  _ext.utils.timeSpan(time) + '">' + timePercent.toFixed(1) + '%</span> - ';
				} else {
					htmlTime += _ext.utils.timeSpan(time);
				}
				htmlTime +=  ' ' + act.text + ' (' + countTotal + ')<br />';
			}
		}


		html += statsTable;
		html += '<div class="stats-side stats-loot">' + htmlLoot + '</div>';
		html += '<div class="stats-side stats-time">' + htmlTime + '</div>';

		$stats.html(html);
	}
	function drawStatsSideByActor(stats) {
		var html = '';
		if (!stats) return html;
		var types = [].concat(_const.ACTIVE, ['dmgSum'], _const.PASSIVE);
		for (var i=0; i<types.length; i++) {
			var type = types[i];
			var isDot = isActType('DOT', type);
			var isPassive = isActType('PASSIVE', type);
			var sumTo = _const.SUM_TO_MAIN[type];
			var dmgSum = stats.dmgSum || {};
			var hit = stats.hit || {};

			if (stats[type]) {
				var stat = stats[type];
				var title = _const.ACTION_TRANSLATE[type] +
					(sumTo ? ', включено в ' + _const.ACTION_TRANSLATE[sumTo] :
						(isPassive ? ', не учитывается в сумме' : '' )
					);
				var htmlStat = '<td class="stats-name" title="' + title + '">' + _icons[type] + '</td> ';

				var count = stat.count;
				var sum = stat.sum;
				var average = (Math.round(sum / count * 100) / 100)||0;
				var hitCount = hit.count;
				var hitSum = hit.sum;
				var totalSum = dmgSum.sum;

				var chance = type === 'dmgSum' ? 100 : count/(hitCount + count) * 100;
				var chanceText = type === 'hit' ? '-' : chance>=100 ? Math.round(chance * 10)/10  : chance.toFixed(2);

				var countText = 'сработал ' + _ext.utils.declenstionByNumber(count, ['раз', 'раза', 'раз'], 1);

				if (!sum) {
					htmlStat += '<td class="stats-average"></td>';
					htmlStat += '<td class="stats-count" title="' + countText + '">' + chanceText + '</td>';
					htmlStat += '<td class="stats-count"></td>';
					htmlStat += '<td class="stats-sum"></td>';
				} else {
					var averagePercents = sum/count * hitCount/hitSum * 100;
					var averagePercentsText = Math.round(averagePercents * 100)/100 + '';

					var dmgPercents = sum/totalSum * 100;
					var dmgPercentsText = '' + (dmgPercents<100 ? dmgPercents.toFixed(1) : Math.round(dmgPercents)) + '%';
					var sumText = 'всего ' + _ext.utils.declenstionByNumber(sum, ['урон', 'урона', 'урона'], 1);

					var bonusPercent = Math.round((averagePercents - 100) * chance) / 100;
					var bonusPercentText = bonusPercent && !isDot ?
						(bonusPercent >= 0 ? '+' : '&ndash;') + Math.abs(bonusPercent) + '%' :
						'';
					var bpTranslateText = (averagePercentsText >= 100 ? '+' : '&ndash;') + Math.abs(Math.round(averagePercentsText*100 - 10000)/100) + '% x ' + chanceText;

					htmlStat += '<td class="stats-average" title="' + averagePercentsText + '%">' + average.toFixed(2) + '</td>';
					htmlStat += '<td class="stats-count" title="' + countText + '">' + chanceText + '</td>';
					htmlStat += '<td class="stats-sum" title="' + sumText + '">' + dmgPercentsText + '</td>';
					htmlStat += '<td class="stats-bonus" title="' + bpTranslateText + '">' + bonusPercentText + '</td>';
				}

				html += '<tr class="stats-row stats-row-' + type + '">' + htmlStat + '</tr>';
			}
		}
		return html;
	}


	$.extend(_stats, {
		drawStatsSide: drawStatsSide,
		countStatsTotal: countStatsTotal
	});
	return _stats;
})({});

_ext.subscribe('preload', function() {
	_stats.drawStatsSide();

	_ext.subscribe('newMessages', function() {
		_stats.drawStatsSide();
	});
});

/* eo stats */




_ext.archive = _archive;
_ext.groupMessages = _groupMessages;
_ext.shortMessages = _shortMessages;
_ext.towns = _towns;
_ext.stats = _stats;


/* dom stuff */
$('.pgf-wait-data .alert-info').clone().attr('class', 'ext-wait').insertAfter('#current-action-block');
jQuery('.pgf-wait-data').toggleClass('pgf-hidden', true);
jQuery('.pgf-game-data').toggleClass('pgf-hidden', false);
/* dom stuff */


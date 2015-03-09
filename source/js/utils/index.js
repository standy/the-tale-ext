var utils = module.exports = {};
utils.const = require('./const.js');
utils.subscribeList = require('./pubsub.js').subscribeList;
utils.publish = require('./pubsub.js').publish;
utils.subscribe = require('./pubsub.js').subscribe;
utils.cacheStore = require('./cache.js').cacheStore;
utils.cache = require('./cache.js').cache;
utils.store = require('./store.js');
utils.log = require('./log.js');
utils.settings = require('./settings.js');
utils.notification = require('./notifications.js');
utils.quests = require('./quests.js');
utils.utils = require('./utils.js');
utils.elements = require('./elements.js');
utils.isMyName = require('./isMyName.js');
utils.isActType = require('./isActType.js');


/* todo разнести эту логику */
var $ = require('jquery');

setTimeout(function() {
	$(document).on('ajaxSuccess.ext', function(event, XMLHttpRequest, setting, result) {
		if (setting.url.indexOf('/game/api/info?api_client=') === 0) {
			var game_data = result.data;

			try {
				utils.heroName = game_data.account.hero.base.name;
				utils.map_version = game_data.map_version;
			} catch (e) {}


			if (!utils.preloadDone) {
	//			$(document).trigger(pgf.game.events.DATA_REFRESHED, game_data);
				utils.publish('preload', game_data);
			}
			utils.preloadDone = 1;

			if (!game_data.account.is_old) {
				utils.publish('load', game_data);
				$('.ext-wait').hide();
				$(document).off('ajaxSuccess.ext');
				delete utils.preloadDone;
			}
		}
	});
}, 1000);










const utils = module.exports = {};
utils.const = require('./const');
utils.subscribeList = require('./pubsub').subscribeList;
utils.publish = require('./pubsub').publish;
utils.subscribe = require('./pubsub').subscribe;
utils.cacheStore = require('./cache').cacheStore;
utils.cache = require('./cache').cache;
utils.store = require('./store');
utils.log = require('./log');
utils.settings = require('./settings');
utils.utils = require('./utils');
utils.elements = require('./elements');
utils.isMyName = require('./isMyName');
utils.isActType = require('./isActType');


/* todo разнести эту логику */
const $ = require('jquery');

setTimeout(function() {
	$(document).on('ajaxSuccess.ext', function(event, XMLHttpRequest, setting, result) {
		if (setting.url.indexOf('/game/api/info?api_client=') === 0) {
			const game_data = result.data;

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




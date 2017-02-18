export const utils = {};
import $ from 'jquery';


/* fixme:
 utils.heroName
 utils.map_version
 utils.preloadDone
  */

import {publish} from './pubsub';

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
				publish('preload', game_data);
			}
			utils.preloadDone = 1;

			if (!game_data.account.is_old) {
				publish('load', game_data);
				$('.ext-wait').hide();
				$(document).off('ajaxSuccess.ext');
				delete utils.preloadDone;
			}
		}
	});
}, 1000);




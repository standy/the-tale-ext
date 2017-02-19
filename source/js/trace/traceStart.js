import $ from 'jquery';
import pgf from 'pgf';
import {traceData} from './traceData';

export function traceStart() {
	$(document).bind(pgf.game.events.DATA_REFRESHED + '.ext-trace', (e, game_data) => {
		traceData(game_data);
	});
}

import './auto/initAuto';
import './draw/initDraw';
import './settings/initSettings';
import './utils/initUtils';
import './trace/initTrace';
import {drawStatsSide} from './draw/stats/drawStatsSide';
import {messagesLog} from './trace/messagesLog';
import log from './utils/log';
import {elements} from './utils/elements';
import {publish} from './utils/pubsub';
import {archiveGroups} from './draw/archive/archiveGroups';
import './tables';

import '../css/global.css';
import '../css/glyphicons.css';
import '../css/main.css';


/* todo разнести эту логику */
publish('init');
elements.getTabInner('sets')
	.on('click', '#reset-stats', () => {
		if (confirm('Будет сброшена вся история\nПродолжить?')) {
			log.set('messagesLog', '');
			messagesLog.splice(0, messagesLog.length);
			log.set('archiveGroups', '');
			archiveGroups.splice(0, archiveGroups.length);
			drawStatsSide();
			elements.getTabInner('group').html('');
		}
	});


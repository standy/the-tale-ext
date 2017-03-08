import './auto/initAuto.js';
import './settings/initSettings.js';
import './tables.js';
import Tracking from './tracking/Tracking';
import ShortMessages from './tabs/short/ShortMessages';
import Stats from './tabs/stats/Stats';

import '../css/global.css';
import '../css/glyphicons.css';
import '../css/main.css';



const tracking = new Tracking();
const shortMessages = new ShortMessages();
const stats = new Stats();

tracking.onLoad(() => {
	const pastMessages = tracking.getMessagesLog();
	shortMessages.addMessages(pastMessages);
	stats.addToStats(pastMessages);
});

tracking.onNewMessages(messages => {
	shortMessages.addMessages(messages);
	stats.addToStats(messages);
});

window.ext = {
	tracking,
	shortMessages,
	stats,
};

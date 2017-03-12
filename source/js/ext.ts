import './auto/initAuto.js';
import './tabs/settings/Settings.ts';
import './tables.js';
import Tracking from './tracking/Tracking';
import ShortMessages from './tabs/short/ShortMessages';
import Stats from './tabs/stats/Stats';
import Settings from './tabs/settings/Settings';
import Notifications from './notifications/Notifications';

import '../css/global.css';
import '../css/glyphicons.css';
import '../css/main.css';



const tracking = new Tracking();
const shortMessages = new ShortMessages();
const stats = new Stats();
const settings = new Settings();
const notifications = new Notifications();

tracking.onLoad(() => {
	const pastMessages = tracking.getMessagesLog();
	shortMessages.addMessages(pastMessages);
	stats.addToStats(pastMessages);
});

tracking.onNewMessages(messages => {
	shortMessages.addMessages(messages);
	stats.addToStats(messages);
});


tracking.onNewTurn(hero => {
	notifications.check(hero, settings.settingsValues);
});

window.ext = {
	tracking,
	shortMessages,
	stats,
	settings,
	notifications,
};

import './tabs/settings/Settings.ts';
import './tables.js';
import Tracking from './tracking/Tracking';
import ShortMessages from './tabs/short/ShortMessages';
import Stats from './tabs/stats/Stats';
import Settings from './tabs/settings/Settings';
import Notifications from './notifications/Notifications';
import Auto from './auto/Auto';

import '../css/global.css';
import '../css/glyphicons.css';
import '../css/main.css';
import {fixHtml} from './utils/fixHtml';



const tracking = new Tracking();
const shortMessages = new ShortMessages();
const stats = new Stats();
const settings = new Settings();
const notifications = new Notifications();
const auto = new Auto();

tracking.onLoad(() => {
	const pastMessages = tracking.getMessagesLog();
	shortMessages.addMessages(pastMessages.slice(pastMessages.length - 1000));
	stats.addToStats(pastMessages);
});

tracking.onNewMessages(messages => {
	shortMessages.addMessages(messages);
	stats.addToStats(messages);
});


tracking.onNewTurn(hero => {
	notifications.check(hero, settings.settingsValues);
	auto.check(hero, settings.settingsValues);
});

settings.onCleanup(() => {
	tracking.clear();
	stats.clear();
	shortMessages.clear();
});

fixHtml(settings.settingsValues.extHtml);
settings.onNamedSettingChange('extHtml', fixHtml);

window.ext = {
	tracking,
	shortMessages,
	stats,
	settings,
	notifications,
};

import './js/tabs/settings/Settings.ts';
import './js/tables.js';
import Tracking from './js/tracking/Tracking';
import ShortMessages from './js/tabs/short/ShortMessages';
import Stats from './js/tabs/stats/Stats';
import Settings from './js/tabs/settings/Settings';
import Notifications from './js/notifications/Notifications';
import Auto from './js/auto/Auto';

import './ext.css';
import {fixHtml} from './js/utils/fixHtml';



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

tracking.setMaxLogLength(settings.settingsValues.maxLogLength);
settings.onNamedSettingChange('maxLogLength', tracking.setMaxLogLength);

window.ext = {
	tracking,
	shortMessages,
	stats,
	settings,
	notifications,
};

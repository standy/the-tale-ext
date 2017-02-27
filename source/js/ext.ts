import './auto/initAuto.js';
import './settings/initSettings.js';
import './tables.js';
import Tracking from './tracking/Tracking';
import ShortMessages from './tabs/short/ShortMessages';

import '../css/global.css';
import '../css/glyphicons.css';
import '../css/main.css';



const tracking = new Tracking();
const shortMessages = new ShortMessages();

tracking.onLoad(() => {
	shortMessages.addMessages(tracking.getMessagesLog());
});

tracking.onNewMessages(messages => {
	shortMessages.addMessages(messages);
});

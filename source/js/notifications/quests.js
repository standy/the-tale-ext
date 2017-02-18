import {subscribe} from '../utils/pubsub';
import {checkQuests} from './checkQuests';


subscribe('preload', function() {
	subscribe('newMessages', function(messagesNew, game_data) {
		const hero = game_data.account.hero;
		const quests = hero.quests.quests;
		checkQuests(quests);
	});
});

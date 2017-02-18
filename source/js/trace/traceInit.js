import {subscribe} from '../utils/pubsub';
import {messagesLog} from './messagesLog';
import {parseShort} from '../parse/parseShort';

export function traceInit() {
	for (let i = 0; i < messagesLog.length; i++) {
		const messageNew = messagesLog[i];
		messageNew[4] = parseShort(messageNew[2]) || false;
	}
}

subscribe('settingsChange', function(key/*, value*/) {
	if (key === 'heroNameStart') {
		traceInit();
	}
});


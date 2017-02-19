const _subscribeList = [];

export function publish(eventName, ...args) {
	for (let i = 0; i < _subscribeList.length; i++) {
		const [sEventName, fn] = _subscribeList[i];
		if (eventName === sEventName) {
			fn(...args);
		}
	}
}

export function subscribe(eventName, fn) {
	_subscribeList.push([eventName, fn]);
}

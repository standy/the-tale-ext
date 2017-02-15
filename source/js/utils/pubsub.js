var _subscribeList = [];
function publish(e) {
	var sp = e.split('.');
	var event = sp[0];
	var namespace = sp[1];
	var ctx = this;
	for (var i = 0; i < _subscribeList.length; i++) {
		var s = _subscribeList[i];
		if ((!namespace || namespace === s.namespace) && (!event || event === s.event)) {
			s.fn.apply(ctx, Array.prototype.slice.call(arguments, 1));
		}
	}
}
function subscribe(e, fn) {
	var events = e.split(',');
	if (events.length > 1) {
		events.forEach(function(ev) { subscribe(ev, fn); });
		return;
	}
	var sp = e.split('.');
	var event = sp[0];
	var namespace = sp[1];
	_subscribeList.push({
		event: event,
		namespace: namespace,
		fn: fn
	});
}

module.exports = {
	subscribeList: _subscribeList,
	publish: publish,
	subscribe: subscribe
};

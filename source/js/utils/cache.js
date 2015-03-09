var cacheStore = {};
var cacheTimeId = {};
function cache(name, value, time) {
	if (arguments.length > 1) {
		cacheStore[name] = value;
		if (cacheTimeId[name]) {
			window.clearTimeout(cacheTimeId[name]);
		}
		if (time) {
			cacheTimeId[name] = window.setTimeout(function() {
				delete cacheStore[name];
			}, time);
		}
	} else {
		return cacheStore[name];
	}
}
module.exports = {
	cacheStore: cacheStore,
	cache: cache
};

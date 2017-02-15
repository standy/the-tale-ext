const prefix = 'ext-';
function setStore(key, value) {
	localStorage.setItem(prefix + key, JSON.stringify(value));
}
function getStore(key) {
	return JSON.parse(localStorage.getItem(prefix + key) || localStorage.getItem(key));
}

let store;
if (typeof window === 'object' && window.localStorage && window.JSON) {
	store = {
		get: getStore,
		set: setStore
	};
} else {
	store = {
		get: function() {},
		set: function() {}
	};
}

module.exports = store;

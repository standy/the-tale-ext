const $ = require('jquery');

$('body').one('click', request);

function request() {
	if (Notification.permission.toLowerCase() !== 'granted') {
		Notification.requestPermission(newMessage);
	}
	function newMessage(permission) {
		if (permission !== 'granted') return false;
		const notify = new Notification('Thanks for letting notify you');
		return !!notify;
	}
}


function generateRandomString() {
	return Math.random().toString(36).slice(2);
}

let rndStr = generateRandomString();

function sendNotify(name, options) {
	const d = new Date();
	const h = d.getHours();
	const m = d.getMinutes();
	const time = h + ':' + (m < 10 ? '0' + m : m);
	const nt = new Notification(name, {
		tag: options.tag + rndStr,
		body: options.body + (options.addTime ? '\n' + time : ''),
		icon: options.icon || (window.extPath + 'img/128.png')
	});
	nt.onclick = nt.onclose = function() {
		rndStr = generateRandomString();
	};
}


module.exports = sendNotify;




var $ = require('jquery');

$('body').one('click', request);

function request() {
	if (Notification.permission.toLowerCase() !== 'granted') {
		Notification.requestPermission(newMessage);
	}
	function newMessage(permission) {
		if (permission !== 'granted') return false;
		var notify = new Notification('Thanks for letting notify you');
		return true;
	}
}


function generateRandomString() {
	return Math.random().toString(36).slice(2);
}

var rndStr = generateRandomString();

function sendNotify(name, options) {
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	var time = h + ':' + (m < 10 ? '0' + m : m);
	var nt = new Notification(name, {
		tag: options.tag + rndStr,
		body: options.body + (options.addTime ? '\n' + time : ''),
		icon: options.icon || (window.extPath + 'img/128.png')
	});
	nt.onclick = nt.onclose = function() {
		rndStr = generateRandomString();
	};
}


module.exports = sendNotify;




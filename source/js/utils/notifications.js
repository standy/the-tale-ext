var _subscribe = require('./pubsub.js').subscribe;
var _settings = require('./settings.js');
var $ = require('jquery');


var rndStr = Math.random() + '';

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
$('body').one('click', request);



function sendNotify(name, options) {
//	if (!_settings.settingsValues.notify) return;

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
		rndStr = Math.random() + '';
	};
}


var _notification = {
	sendNotify: sendNotify
};

module.exports = _notification;



var lastNotifyMessagesText = '';
_subscribe('newMessages', function(messagesNew, gameData) {
	var hero = gameData.account.hero;
	var _settingsValues = _settings.settingsValues;
	if (!_settingsValues.notify) return;
	var notifyMessages = [];
	if (_settingsValues.notifyHeroHp) {
		var health = hero.base.health;
//		var healthMax = hero.base.max_health;
//		var healthPercent = health / healthMax * 100;
		var minHp = _settingsValues.notifyHeroHpLowerValue;
		if (health < minHp) {
			notifyMessages.push('Низкое здоровье: ' + health + ' HP');
		}
	}
	if (_settingsValues.notifyHeroEnergy) {
		var energy = hero.energy.value;
//		var energyMax = hero.energy.max;
//		var energyPercent = energy / energyMax * 100;
		var maxEnergy = _settingsValues.notifyHeroEnergyGreaterValue;
		if (energy > maxEnergy) {
			notifyMessages.push('Энергия накопилась: ' + energy);
		}
	}
	if (_settingsValues.notifyHeroIdle) {
		var actionType = hero.action.type;
		if (actionType === 0) {
			notifyMessages.push('Герой бездействует');
		}
	}

	if (notifyMessages.length) {
		var notifyMessagesText = notifyMessages.join('\n');
		if (notifyMessagesText !== lastNotifyMessagesText) {
			/* todo is `this` correct _ext */
			_notification.sendNotify('The Tale Extended - ' + this.heroName, {
				tag: 'send',
				body: notifyMessagesText
			});
		}
		lastNotifyMessagesText = notifyMessagesText;
	}
});


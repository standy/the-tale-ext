$('body').one('click', request);

function request() {
	if ((Notification as any).permission.toLowerCase() !== 'granted') {
		Notification.requestPermission(permission => {
			if (permission !== 'granted') return false;
			const notify = new Notification('Thanks for letting notify you');
			return !!notify;
		});
	}
}


function generateRandomString() {
	return Math.random().toString(36).slice(2);
}

let rndStr = generateRandomString();

type SentNotifyOptions = {
	tag: string;
	body: string;
	icon?: string;
	addTime?: boolean;
};

export function sendNotify(name: string, options: SentNotifyOptions) {
	const d = new Date();
	const h = d.getHours();
	const m = d.getMinutes();
	const time = `${h}:${m < 10 ? '0' + m : m}`;
	const nt = new Notification(name, {
		tag: options.tag + rndStr,
		body: options.body + (options.addTime ? '\n' + time : ''),
		icon: options.icon || (`${window.extPath}img/128.png`),
	});
	nt.onclick = nt.onclose = () => {
		rndStr = generateRandomString();
	};
}

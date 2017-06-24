$('body').one('click', request);

function request() {
	const Notify = Notification as any;
	if (Notify.permission.toLowerCase() !== 'granted') {
		Notify.requestPermission().then((permission: string) => {
			if (permission !== 'granted') return;
			Notify('Thanks for letting notify you');
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

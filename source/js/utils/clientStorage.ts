///<reference path="../typings.d.ts"/>


function set(name: string, messages: any) {
	try {
		pgf.base.settings.set(name, JSON.stringify(messages));
	} catch (e) {
		console.warn('setLog', name, e);
	}
}

function get(name: string) {
	const g = pgf.base.settings.get(name);
	return g ? JSON.parse(g) : null;
}

function size(): number {
	let t = 0;
	for (const x in localStorage) {
		if (localStorage.hasOwnProperty(x)) {
			t += localStorage[x].length * 2;
		}
	}
	return t;
}


export default {
	set,
	get,
	size,
};

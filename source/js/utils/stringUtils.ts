export function capitalize(text) {
	return text.substring(0, 1).toUpperCase() + text.substring(1);
}

export function declensionByNumber(number, titles, addCount) {
	return (addCount ? number + ' ' : '') + titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5] ];
}

export function timeSpan(time) {
	time = Math.floor(+time) || 0;
	const h = Math.floor(time / 60 / 60);
	const m = Math.floor(time / 60) % 60;
	const s = time % 60;
	return (h ? h + ':' : '') + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

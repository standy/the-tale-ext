
interface EventEmitter<DataType> {
	(callback: Callback<DataType>): void;
	emit: Callback<DataType>;
}


function EventEmitter<DataType>() {
	const callbacks:Callback<DataType>[] = [];

	const emitter = (callback => {
		callbacks.push(callback);
	}) as EventEmitter<DataType>;

	emitter.emit = arg => {
		for (let i = 0; i < callbacks.length; i++) {
			const callback = callbacks[i];
			callback(arg);
		}
	};

	return emitter;
}

export default EventEmitter;

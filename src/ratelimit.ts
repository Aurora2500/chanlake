
export const createThrottle = (minInterval: number) => {
	let lastCall = 0;

	const getDelay = () => {
		const now = Date.now();
		const sinceLastCall = now - lastCall;

		if(sinceLastCall > minInterval) {
			lastCall = now;
			return 0;
		} else {
			const delay = minInterval - sinceLastCall;
			lastCall = now + delay;
			return delay;
		}
	}

	return async () => {
		return new Promise(resolve => setTimeout(resolve, getDelay()));
	}
}
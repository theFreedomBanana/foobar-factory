
/**
 * A function that returns a random number included between minValue and maxValue
 */
export const randomNumberBetween = (
	{ minValue, maxValue }: { minValue: number; maxValue: number },
): number => Math.random() * (maxValue - minValue) + minValue;

/**
 * A recursive function that replicates "setInterval", with the ability to set a different interval for every callback triggered
 */
export const customSetInterval = (
	{ callback, getTimeoutIdentifier, setIntervalDuration = () => 0 }: {
		callback: () => void;
		getTimeoutIdentifier?: (identifier: NodeJS.Timeout) => void;
		setIntervalDuration?: () => number,
	},
): void => {
	const timeoutIdentifier = setTimeout(
		() => {
			callback();
			customSetInterval({ callback, getTimeoutIdentifier, setIntervalDuration });
		},
		setIntervalDuration(),
	);
	getTimeoutIdentifier?.(timeoutIdentifier);
};

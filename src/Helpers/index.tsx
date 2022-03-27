
/**
 * A function that returns a random number included between minValue and maxValue
 */
export const randomNumberBetween = (
	{ minValue, maxValue }: { minValue: number; maxValue: number },
): number => Math.random() * (maxValue - minValue) + minValue;

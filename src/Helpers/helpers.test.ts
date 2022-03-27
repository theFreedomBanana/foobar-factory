import { customSetInterval, randomNumberBetween } from ".";

describe("randomNumberBetween helper", () => {
	it("should always return a random number between 0.5 and 2", () => {
		for (let i = 0; i < 10000 ; i++) {
			expect(randomNumberBetween({ maxValue: 2, minValue: 0.5 })).toBeGreaterThanOrEqual(0.5);
			expect(randomNumberBetween({ maxValue: 2, minValue: 0.5 })).toBeLessThan(2);
		}
	});
});

describe("customSetInterval helper", () => {
	jest.useFakeTimers();
	const callback = jest.fn();
	it("should call the callback 10 times in 10 seconds", () => {
		customSetInterval({ callback, setIntervalDuration: () => 1000 });
		jest.advanceTimersByTime(10000);
		expect(callback).toHaveBeenCalledTimes(10);
	});
});

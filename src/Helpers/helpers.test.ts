import { randomNumberBetween } from ".";

describe("randomNumberBetween helper", () => {
	it("should always return a random number between 0.5 and 2", () => {
		for (let i = 0; i < 10000 ; i++) {
			expect(randomNumberBetween({ maxValue: 2, minValue: 0.5 })).toBeGreaterThanOrEqual(0.5);
			expect(randomNumberBetween({ maxValue: 2, minValue: 0.5 })).toBeLessThan(2);
		}
	});
});

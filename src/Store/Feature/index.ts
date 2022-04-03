
export interface FeatureState {
	readonly factory: {
		intervalPerBarMinersId?: {
			[index: string]: number;
		};
		intervalPerByersId?: {
			[index: string]: number;
		};
		intervalPerFooMinersId?: {
			[index: string]: number;
		};
		intervalPerFoobarEngineersId?: {
			[index: string]: number;
		};
	}
	readonly [label: string]: {
		readonly [field: string]: unknown;
	};
}

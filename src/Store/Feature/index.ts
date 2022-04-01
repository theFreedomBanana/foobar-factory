
export interface FeatureState {
	readonly [label: string]: {
		readonly [field: string]: unknown;
	};
}

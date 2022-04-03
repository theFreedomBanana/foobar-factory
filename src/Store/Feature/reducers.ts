import { FEATURE_ACTIONS } from "./actions";
import { FeatureState } from ".";

export const feature = (EMPTY_STATE: FeatureState) => (
	state: FeatureState = EMPTY_STATE, payload: { label: string; type: FEATURE_ACTIONS; [otherArgs: string]: unknown }
) => {
	const { label, type, ...params } = payload;
	if (type === FEATURE_ACTIONS.UPDATE_FEATURE) {
		const nextState = {
			...state,
			...label.split(".").reduceRight(
				(node, field, index, array) => ({
					[field]: {
						...array.slice(0, index + 1).reduce(
							(reduction: { [index: string]: any }, key) => reduction?.[key], state),
						...node,
					},
				}),
				params,
			),
		};

		return nextState;
	} else if (type === FEATURE_ACTIONS.UPDATE_FACTORY_INTERVALS) {
		const nextState = {
			...state,
			factory: {
				...state.factory,
				intervalPerBarMinersId: {
					...state.factory.intervalPerBarMinersId,
					...(params as FeatureState["factory"]).intervalPerBarMinersId,
				},
				intervalPerByersId: {
					...state.factory.intervalPerByersId,
					...(params as FeatureState["factory"]).intervalPerByersId,
				},
				intervalPerFooMinersId: {
					...state.factory.intervalPerFooMinersId,
					...(params as FeatureState["factory"]).intervalPerFooMinersId,
				},
				intervalPerFoobarEngineersId: {
					...state.factory.intervalPerFoobarEngineersId,
					...(params as FeatureState["factory"]).intervalPerFoobarEngineersId,
				},
			},
		};

		return nextState;
	} else {

		return state;
	}
};

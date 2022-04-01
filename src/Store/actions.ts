import { FEATURE_ACTIONS } from "./Feature/actions";
import { RECORD_ACTIONS } from "./Record/actions";

export const ACTIONS = {
	...FEATURE_ACTIONS,
	...RECORD_ACTIONS,
};

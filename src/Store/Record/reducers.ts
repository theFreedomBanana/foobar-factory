
import { ClassEnumeration, ValueOf } from "../../Classes";
import { RecordState } from ".";
import { RECORD_ACTIONS } from "./actions";

/**
 * record is a reducer that handles any events related to the database operations.
 */
export const record = (
	EMPTY_STATE: RecordState,
) => (
	state = EMPTY_STATE,
	payload: { records: ValueOf<ClassEnumeration>[]; type: RECORD_ACTIONS },
) => {
	if (payload.type === RECORD_ACTIONS.CREATE_RECORDS) {
		const nextState = {
			...state,
			[payload.records[0].class]: {
				...state?.[payload.records[0].class],
				...payload.records?.reduce(
					(reduction: RecordState, record: ValueOf<ClassEnumeration>) => ({
						...reduction,
						[record.id]: record,
					}),
					{},
				),
			},
		};

		return nextState;
	} else if (payload.type === RECORD_ACTIONS.ASSEMBLE_FOOBAR) {
		const nextState = { ...state };
		if (payload.records[0].class === "foobar" && Object.keys(state.foo || {}).length > 0 && Object.keys(state.bar || {}).length > 0) {
			delete nextState.foo?.[Object.keys(state.foo || {})[0]];
			if (Math.random() < 0.6) {
				delete nextState.bar?.[Object.keys(state.bar || {})[0]];
				nextState.foobar = { ...nextState.foobar, [payload.records[0].id]: { ...payload.records[0] } };

				return nextState;
			} else {

				return nextState;
			}
		} else {

			return nextState;
		}
	} else {

		return state;
	}
};

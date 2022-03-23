
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
	} else {

		return state;
	}
};

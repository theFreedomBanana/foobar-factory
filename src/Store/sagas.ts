import { put, takeEvery } from "redux-saga/effects";
import { ClassEnumeration, ValueOf } from "../Classes";
import { RECORD_ACTIONS } from "./Record/actions";

interface RecordsActionParams {
	/**
	 * A list of additional params for the action
	 */
	readonly records: ValueOf<ClassEnumeration>[];
	/**
	 * The called action
	 */
	readonly type: RECORD_ACTIONS;
}

function* updateRecordTable(actionParams: RecordsActionParams) {
	if (actionParams.type === RECORD_ACTIONS.CREATE_RECORDS) {
		yield put({ records: actionParams.records, type: RECORD_ACTIONS.CREATE_RECORDS });
	}
}

export function* sagaForRecords() {
	yield takeEvery([RECORD_ACTIONS.CREATE_RECORDS, RECORD_ACTIONS.DELETE_RECORDS], updateRecordTable);
}

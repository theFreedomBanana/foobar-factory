import { all, put, takeEvery } from "redux-saga/effects";
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

function* mining(actionParams: RecordsActionParams) {
	yield put({ records: actionParams.records, type: RECORD_ACTIONS.CREATE_RECORDS });
}

export function* sagaForMining() {
	yield takeEvery([RECORD_ACTIONS.MINING], mining);
}

export function* sagasForFactory() {
	yield all([
		sagaForMining(),
	]);
}

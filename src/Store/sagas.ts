import { all, delay, put, takeEvery } from "redux-saga/effects";
import { ClassEnumeration, ValueOf } from "../Classes";
import { FEATURE_ACTIONS } from "./Feature/actions";
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
interface FeatureActionParams {
	/**
	 * The parameters to edit in the related feature
	 */
	readonly data: { [index: string]: unknown };
	/**
	 * The name / mounting point in the store of the related feature
	 */
	readonly label: string;
	/**
	 * The called action
	 */
	readonly type: FEATURE_ACTIONS;
}

function* mining(actionParams: RecordsActionParams) {
	yield put({ records: actionParams.records, type: RECORD_ACTIONS.UPDATE_RECORDS });
}

function* useRecords(actionParams: RecordsActionParams) {
	if (actionParams.type === RECORD_ACTIONS.ASSEMBLING) {
		yield put({ records: actionParams.records, type: RECORD_ACTIONS.ASSEMBLE_FOOBAR });
	} else if (actionParams.type === RECORD_ACTIONS.BUYING) {
		yield put({ records: actionParams.records, type: RECORD_ACTIONS.CREATE_ROBOT });
	}
}

function* updateFeature(actionParams: FeatureActionParams) {
	const { data, label } = actionParams;
	yield put({ label, type: FEATURE_ACTIONS.UPDATE_FACTORY_INTERVALS, ...data });
}

function* updateRobotTask(actionParams: RecordsActionParams) {
	yield put({
		records: actionParams.records.map((robot) => ({ ...robot, transiting: true })),
		type: RECORD_ACTIONS.UPDATE_RECORDS,
	});
	yield delay(5000);
	yield put({
		records: actionParams.records.map((robot) => ({ ...robot, transiting: false })),
		type: RECORD_ACTIONS.UPDATE_RECORDS,
	});
}

export function* sagaForMining() {
	yield takeEvery([RECORD_ACTIONS.MINING], mining);
}

export function* sagaForAssembling() {
	yield takeEvery([RECORD_ACTIONS.ASSEMBLING, RECORD_ACTIONS.BUYING], useRecords);
}

export function* sagaForUpdatingIntervals() {
	yield takeEvery([FEATURE_ACTIONS.UPDATE_ROBOTS_INTERVALS, FEATURE_ACTIONS.DELETE_ROBOTS_INTERVALS], updateFeature);
}

export function* sagaForMovingRobotToOtherTask() {
	yield takeEvery([RECORD_ACTIONS.MOVE_ROBOT_TO_OTHER_TASK], updateRobotTask);
}

export function* sagasForFactory() {
	yield all([
		sagaForMining(),
		sagaForAssembling(),
		sagaForUpdatingIntervals(),
		sagaForMovingRobotToOtherTask(),
	]);
}

import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { reset } from "redux-form";
import { createSelector } from "reselect";
import { Robot, Tasks } from "../../../Classes/Robot";
import { Store } from "../../../Store";
import { ACTIONS } from "../../../Store/actions";
import { FormValue, ManagmentForm } from "./view";

// #region TYPES
interface ManagmentProps {
	/**
	 * A list of robot dedicated to mining bar
	 */
	readonly barMiners?: Robot[];
	/**
	 * A list of robot dedicated to bying
	 */
	readonly byers?: Robot[];
	/**
	 * Dispatch function from Redux
	 */
	readonly dispatch: Dispatch;
	/**
	 * A list of robot dedicated to mining foo
	 */
	readonly fooMiners?: Robot[];
	/**
	 * A list of robot dedicated to engineering foobar
	 */
	readonly foobarEngineers?: Robot[];
	/**
	 * A list of robot without a task
	 */
	readonly iddleRobots?: Robot[];
	/**
	 * The label of the compoent
	 */
	readonly label: string;
}
// #endregion

// #region CONNEXION
const selectFooMiners = createSelector(
	[(store) => store.record.robot],
	(robotPerId) => {
		const miners: Robot[] | undefined = robotPerId ? Object.values(robotPerId) : undefined;

		return miners?.filter((robot) => robot.currentTask === Tasks.MINE_FOO);
	},
);

const selectBarMiners = createSelector(
	[(store) => store.record.robot],
	(robotPerId) => {
		const miners: Robot[] | undefined = robotPerId ? Object.values(robotPerId) : undefined;

		return miners?.filter((robot) => robot.currentTask === Tasks.MINE_BAR);
	},
);

const selectFoobarEngineers = createSelector(
	[(store) => store.record.robot],
	(robotPerId) => {
		const miners: Robot[] | undefined = robotPerId ? Object.values(robotPerId) : undefined;

		return miners?.filter((robot) => robot.currentTask === Tasks.ASSEMBLE_FOOBAR);
	},
);

const selectByers = createSelector(
	[(store) => store.record.robot],
	(robotPerId) => {
		const miners: Robot[] | undefined = robotPerId ? Object.values(robotPerId) : undefined;

		return miners?.filter((robot) => robot.currentTask === Tasks.BUY_ROBOT);
	},
);

const selectIddleRobots = createSelector(
	[(store) => store.record.robot],
	(robotPerId) => {
		const miners: Robot[] | undefined = robotPerId ? Object.values(robotPerId) : undefined;

		return miners?.filter((robot) => robot.currentTask === Tasks.NONE);
	},
);

const mapStateToProps = (store: Store) => ({
	barMiners: selectBarMiners(store),
	byers: selectByers(store),
	fooMiners: selectFooMiners(store),
	foobarEngineers: selectFoobarEngineers(store),
	iddleRobots: selectIddleRobots(store),
});
// #endregion

// #region COMPONENT
export const RobotManagment = connect(mapStateToProps)(
	memo(
		({ barMiners, byers, dispatch, fooMiners, foobarEngineers, iddleRobots, label }: ManagmentProps) => {
			const { t } = useTranslation();

			const formConfiguration = useMemo(
				() => ({
					form: label,
					initialValues: {
						destinationTask: undefined,
						initialTask: undefined,
					},
					onSubmit: ({ destinationTask, initialTask }: FormValue) => {
						let robotToAssign;
						switch (initialTask) {
						case Tasks.MINE_FOO:
							robotToAssign = { ...fooMiners?.[0] };
							break;
						case Tasks.MINE_BAR:
							robotToAssign = { ...barMiners?.[0] };
							break;
						case Tasks.ASSEMBLE_FOOBAR:
							robotToAssign = { ...foobarEngineers?.[0] };
							break;
						case Tasks.BUY_ROBOT:
							robotToAssign = { ...byers?.[0] };
							break;
						default:
							robotToAssign = { ...iddleRobots?.[0] };
							break;
						}
						if (robotToAssign) {
							robotToAssign.currentTask = destinationTask;
						}

						dispatch({ records: [robotToAssign], type: ACTIONS.UPDATE_RECORDS });
						dispatch(reset(label));
					},
					validate: (formValue: FormValue) => {
						const formError: { -readonly [index in keyof FormValue]: string } = {};
						Object.keys(formValue).forEach((key) => {
							if (!formValue[key as keyof FormValue]) {
								formError[key as keyof FormValue] = t("Feature:RobotManagment:error");
							}
						});

						return formError;
					},
				}),
				[barMiners, byers, dispatch, fooMiners, foobarEngineers, iddleRobots, label, t],
			);

			const enabledOptionsForInitialTask = useMemo(
				() => ({
					assembleFoobar: !!(foobarEngineers && foobarEngineers?.length > 0),
					buyRobot: !!(byers && byers?.length > 0),
					mineBar: !!(barMiners && barMiners?.length > 0),
					mineFoo: !!(fooMiners && fooMiners?.length > 0),
					none: !!(iddleRobots && iddleRobots?.length > 0),
				}),
				[barMiners, byers, fooMiners, foobarEngineers, iddleRobots],
			);

			return (

				<ManagmentForm enabledOptionsForInitialTask={enabledOptionsForInitialTask} {...formConfiguration} />
			);
		},
	),
);

RobotManagment.displayName = "robotManagment";
// #endregion

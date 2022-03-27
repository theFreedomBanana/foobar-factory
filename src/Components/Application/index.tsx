import { memo, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { createSelector } from "reselect";
import { v4 as uuidv4 } from "uuid";
import { Robot, Tasks } from "../../Classes/Robot";
import { customSetInterval, randomNumberBetween } from "../../Helpers";
import { Store } from "../../Store";
import { RECORD_ACTIONS } from "../../Store/Record/actions";

// #region TYPES
interface FactoryProps {
	barMiners?: Robot[];
	dispatch: Dispatch;
	fooMiners?: Robot[];
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

const mapStateToProps = (store: Store) => ({
	barMiners: selectBarMiners(store),
	fooMiners: selectFooMiners(store),
});
// #endregion

// #region COMPONENT
const application = memo(
	({ barMiners, dispatch, fooMiners }: FactoryProps) => {

		useEffect(
			() => {
				fooMiners?.forEach(() => {
					setInterval(
						() => {
							dispatch({ records: [{ class: "foo", id: uuidv4() }], type: RECORD_ACTIONS.MINING });
						},
						1000,
					);
				});
			},
			[dispatch, fooMiners],
		);

		useEffect(
			() => {
				barMiners?.forEach(() => {
					customSetInterval({
						callback: () => dispatch({ records: [{ class: "bar", id: uuidv4() }], type: RECORD_ACTIONS.MINING }),
						setIntervalDuration: () => randomNumberBetween({ maxValue: 2, minValue: 0.5 }) * 1000,
					});
				});
			},
			[dispatch, barMiners],
		);

		return null;
	},
);
// #endregion

export const Factory = connect(mapStateToProps)(application);

Factory.displayName = "factory";

import { memo, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { createSelector } from "reselect";
import { v4 as uuidv4 } from "uuid";
import { Robot, Tasks } from "../../../Classes/Robot";
import { customSetInterval, randomNumberBetween } from "../../../Helpers";
import { Store } from "../../../Store";
import { FEATURE_ACTIONS } from "../../../Store/Feature/actions";
import { RECORD_ACTIONS } from "../../../Store/Record/actions";

// #region TYPES
interface FactoryProps {
	readonly barMiners?: Robot[];
	readonly intervalPerBarMinersId: { [robotId: string]: NodeJS.Timer };
	readonly byers?: Robot[];
	readonly intervalPerByersId: { [robotId: string]: NodeJS.Timer };
	readonly dispatch: Dispatch;
	readonly fooMiners?: Robot[];
	readonly intervalPerFooMinersId: { [robotId: string]: NodeJS.Timer };
	readonly foobarEngineers?: Robot[];
	readonly intervalPerFoobarEngineersId: { [robotId: string]: NodeJS.Timer };
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

const selectBarMinersIntervals = createSelector(
	[(store) => store.feature.factory],
	({ intervalPerBarMinersId }) => intervalPerBarMinersId,
);
const selectFooMinersIntervals = createSelector(
	[(store) => store.feature.factory],
	({ intervalPerFooMinersId }) => intervalPerFooMinersId,
);
const selectByersIntervals = createSelector(
	[(store) => store.feature.factory],
	({ intervalPerByersId }) => intervalPerByersId,
);
const selectFoobarEngineersIntervals = createSelector(
	[(store) => store.feature.factory],
	({ intervalPerFoobarEngineersId }) => intervalPerFoobarEngineersId,
);

const mapStateToProps = (store: Store) => ({
	barMiners: selectBarMiners(store),
	byers: selectByers(store),
	fooMiners: selectFooMiners(store),
	foobarEngineers: selectFoobarEngineers(store),
	intervalPerBarMinersId: selectBarMinersIntervals(store),
	intervalPerByersId: selectByersIntervals(store),
	intervalPerFooMinersId: selectFooMinersIntervals(store),
	intervalPerFoobarEngineersId: selectFoobarEngineersIntervals(store),
});
// #endregion

// #region COMPONENT
const application = memo(
	(props: FactoryProps) => {
		const {
			barMiners, byers,
			dispatch,
			fooMiners, foobarEngineers,
			intervalPerBarMinersId, intervalPerByersId, intervalPerFooMinersId, intervalPerFoobarEngineersId,
			label,
		} = props;

		const reference = useRef<FactoryProps>();
		useEffect(() => {
			reference.current = props;
		});
		const previousProps = reference.current;

		useEffect(
			() => {
				if (previousProps?.fooMiners !== fooMiners) {
					const newIntervalPerFooMinersId = { ...intervalPerFooMinersId };
					const intervalsToDelete = Object.entries(intervalPerFooMinersId || {}).filter(
						([oldMinerId]) => !(fooMiners?.find(({ id }) => oldMinerId === id)),
					).map(([oldMinerId, interval]) => {
						delete newIntervalPerFooMinersId[oldMinerId];

						return interval;
					});
					intervalsToDelete.forEach((interval) => clearInterval(interval));
					const newMiners = fooMiners?.filter((miner) => !Object.keys(intervalPerFooMinersId || {}).find(
						(minerId) => minerId === miner.id,
					));

					newMiners?.forEach(({ id }) => {
						const interval = setInterval(
							() => {
								dispatch({ records: [{ class: "foo", id: uuidv4() }], type: RECORD_ACTIONS.MINING });
							},
							1000,
						);
						newIntervalPerFooMinersId[id] = interval;
					});

					dispatch({
						intervalPerFooMinersId: newIntervalPerFooMinersId,
						label,
						type: FEATURE_ACTIONS.UPDATE_FEATURE,
					});
				}
			},
			[dispatch, fooMiners, intervalPerFooMinersId, label, previousProps?.fooMiners],
		);

		useEffect(
			() => {
				if (previousProps?.barMiners !== barMiners) {
					const newIntervalPerBarMinersId = { ...intervalPerBarMinersId };
					const intervalsToDelete = Object.entries(intervalPerBarMinersId || {}).filter(
						([oldMinerId]) => !(barMiners?.find(({ id }) => oldMinerId === id)),
					).map(([oldMinerId, interval]) => {
						delete newIntervalPerBarMinersId[oldMinerId];

						return interval;
					});
					intervalsToDelete.forEach((interval) => clearInterval(interval));
					const newMiners = barMiners?.filter((miner) => !Object.keys(intervalPerBarMinersId || {}).find(
						(minerId) => minerId === miner.id,
					));

					newMiners?.forEach(({ id }) => {
						customSetInterval({
							callback: () => dispatch({ records: [{ class: "bar", id: uuidv4() }], type: RECORD_ACTIONS.MINING }),
							getTimeoutIdentifier: (identifier) => newIntervalPerBarMinersId[id] = identifier,
							intervalDuration: randomNumberBetween({ maxValue: 2, minValue: 0.5 }),
						});
					});

					dispatch({
						intervalPerBarMinersId: newIntervalPerBarMinersId,
						label,
						type: FEATURE_ACTIONS.UPDATE_FEATURE,
					});
				}
			},
			[dispatch, barMiners, intervalPerBarMinersId, label, previousProps?.barMiners],
		);

		useEffect(
			() => {
				if (previousProps?.foobarEngineers !== foobarEngineers) {
					const newIntervalPerFoobarEngineersId = { ...intervalPerFoobarEngineersId };
					const intervalsToDelete = Object.entries(intervalPerFoobarEngineersId || {}).filter(
						([oldEngineerId]) => !(foobarEngineers?.find(({ id }) => oldEngineerId === id)),
					).map(([oldEngineerId, interval]) => {
						delete newIntervalPerFoobarEngineersId[oldEngineerId];

						return interval;
					});
					intervalsToDelete.forEach((interval) => clearInterval(interval));
					const newEngineers = foobarEngineers?.filter(
						(engineer) => !Object.keys(intervalPerFoobarEngineersId || {}).find(
							(engineerId) => engineerId === engineer.id,
						),
					);

					newEngineers?.forEach(({ id }) => {
						const interval = setInterval(
							() => {
								dispatch({ records: [{ class: "foobar", id: uuidv4() }], type: RECORD_ACTIONS.MINING });
							},
							1000,
						);
						newIntervalPerFoobarEngineersId[id] = interval;
					});

					dispatch({
						intervalPerFoobarEngineersId: newIntervalPerFoobarEngineersId,
						label,
						type: FEATURE_ACTIONS.UPDATE_FEATURE,
					});
				}
			},
			[dispatch, foobarEngineers, intervalPerFoobarEngineersId, label, previousProps?.foobarEngineers],
		);

		useEffect(
			() => {
				if (previousProps?.byers !== byers) {
					const newIntervalPerByersId = { ...intervalPerByersId };
					const intervalsToDelete = Object.entries(intervalPerByersId || {}).filter(
						([oldByerId]) => !(byers?.find(({ id }) => oldByerId === id)),
					).map(([oldByerId, interval]) => {
						delete newIntervalPerByersId[oldByerId];

						return interval;
					});
					intervalsToDelete.forEach((interval) => clearInterval(interval));
					const newByers = byers?.filter((byer) => !Object.keys(intervalPerByersId || {}).find(
						(byerId) => byerId === byer.id,
					));

					newByers?.forEach(({ id }) => {
						const interval = setInterval(
							() => {
								dispatch({ records: [{ class: "robot", id: uuidv4() }], type: RECORD_ACTIONS.MINING });
							},
							1000,
						);
						newIntervalPerByersId[id] = interval;
					});

					dispatch({
						intervalPerByersId: newIntervalPerByersId,
						label,
						type: FEATURE_ACTIONS.UPDATE_FEATURE,
					});
				}
			},
			[dispatch, byers, intervalPerByersId, label, previousProps?.byers],
		);

		return null;
	},
);
// #endregion

export const Factory = connect(mapStateToProps)(application);

Factory.displayName = "factory";

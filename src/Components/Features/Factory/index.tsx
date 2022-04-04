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
					Object.entries(intervalPerFooMinersId || {}).forEach(
						([oldMinerId]) => {
							if (!(fooMiners?.find(({ id }) => oldMinerId === id))) {
								clearTimeout(intervalPerFooMinersId[oldMinerId]);
								dispatch({
									data: {
										intervalPerFooMinersId: { [oldMinerId]: undefined },
									},
									label,
									type: FEATURE_ACTIONS.DELETE_ROBOTS_INTERVALS,
								});
							}
						}
					);
					const newMiners = fooMiners?.filter((miner) => miner.transiting === false)
						.filter((miner) => (
							!previousProps?.fooMiners?.find(({ id }) => id === miner.id)
							|| previousProps?.fooMiners?.find(({ id }) => id === miner.id)?.transiting === true
						));
					newMiners?.forEach(({ id }) => {
						const interval = setInterval(
							() => {
								dispatch({ records: [{ class: "foo", id: uuidv4() }], type: RECORD_ACTIONS.MINING });
							},
							1000,
						);
						dispatch({
							data: {
								intervalPerFooMinersId: { [id]: interval },
							},
							label,
							type: FEATURE_ACTIONS.UPDATE_ROBOTS_INTERVALS,
						});
					});
				}
			},
			[dispatch, fooMiners, intervalPerFooMinersId, label, previousProps?.fooMiners],
		);

		useEffect(
			() => {
				if (previousProps?.barMiners !== barMiners) {
					Object.entries(intervalPerBarMinersId || {}).forEach(
						([oldMinerId]) => {
							if (!(barMiners?.find(({ id }) => oldMinerId === id))) {
								clearTimeout(intervalPerBarMinersId[oldMinerId]);
								dispatch({
									data: {
										intervalPerBarMinersId: { [oldMinerId]: undefined },
									},
									label,
									type: FEATURE_ACTIONS.DELETE_ROBOTS_INTERVALS,
								});
							}
						}
					);
					const newMiners = barMiners?.filter((miner) => miner.transiting === false)
						.filter((miner) => (
							!previousProps?.barMiners?.find(({ id }) => id === miner.id)
							|| previousProps?.barMiners?.find(({ id }) => id === miner.id)?.transiting === true
						));
					newMiners?.forEach((miner) => {
						customSetInterval({
							callback: () => {
								dispatch({ records: [{ class: "bar", id: uuidv4() }], type: RECORD_ACTIONS.MINING });
							},
							getTimeoutIdentifier: (identifier) => {
								dispatch({
									data: {
										intervalPerBarMinersId: { [miner.id]: identifier },
									},
									label,
									type: FEATURE_ACTIONS.UPDATE_ROBOTS_INTERVALS,
								});
							},
							setIntervalDuration: () => randomNumberBetween({ maxValue: 2, minValue: 0.5 }) * 1000,
						});
					});
				}
			},
			[dispatch, barMiners, intervalPerBarMinersId, label, previousProps?.barMiners],
		);

		useEffect(
			() => {
				if (previousProps?.foobarEngineers !== foobarEngineers) {
					Object.entries(intervalPerFoobarEngineersId || {}).forEach(
						([oldMinerId]) => {
							if (!(foobarEngineers?.find(({ id }) => oldMinerId === id))) {
								clearTimeout(intervalPerFoobarEngineersId[oldMinerId]);
								dispatch({
									data: {
										intervalPerFoobarEngineersId: { [oldMinerId]: undefined },
									},
									label,
									type: FEATURE_ACTIONS.DELETE_ROBOTS_INTERVALS,
								});
							}
						}
					);
					const newMiners = foobarEngineers?.filter((miner) => miner.transiting === false)
						.filter((miner) => (
							!previousProps?.foobarEngineers?.find(({ id }) => id === miner.id)
							|| previousProps?.foobarEngineers?.find(({ id }) => id === miner.id)?.transiting === true
						));
					newMiners?.forEach(({ id }) => {
						const interval = setInterval(
							() => {
								dispatch({ records: [{ class: "foobar", id: uuidv4() }], type: RECORD_ACTIONS.ASSEMBLING });
							},
							1000,
						);
						dispatch({
							data: {
								intervalPerFoobarEngineersId: { [id]: interval },
							},
							label,
							type: FEATURE_ACTIONS.UPDATE_ROBOTS_INTERVALS,
						});
					});
				}
			},
			[dispatch, foobarEngineers, intervalPerFoobarEngineersId, label, previousProps?.foobarEngineers],
		);

		useEffect(
			() => {
				if (previousProps?.byers !== byers) {
					Object.entries(intervalPerByersId || {}).forEach(
						([oldMinerId]) => {
							if (!(byers?.find(({ id }) => oldMinerId === id))) {
								clearTimeout(intervalPerByersId[oldMinerId]);
								dispatch({
									data: {
										intervalPerByersId: { [oldMinerId]: undefined },
									},
									label,
									type: FEATURE_ACTIONS.DELETE_ROBOTS_INTERVALS,
								});
							}
						}
					);
					const newMiners = byers?.filter((miner) => miner.transiting === false)
						.filter((miner) => (
							!previousProps?.byers?.find(({ id }) => id === miner.id)
							|| previousProps?.byers?.find(({ id }) => id === miner.id)?.transiting === true
						));
					newMiners?.forEach(({ id }) => {
						const interval = setInterval(
							() => {
								dispatch({ records: [{ class: "robot", currentTask: Tasks.NONE, id: uuidv4() }], type: RECORD_ACTIONS.BUYING });
							},
							1000,
						);
						dispatch({
							data: {
								intervalPerByersId: { [id]: interval },
							},
							label,
							type: FEATURE_ACTIONS.UPDATE_ROBOTS_INTERVALS,
						});
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

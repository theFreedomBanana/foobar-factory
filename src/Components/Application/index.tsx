import { memo, useEffect, useRef, useState } from "react";
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
	foobarEngineers?: Robot[];
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

const mapStateToProps = (store: Store) => ({
	barMiners: selectBarMiners(store),
	fooMiners: selectFooMiners(store),
	foobarEngineers: selectFoobarEngineers(store),
});
// #endregion

// #region COMPONENT
const application = memo(
	(props: FactoryProps) => {
		const { barMiners, dispatch, fooMiners, foobarEngineers } = props;
		const [foobarIntervals, updateFoobarIntervals] = useState<{ [robotId: string]: NodeJS.Timer }>();

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

		const reference = useRef<FactoryProps>();
		useEffect(() => {
			reference.current = props;
		});
		const previousProps = reference.current;

		useEffect(
			() => {
				if (previousProps?.foobarEngineers !== foobarEngineers) {
					Object.values(foobarIntervals || {}).forEach(clearInterval);
					foobarEngineers?.forEach(({ id }) => {
						const interval = setInterval(
							() => {
								dispatch({ records: [{ class: "foobar", id: uuidv4() }], type: RECORD_ACTIONS.ASSEMBLING });
							},
							2000,
						);
						updateFoobarIntervals({ ...foobarIntervals, [id]: interval });
					});
				}
			},
			[dispatch, foobarEngineers, foobarIntervals, previousProps, updateFoobarIntervals],
		);

		return null;
	},
);
// #endregion

export const Factory = connect(mapStateToProps)(application);

Factory.displayName = "factory";

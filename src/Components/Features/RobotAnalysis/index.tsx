import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { createSelector } from "reselect";
import { Robot, Tasks } from "../../../Classes/Robot";
import { Store } from "../../../Store";

// #region TYPES
interface RobotAnalysisProps {
	readonly barMiners?: Robot[];
	readonly byers?: Robot[];
	readonly dispatch: Dispatch;
	readonly fooMiners?: Robot[];
	readonly foobarEngineers?: Robot[];
	readonly iddleRobots?: Robot[];
}
// #endregion

// #region CONNEXION
const selectFooMiners = createSelector(
	[(store) => store.record.robot],
	(robotPerId) => {
		const robots: Robot[] | undefined = robotPerId ? Object.values(robotPerId) : undefined;

		return robots?.filter((robot) => robot.currentTask === Tasks.MINE_FOO);
	},
);

const selectBarMiners = createSelector(
	[(store) => store.record.robot],
	(robotPerId) => {
		const robots: Robot[] | undefined = robotPerId ? Object.values(robotPerId) : undefined;

		return robots?.filter((robot) => robot.currentTask === Tasks.MINE_BAR);
	},
);

const selectFoobarEngineers = createSelector(
	[(store) => store.record.robot],
	(robotPerId) => {
		const robots: Robot[] | undefined = robotPerId ? Object.values(robotPerId) : undefined;

		return robots?.filter((robot) => robot.currentTask === Tasks.ASSEMBLE_FOOBAR);
	},
);

const selectByers = createSelector(
	[(store) => store.record.robot],
	(robotPerId) => {
		const robots: Robot[] | undefined = robotPerId ? Object.values(robotPerId) : undefined;

		return robots?.filter((robot) => robot.currentTask === Tasks.BUY_ROBOT);
	},
);

const selectIddleRobots = createSelector(
	[(store) => store.record.robot],
	(robotPerId) => {
		const robots: Robot[] | undefined = robotPerId ? Object.values(robotPerId) : undefined;

		return robots?.filter((robot) => robot.currentTask === Tasks.NONE);
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
export const RobotAnalysis = connect(mapStateToProps)(
	memo(
		({ barMiners, byers, fooMiners, foobarEngineers, iddleRobots }: RobotAnalysisProps) => {
			const { t } = useTranslation();

			const data = useMemo(
				() => ([
					{ count: Object.keys(barMiners || {}).length, name: t("Feature:RobotAnalysis:barMiners") },
					{ count: Object.keys(byers || {}).length, name: t("Feature:RobotAnalysis:byers") },
					{ count: Object.keys(fooMiners || {}).length, name: t("Feature:RobotAnalysis:fooMiners") },
					{ count: Object.keys(foobarEngineers || {}).length, name: t("Feature:RobotAnalysis:foobarEngineers") },
					{ count: Object.keys(iddleRobots || {}).length, name: t("Feature:RobotAnalysis:iddleRobots") },
				]),
				[barMiners, byers, fooMiners, foobarEngineers, iddleRobots, t],
			);

			return (
				<>
					<h3>{t("Feature:RobotAnalysis:title")}</h3>
					<ResponsiveContainer height={350} width={"100%"}>
						<BarChart
							data={data}
							margin={{
								bottom: 5,
								left: 20,
								right: 30,
								top: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis dataKey="count" domain={[0, 20]} />
							<Tooltip />
							<Legend />
							<Bar dataKey="count" fill="#8884d8" />
						</BarChart>
					</ResponsiveContainer>
				</>
			);
		},
	),
);

RobotAnalysis.displayName = "robotAnalysis";

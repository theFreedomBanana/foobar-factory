import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { createSelector } from "reselect";
import { Class } from "../../../Classes";
import { Store } from "../../../Store";

// #region TYPES
interface StockAnalysisProps {
	readonly barPerId?: { [index: string]: Class<"bar"> };
	readonly dispatch: Dispatch;
	readonly fooPerId?: { [index: string]: Class<"foo"> };
	readonly foobarPerId?: { [index: string]: Class<"foobar"> };
}
// #endregion

// #region CONNEXION
const selectFooPerId = createSelector(
	[(store) => store.record.foo],
	(fooPerId) => fooPerId,
);

const selectBarPerId = createSelector(
	[(store) => store.record.bar],
	(barPerId) => barPerId,
);

const selectFoobarPerId = createSelector(
	[(store) => store.record.foobar],
	(foobarPerId) => foobarPerId,
);

const mapStateToProps = (store: Store) => ({
	barPerId: selectBarPerId(store),
	fooPerId: selectFooPerId(store),
	foobarPerId: selectFoobarPerId(store),
});
// #endregion


// #region COMPONENT
export const StockAnalysis = connect(mapStateToProps)(
	memo(
		({ barPerId, fooPerId, foobarPerId }: StockAnalysisProps) => {
			const { t } = useTranslation();

			const data = useMemo(
				() => ([
					{ count: Object.keys(fooPerId || {}).length, name: t("Feature:StockAnalysis:foo") },
					{ count: Object.keys(barPerId || {}).length, name: t("Feature:StockAnalysis:bar") },
					{ count: Object.keys(foobarPerId || {}).length, name: t("Feature:StockAnalysis:foobar") },
				]),
				[barPerId, fooPerId, foobarPerId, t],
			);

			return (
				<>
					<h3>{t("Feature:StockAnalysis:title")}</h3>
					<ResponsiveContainer height={350} width={"100%"}>
						<BarChart
							height={250}
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
							<YAxis dataKey="count" domain={[0, 250]} />
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

StockAnalysis.displayName = "stockAnalysis";

import { createStyles, Grid, withStyles, WithStyles } from "@material-ui/core";
import React, { memo } from "react";
import { RobotManagment } from "../Features/RobotManagment";
import { Header } from "./Header";

const styles = () => createStyles({
	dashboard: { display: "flex", flexDirection: "column", height: "100vh" },
	dashboard__leftPanel: { borderRight: "1px solid black", padding: "1rem" },
	dashboard__section: { height: "inherit" },
});

// #region COMPONENT
export const Dasboard = withStyles(styles)(
	memo(
		({ classes }: WithStyles<typeof styles>) => (
			<div className={classes.dashboard}>
				<Header />
				<Grid className={classes.dashboard__section} container>
					<Grid className={classes.dashboard__leftPanel} item md={4}>
						<RobotManagment label="robotManagment" />
					</Grid>
					<Grid item md={8}>
					</Grid>
				</Grid>
			</div>
		),
	),
);
// #endregion

Dasboard.displayName = "dasboard";

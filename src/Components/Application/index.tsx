import { createStyles, withStyles, WithStyles } from "@material-ui/core";
import React, { memo } from "react";
import { Header } from "./Header";

const styles = () => createStyles({
	dashboard: { display: "flex", flexDirection: "column", height: "100vh" },
});

// #region COMPONENT
export const Dasboard = withStyles(styles)(
	memo(
		({ classes }: WithStyles<typeof styles>) => (
			<div className={classes.dashboard}>
				<Header />
			</div>
		),
	),
);
// #endregion

Dasboard.displayName = "dasboard";

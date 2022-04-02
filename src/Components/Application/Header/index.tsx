import { createStyles, withStyles, WithStyles } from "@material-ui/core";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

const styles = () => createStyles({
	header__container: { borderBottom: "1px solid black", padding: "1rem", textAlign: "center" },
	header__title: { margin: 0 },
});

export const Header = withStyles(styles)(
	memo(
		({ classes }: WithStyles<typeof styles>) => {
			const { t } = useTranslation();

			return (
				<div className={classes.header__container}>
					<h1 className={classes.header__title}>{t("Application:Header:title")}</h1>
				</div>
			);
		},
	),
);

Header.displayName = "header";

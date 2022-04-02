import { Button, createStyles, FormControl, Grid, InputLabel, MenuItem, Select, withStyles, WithStyles } from "@material-ui/core";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Field, Form, InjectedFormProps, reduxForm, WrappedFieldInputProps } from "redux-form";
import { Tasks } from "../../../Classes/Robot";

// #region TYPES
export interface FormValue {
	/**
	 * The task to assign to the robot
	 */
	readonly destinationTask?: Tasks;
	/**
	 * The initial robot task
	 */
	readonly initialTask?: Tasks;
}

interface ManagmentFormProps {
	/**
	 * An object where each key reprensents a robot task, and where each value is true
	 * if there are robots assigned to this task, false otherwise
	 */
	readonly enabledOptionsForInitialTask: {
		readonly assembleFoobar: boolean;
		readonly buyRobot: boolean;
		readonly mineBar: boolean;
		readonly mineFoo: boolean;
		readonly none: boolean;
	}
}
// #endregion

const styles = () => createStyles({
	managmentForm__container: { width: "100%" },
	managmentForm__selectContainer: { marginBottom: "1rem" },
});

// #region COMPONENT
export const ManagmentForm = reduxForm<FormValue, ManagmentFormProps>({})(
	withStyles(styles)(
		memo(
			({
				classes,
				enabledOptionsForInitialTask,
				handleSubmit,
				invalid,
			}: InjectedFormProps<FormValue, ManagmentFormProps> & ManagmentFormProps & WithStyles<typeof styles>) => {
				const { t } = useTranslation();

				return (
					<Form onSubmit={handleSubmit}>
						<Grid className={classes.managmentForm__container} container>
							<Grid className={classes.managmentForm__selectContainer} item xs={12}>
								<FormControl fullWidth>
									<InputLabel id="initialTask-label" variant="outlined">
										{t("Feature:RobotManagment:initialTaskLabel")}
									</InputLabel>
									<Field
										component={({ input }: { input: WrappedFieldInputProps }) => (
											<Select
												fullWidth={true}
												labelId="initialTask-label"
												onChange={input.onChange}
												value={input.value}
											>
												{Object.values(Tasks).map((task) => (
													<MenuItem
														disabled={!enabledOptionsForInitialTask[task]}
														key={task}
														value={task}
													>
														{task}
													</MenuItem>
												))}
											</Select>
										)}
										name="initialTask"
									/>
								</FormControl>
							</Grid>
							<Grid className={classes.managmentForm__selectContainer} item xs={12}>
								<FormControl fullWidth>
									<InputLabel id="destinationTask-label" variant="outlined">
										{t("Feature:RobotManagment:destinationTaskLabel")}
									</InputLabel>
									<Field
										component={({ input }: { input: WrappedFieldInputProps }) => (
											<Select
												fullWidth={true}
												labelId="destinationTask-label"
												onChange={input.onChange}
												value={input.value}
											>
												{Object.values(Tasks).map((task) => (
													<MenuItem key={task} value={task}>{task}</MenuItem>
												))}
											</Select>
										)}
										name="destinationTask"
									/>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<Button disabled={invalid} type="submit" variant="contained">
									{t("Feature:RobotManagment:validate")}
								</Button>
							</Grid>
						</Grid>
					</Form>
				);
			},
		),
	),
);
// #endregion


import { Class } from "../index";

/**
 * A Robot represents a worker assigned to a specific task.
 */
export interface Robot extends Class<"robot"> {
	/**
	 * The task the robot is assigned;
	 */
	currentTask: Tasks;
}

/**
 * A list of possible tasks for a robot
 */
export enum Tasks {
	MINE_FOO = "mineFoo",
	MINE_BAR = "mineBar",
	ASSEMBLE_FOOBAR = "assembleFoobar",
	BUY_ROBOT = "buyRobot",
	NONE = "none",
}

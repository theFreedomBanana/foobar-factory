import { ClassEnumeration } from "../../Classes";

export type RecordState = {
	readonly [key in keyof ClassEnumeration]?: {
		[id: string]: ClassEnumeration[key];
	};
};

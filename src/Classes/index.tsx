import { Robot } from "./Robot";

export interface Class<Name = string> {
	/**
	 * The name of the class
	 */
	class: Name;
	/**
	 * A unique identifier for the instance
	 */
	id: string;
}

/**
 * The class enumeration is the complete list of classes, gathered by name.
 */
export interface ClassEnumeration {
	bar: Class<"bar">;
	foo: Class<"foo">;
	foobar: Class<"foobar">;
	robot: Robot;
}

/**
 * A utility to type as any value of an interface T
 */
export type ValueOf<T> = T[keyof T];

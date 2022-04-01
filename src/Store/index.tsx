import { FeatureState } from "./Feature";
import { RecordState } from "./Record";

export interface Store {
	readonly feature: FeatureState;
	readonly record: RecordState;
}

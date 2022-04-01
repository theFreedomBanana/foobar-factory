import { CssBaseline } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import logger from "redux-logger";
import { Provider as StoreProvider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { v4 as uuidv4 } from "uuid";
import createSagaMiddleware from "redux-saga";
import { feature as featureReducer } from "./Store/Feature/reducers";
import { record as recordReducer } from "./Store/Record/reducers";
import { Robot, Tasks } from "./Classes/Robot";
import { Factory } from "./Components/Application";
import { sagasForFactory } from "./Store/sagas";

const ROBOTS: Robot[] = new Array(2).fill({ class: "robot" }).map((robot) => ({
	...robot,
	currentTask: Tasks.NONE,
	id: uuidv4(),
}));

const EMPTY_DATA_STATE = {
	bar: {},
	foo: {},
	robot: ROBOTS.reduce(
		(reduction: { [index: string]: Robot }, robot) => ({
			...reduction,
			[robot.id]: robot,
		}),
		{},
	),
};
const EMPTY_FEATURE_STATE = {
	factory: {
		intervalPerBarMinersId: {},
		intervalPerByersId: {},
		intervalPerFooMinersId: {},
		intervalPerFoobarEngineersId: {},
	},
};
const sagaMiddleware = createSagaMiddleware();
const middlewares = [];
middlewares.push(sagaMiddleware);
if (process.env.NODE_ENV === "development") {
	middlewares.push(logger);
}

const store = createStore(
	combineReducers({
		feature: featureReducer(EMPTY_FEATURE_STATE),
		record: recordReducer(EMPTY_DATA_STATE),
	}),
	applyMiddleware(...middlewares),
);

sagaMiddleware.run(sagasForFactory);

const App = () => (
	<StoreProvider store={store}>
		<CssBaseline />
		<Factory label="factory" />
	</StoreProvider>
);

ReactDOM.render(
	<App />,
	document.getElementById("root"),
);

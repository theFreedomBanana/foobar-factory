import { CssBaseline } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import i18n from "i18next";
import logger from "redux-logger";
import { Provider as StoreProvider } from "react-redux";
import { initReactI18next } from "react-i18next";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { reducer as formReducer } from "redux-form";
import createSagaMiddleware from "redux-saga";
import { v4 as uuidv4 } from "uuid";
import enTranslations from "../res/translations/en.json";
import { feature as featureReducer } from "./Store/Feature/reducers";
import { record as recordReducer } from "./Store/Record/reducers";
import { Robot, Tasks } from "./Classes/Robot";
import { Dasboard } from "./Components/Application";
import { Factory } from "./Components/Features/Factory";
import { sagasForFactory } from "./Store/sagas";

const ROBOTS: Robot[] = new Array(2).fill({ class: "robot" }).map((robot) => ({
	...robot,
	currentTask: Tasks.NONE,
	id: uuidv4(),
	transiting: false,
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
	factory: {},
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
		form: formReducer,
		record: recordReducer(EMPTY_DATA_STATE),
	}),
	applyMiddleware(...middlewares),
);

sagaMiddleware.run(sagasForFactory);

const App = () => (
	<StoreProvider store={store}>
		<CssBaseline />
		<Factory label="factory" />
		<Dasboard />
	</StoreProvider>
);

i18n.use(initReactI18next).init({
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
	lng: "en",
	resources: {
		en: enTranslations,
	},
}).then(() => {
	ReactDOM.render(
		<App />,
		document.getElementById("root"),
	);
});


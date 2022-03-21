
const HTMLWebpackPlugin = require("html-webpack-plugin");
const Webpack = require("webpack");

module.exports = (env) => {
	const APPLICATION_ROOT_PATH = `/${env && env.APPLICATION_ROOT_PATH || "/"}`;

	return {
		/**
		 * Provides webpack-dev-server configuration.
		 */
		devServer: {
			client: {
				/**
				 * Displays compiler errors in the browser.
				 */
				overlay: true,
				/**
				 * Prints compilation progress in percentage in the browser.
				 */
				progress: true,
			},
			/**
			 * Serves root path in place of any 404 responses when using the HTML5 History API.
			 */
			historyApiFallback: true,
			/**
			 * Enables Hot Module Replacement.
			 */
			hot: true,
		},
		/**
		 * Defines how source maps are generated.
		 */
		devtool: "inline-source-map",
		/**
		 * Defines which module webpack should use to start building dependency graph.
		 */
		entry: [
			"react-hot-loader/patch",
			"url-search-params-polyfill",
			"./src/index.tsx",
		],
		/**
		 * Defines which mode Webpack is on.
		 */
		mode: "development",
		/**
		 * Defines how webpack will process each type of file.
		 */
		module: {
			/**
			 * Provides a list of rules for each type of file.
			 */
			rules: [
				{
					exclude: /node_modules/,
					test: /\.(js|jsx|ts|tsx)?$/,
					use: {
						loader: "ts-loader",
					},
				},
				// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
				{
					enforce: "pre",
					exclude: /node_modules/,
					loader: "source-map-loader",
					test: /\.js$/,
				},
				{
					exclude: /node_modules/,
					loader: "svg-react-loader",
					test: /\.svg$/,
				},
				{
					test: /\.(gif|jpg|png)$/i,
					type: "asset/resource",
				},
				{
					test: /\.(eot|otf|ttf|woff|woff2)$/,
					type: "asset/resource",
				},
				{
					test: /\.css$/i,
					use: ["style-loader", "css-loader"],
				},
			],
		},
		/**
		 * Tells how webpack will emit bundles.
		 */
		optimization: {
			/**
			 * Displays hot replaced module's name in console.
			 */
			moduleIds: "named",
		},
		/**
		 * Provides webpack a list of plugins to use.
		 */
		plugins: [
			/**
			 * Creates global constants resolved at compile time.
			 */
			new Webpack.DefinePlugin({
				"process.env": {
					APPLICATION_ROOT_PATH: JSON.stringify(APPLICATION_ROOT_PATH),
					NODE_ENV: JSON.stringify("development"),
					PLATFORM_ENV: JSON.stringify("web"),
				},
			}),
			// /**
			//  * Creates an index.html file on the fly using the provided file as template.
			//  * It adds <link> and <script> tags for every created depency.
			//  */
			new HTMLWebpackPlugin({ template: "./src/index.html" }),
		],
		/**
		 * Defines how Webpack will resolve imported modules.
		 */
		resolve: {
			/**
			 * Provides a list of extensions to resolve.
			 */
			extensions: [
				".eot",
				".jpg",
				".js",
				".jsx",
				".gif",
				".otf",
				".png",
				".svg",
				".ts",
				".tsx",
				".ttf",
				".woff",
				".woff2",
			],
			fallback: { "util": require.resolve("util/") },
		},
	};
};

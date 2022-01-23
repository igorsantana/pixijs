const path = require("path");
const merge = require("webpack-merge").default;
const common = require("./webpack.common.js");

module.exports = merge(common, {
	devtool: "inline-source-map",
	mode: "none",
	devServer: {
		static: path.join(__dirname, "src"),
		port: 8080,
		host: "0.0.0.0",
		hot: true,
	},
});

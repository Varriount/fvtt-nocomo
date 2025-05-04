const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsMacros = require("ts-macros").default;

// Constants for commonly used values
const SOURCE_DIR = "src";
const DIST_DIR = "dist";
const BUILD_DIR = "build";

const INDEX_TS_FILENAME = "index.ts";
const INDEX_HTML_FILENAME = "index.html";
const OUTPUT_FILENAME = "bundle.js";

const SOURCE_MAP = "eval-cheap-module-source-map";

// Base config that applies to either development or production mode.
const BASE_CONFIG = {
  entry: `./${SOURCE_DIR}/${INDEX_TS_FILENAME}`,
  output: {
    // Compile the source files into a bundle.
    filename: OUTPUT_FILENAME,
    path: path.resolve(__dirname, DIST_DIR),
    clean: true,
  },

  // Enable webpack-dev-server to get hot refresh of the app.
  devServer: {
    static: `./${BUILD_DIR}`,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          getCustomTransformers: program => ({
            before: [TsMacros(program)],
          }),
        },
      },
      {
        // Load CSS files. They can be imported into JS files.
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  plugins: [
    // Generate the HTML index page based on our template.
    // This will output the same index page with the bundle we
    // created above added in a script tag.
    new HtmlWebpackPlugin({
      template: `${SOURCE_DIR}/${INDEX_HTML_FILENAME}`,
    }),
  ],
};

// Development-specific configuration additions
const DEV_CONFIG = {
  ...BASE_CONFIG,

  devtool: SOURCE_MAP,
  ignoreWarnings: [/Failed to parse source map.*blockly/],
  output: {
    ...BASE_CONFIG.output,
    path: path.resolve(__dirname, BUILD_DIR),
  },
  module: {
    ...BASE_CONFIG.module,
    rules: [
      ...BASE_CONFIG.module.rules,
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
};

module.exports = (env, argv) => {
  let result = {};

  if (argv.mode === "development") {
    return DEV_CONFIG;
  } else {
    return BASE_CONFIG;
  }
};

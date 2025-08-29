import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsMacrosModule from "ts-macros";

// @ts-ignore
const TsMacros = TsMacrosModule["default"];

// Constants for commonly used values
const SOURCE_DIR = "src";
const DIST_DIR = "dist";
const BUILD_DIR = "build";

const INDEX_TS_FILENAME = "index.ts";
const INDEX_HTML_FILENAME = "index.html";
const OUTPUT_FILENAME = "bundle.js";

const SOURCE_MAP = "eval-source-map";

// Base config that applies to either development or production mode.
const BASE_CONFIG = {
  entry: `./${SOURCE_DIR}/${INDEX_TS_FILENAME}`,
  output: {
    // Compile the source files into a bundle.
    filename: OUTPUT_FILENAME,
    path: path.resolve("./", DIST_DIR),
    clean: true,
  },

  // Enable webpack-dev-server to get hot refresh of the app.
  devServer: {
    static: `./${BUILD_DIR}`,
  },

  module: {
    rules: [
      // Rule for TypeScript files.
      {
        test: /[.](ts|tsx)$/u,
        loader: "ts-loader",
        exclude: /node_modules/u,
        options: {
          getCustomTransformers: (program: any) => ({
            before: [TsMacros(program)],
          }),
        },
      },

      // Rule for YAML files.
      {
        test: /[.](yaml|yml)$/u,
        use: "yaml-loader",
      },

      {
        // Rule for CSS files.
        test: /[.]css$/u,
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
  ignoreWarnings: [/Failed to parse source map.*blockly/u],
  output: {
    ...BASE_CONFIG.output,
    path: path.resolve("./", BUILD_DIR),
  },
  module: {
    ...BASE_CONFIG.module,
    rules: [
      ...BASE_CONFIG.module.rules,
      {
        test: /\.js$/u,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
};

export default (env: any, argv: { mode: string }) => {
  if (argv.mode === "development") {
    return DEV_CONFIG;
  } else {
    return BASE_CONFIG;
  }
};

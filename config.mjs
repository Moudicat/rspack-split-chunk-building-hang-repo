import path from "path";
import {rspack} from '@rspack/core';
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { VueLoaderPlugin } from "vue-loader";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error("Unknown bundler");
}

const DEPENDENCY_MATCH_TEMPL = /[\\/]node_modules[\\/](<SOURCES>)[\\/]/.source;

const createDependenciesRegExp = (
  ...dependencies
) => {
  const sources = dependencies.map((d) =>
    typeof d === 'string' ? d : d.source,
  );
  const expr = DEPENDENCY_MATCH_TEMPL.replace('<SOURCES>', sources.join('|'));
  return new RegExp(expr);
};


/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/main.js",
  },
  optimization: {
		minimize: false,
		splitChunks: {
			chunks: 'all',
			minSize: 0,
			maxSize: 100000,
		}
	},
  plugins: [new VueLoaderPlugin(), isRunningRspack ? new rspack.HtmlRspackPlugin() : new HtmlWebpackPlugin()],
  output: {
    clean: true,
    path: isRunningWebpack
      ? path.resolve(__dirname, "webpack-dist")
      : path.resolve(__dirname, "rspack-dist"),
    filename: "[name].js",
  },
  experiments: {
    css: true,
    ...isRunningRspack
      ? {
        rspackFuture: {
          newTreeshaking: true
        },
      } : {}
  },
  module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					experimentalInlineMatchResource: true
				}
			},
			{
				test: /\.(js|ts)$/,
				use: [
					{
						loader: isRunningRspack ? "builtin:swc-loader" : 'babel-loader',
						options: isRunningRspack ? {
							sourceMap: false,
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: false
								}
							},
							env: {
								targets: [
									"chrome >= 87",
									"edge >= 88",
									"firefox >= 78",
									"safari >= 14"
								]
							}
						}: {}
					}
				]
			},
			{
				test: /\.svg/,
				type: "asset/resource"
			}
		]
	}
};

export default config;

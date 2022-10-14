const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const env = process.env.NODE_ENV || process.argv[3] || "production";
const isProduction = env === "production";
const isTest = env === "test";
const sourcePath = path.join(__dirname, "src");
const testPath = path.join(__dirname, "test");
const modulePath = path.join(__dirname, "node_modules");

module.exports = {
  context: __dirname,
  entry: path.resolve(sourcePath, "index.ts"),
  output: {
    filename: isProduction ? "[name].[contenthash].js" : "[name].js",
    assetModuleFilename: isProduction
      ? "assets/[name].[contenthash].[ext][query]"
      : "assets/[name].[ext][query]",
    clean: true,
  },
  mode: isProduction ? "production" : "development",
  target: isTest ? "node" : "web",
  resolve: {
    extensions: [".js", ".ts", ".css", ".scss"],
    modules: [sourcePath, testPath, modulePath],
    alias: {
      "@": sourcePath,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: [
          {
            loader: "swc-loader",
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: !isProduction,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: !isProduction,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        type: "asset/inline",
      },
      {
        test: /\.(a?png|jpe?g|gif)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isProduction ? "[name].[contenthash].css" : "[name].css",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(sourcePath, "index.html"),
      inject: true,
    }),
  ],
  devtool: isProduction ? false : "inline-cheap-module-source-map",
  optimization: {
    minimize: isProduction,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          compress: {
            unsafe: true,
          },
          mangle: {
            properties: true,
          },
        },
      }),
    ],
  },
};

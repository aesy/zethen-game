import { pluginTypedCSSModules } from "@rsbuild/plugin-typed-css-modules";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginImageCompress } from "@rsbuild/plugin-image-compress";
import { defineConfig } from "@rsbuild/core";

const isDev = process.env["NODE_ENV"] !== "production";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  dev: {
    lazyCompilation: true,
  },
  html: {
    inject: "body",
    title: "Zethen",
    template: "src/index.html",
  },
  output: {
    assetPrefix: "./",
    cssModules: {
      exportLocalsConvention: "camelCaseOnly",
      mode: "pure",
      namedExport: true,
    },
    polyfill: "usage",
    sourceMap: {
      js: isDev ? "cheap-module-source-map" : false,
      css: isDev,
    },
  },
  performance: {
    chunkSplit: {
      strategy: "all-in-one",
    },
    removeConsole: true,
  },
  plugins: [
    pluginSass(),
    pluginImageCompress(),
    pluginTypeCheck(),
    pluginTypedCSSModules(),
  ],
});

const path = require("path");
const webpack = require("webpack");
// const { castToSass } = require("node-sass-utils");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");



function custom_hash(){
  return (+new Date()).toString(36).concat(Math.round(Math.random() * 1000).toString());
}
module.exports = (env,args)=> {
  const mode = args.mode || "production";
  const dynamicPrefix = (mode === 'production')?
          custom_hash(): 'dev_prefix0123';
  return {
    mode: mode,
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    watchOptions: {
      poll: 1000,
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.dynamic": JSON.stringify(dynamicPrefix),
      }),
      new ImageminWebpWebpackPlugin({
        detailedLogs: true,
        overrideExtension: true,
        config: [
          {
            test: /\.(jpe?g|png|gif)/,
            options: {
              quality: 75,
            },
          },
        ],
      }),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".mjs"],
      fullySpecified: false,
      plugins: [new TsconfigPathsPlugin()],
      alias: {
        node_modules: path.resolve(__dirname, "node_modules"),
        sass: path.resolve(__dirname, "src/sass/"),
        sass_setings: path.resolve(__dirname, "src/sass/setings/"),
        sass_builders: path.resolve(__dirname, "src/sass/core/builders/"),
        sass_functions: path.resolve(__dirname, "src/sass/core/functions/"),
        sass_mixins: path.resolve(__dirname, "src/sass/core/mixins/"),
      },
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false, // Agrega esta opción para permitir módulos parcialmente especificados
          },
          use: {
            loader: "ts-loader",
          },
        },

        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },

        {
          test: /\.html$/i,
          loader: "html-loader",
          options: {
            minimize: true,
            esModule: true,
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.s(c|a)ss$/,
          use: [
            // {
            //   loader: "lit-scss-loader",
            //   options: {
            //     minify: true,
            //   },
            // },
            // "extract-loader",
            "to-string-loader",
            {
              loader: "css-loader",
              options: {
                esModule: false,
              },
            },
            // "sass-loader",
            {
              loader: "sass-loader",
              options: {
                additionalData: `$dymanic: '${dynamicPrefix}';`,
                sourceMap: false,
                // esModule: false,
                sassOptions: {
                  outputStyle: "compressed",
                },
                implementation: require("sass"),
              },
            },
          ],
        },
        {
          test: /\.(webp|jpeg|jpg|png|gif|svg)$/i,
          type: "asset/inline",
        },
      ],
    },

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "calculadora_ahorro.js",
      clean: true,
    },
    stats: {
      loggingDebug: ["sass-loader"],
    },
  };
};

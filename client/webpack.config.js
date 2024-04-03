const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");
const HotModuleReplacementPlugin =
  require("webpack").HotModuleReplacementPlugin;

module.exports = () => {
  return {
    mode: "development",
    //Entry points for the application
    entry: {
      bundle: "./src/js/index.js",
      install: "./src/js/install.js",
    },
    //Output for the application
    output: {
      filename: "[name][contenthash].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      assetModuleFilename: "[name][ext]",
    },
    devtool: "source-map",
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      port: 9000,
      open: true,
      hot: "only",
      // hot: true,
      compress: true,
      historyApiFallback: true,
    },
    module: {
      rules: [
        //CSS loaders
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        
        //image loaders
        {
          test: /\.(png|svg|jpe?g|gif)$/i,
          type: "asset/resource",
        },

        //Babel loader to transpile ES6 to ES5
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-transform-object-rest-spread",
                "@babel/transform-runtime",
              ],
            },
          },
        },
      ],
    },
    plugins: [
      //automatically let modules to be updated at runtime without the need to refresh the page
      new HotModuleReplacementPlugin(),
      //generates an HTML file for the application and injects the bundles
      new HtmlWebpackPlugin({
        filename: "index.html",
        title: "J.A.T.E.",
        template: "./template.html",
      }),
      //generates a service worker file for the application
      new InjectManifest({
        swSrc: "./src-sw.js",
        swDest: "dest-sw.js",
      }),
      //generates a manifest file for the application
      new WebpackPwaManifest({
        name: "Just Another Text Editor",
        short_name: "J.A.T.E",
        description:
          "A simple text editor to create notes or code snippets with or without an internet connection",
        display: "standalone",
        orientation: "any",
        background_color: "#f3e9d2",
        theme_color: "#225ca3",
        start_url: "./",
        publicPath: "./",
        id: "/",
        fingerprints: false,
        icons: [
          {
            src: path.resolve("src/images/logo.png"),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join("assets", "icons"),
          },
        ],
        screenshots: [
          {
            src: "./screenshot.png",
            sizes: "636x617",
            type: "image/png",
            form_factor: "wide",
            label: "JATE",
          },
          {
            src: "./screenshot.png",
            sizes: "636x617",
            type: "image/png",
            form_factor: "narrow",
            label: "JATE",
          },
        ],
        display_override: ["window-controls-overlay"],
        /*
        protocol_handlers: [
          {
            protocol: "",
            url: "/",
          }
        ],
        */
      }),
    ],
  };
};

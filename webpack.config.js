const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// For a basic configuration, we need to provide webpack with three properties: entry, output, and mode. The first thing we want to declare is the entry property.
module.exports = {
  // The entry point is the root of the bundle and the beginning of the dependency graph, so give it the relative path to the client's code.
  entry: {
    app: "./assets/js/script.js",
    events: "./assets/js/events.js",
    schedule: "./assets/js/schedule.js",
    tickets: "./assets/js/tickets.js",
  },
  // webpack will next take the entry point we have provided, bundle that code, and output that bundled code to a folder that we specify. It is common and best practice to put your bundled code into a folder named dist, which is short for distribution.
  output: {
    filename: "[name].bundle.js",
    path: __dirname + "/dist",
  },
  // We added an object to the rules array. This object will identify the type of files to pre-process using the test property to find a regular expression, or regex. In our case, we are trying to process any image file with the file extension of .jpg. We could expand this expression to also search for other image file extensions such as .png, .svg, or .gif.
  module: {
    rules: [
      {
        test: /\.jpg$/i,
        use: [
          {
            loader: "file-loader",
            // We added an options object below the loader assignment that contains a name function, which returns the name of the file with the file extension.
            options: {
              esModule: false,
              name(file) {
                return "[path][name].[ext]";
              },
              // Below that is the publicPath property, which is also a function that changes our assignment URL by replacing the ../ from our require() statement with /assets/.
              publicPath: function (url) {
                return url.replace("../", "/assets/");
              },
            },
          },
          // The last step will be to use a image optimizer loader, because file-loader only emitted our images without reducing the size. We can use a package from npm called image-webpack-loader to do that. Make sure we keep track of the loader dependencies and ensure that file-loader processes the images first so that image-webpack-loader can optimize the emitted files.
          {
            loader: "image-webpack-loader",
          },
        ],
      },
    ],
  },
  // Plugins play an important role in directing webpack what to do. Like all directions we've given webpack so far, we'll add the plugins to the webpack.config.js file. Inside the array, we need to tell webpack which plugin we want to use. We're going to use the providePlugin plugin to define the $ and jQuery variables to use the installed npm package. If we did not do this, the code would still not work even though we installed jQuery. Whenever you work with libraries that are dependent on the use of a global variable, just like jQuery is with $ and jQuery, you must tell webpack to make exceptions for these variables by using webpack.ProvidePlugin
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new BundleAnalyzerPlugin({
      // We configured the analyzerMode property with a static value. This will output an HTML file called report.html that will generate in the dist folder. We can also set this value to disable to temporarily stop the reporting and automatic opening of this report in the browser.
      analyzerMode: "static", // the report outputs to an HTML file in the dist folder
    }),
  ],
  // The final piece of our basic setup will provide the mode in which we want webpack to run. By default, webpack wants to run in production mode. In this mode, webpack will minify our code for us automatically, along with some other nice additions. We want our code to run in development mode.
  mode: "development",
};

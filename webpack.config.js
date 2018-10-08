const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  entry: {
    background: './src/Background/background.js',
    content: './src/Content/content.js',
    View: './src/View/View.js'
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/manifest.json' },
      {
        from: './src/res',
        to: './res'
      },
      {
        from: './src/fonts',
        to: './fonts'
      },
      { from: './src/View/frame.html' },
      { from: './src/View/style.css' }
    ])
  ],
  devtool: "source-map",
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        loader: "babel-loader",
        options: {
          presets: ["env"]
        }
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.(?:png|gif|jpg|svg|woff|woff2|ttf)$/,
        loader: 'file-loader?name=res/[name].[ext]'
      }
    ]
  }
};

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: './src/background.js',
    content: './src/content.js'
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
      { from: 'src/manifest.json' }
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

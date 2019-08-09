const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackTemplate = require('html-webpack-template');

module.exports = {
  entry: './swagger/index.js',
  output: {
    path: path.resolve(__dirname, '.swagger-dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|gif|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Plinc Swagger API',
      template: htmlWebpackTemplate,
      inject: false,
      bodyHtmlSnippet: '<div id="app"></div>',
    }),
  ],
};

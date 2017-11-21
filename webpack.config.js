const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

function generateHtmlPlugins (templateDir) {
  // Read files in tempalte directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));

  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.'),
          name = parts[0],
          extension = parts[1];

    // Create new HtmlWebpackPlugin with options
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
    });
  });
}

const htmlPlugins = generateHtmlPlugins('./source/templates/views');

module.exports = {
  entry: ['./source/scripts/app.js', './source/scss/main.scss'],
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        }
      },
      { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /\.njk$/,
        use: [{
          loader: 'nunjucks-isomorphic-loader',
          query: {
            root: [path.resolve(__dirname, 'source/templates')]
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin({ // define where to save the file
      filename: (getPath) => {
        return getPath('css/styles.bundle.css');
      },
      allChunks: true
    })
  ]
  .concat(htmlPlugins),
  output: {
    filename: 'scripts.bundle.js',
    path: path.resolve(__dirname, 'dist/')
  },
  stats: {
    colors: true
  }
};
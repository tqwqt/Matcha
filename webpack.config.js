module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  module: {
      rules: [
          {
            test: /\.json$/,
            loader: 'json-loader'
          },
          {
              test: /\.js$/,
              loader: 'babel-loader'
          },
          {
              test: /\.css$/,
              loaders: [ 'style-loader', 'css-loader' ]
          }
        ]
  }
};

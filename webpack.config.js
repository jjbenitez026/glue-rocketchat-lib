const path = require('path');

module.exports = {
  watch: true,
  entry: './src/index.ts',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'bundle',
    libraryTarget: 'window',
    libraryExport: 'default'
  },
};

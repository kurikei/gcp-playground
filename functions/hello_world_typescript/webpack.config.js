module.exports = {
  entry: "./src/index.ts",
  target: 'node',
  output: {
    path: __dirname,
    filename: 'index.js',
    libraryTarget: 'this'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.json' ]
  }
}

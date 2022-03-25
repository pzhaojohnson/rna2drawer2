const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  plugins: [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      Array: path.resolve(__dirname, 'src/array/'),
      Draw: path.resolve(__dirname, 'src/draw/'),
      Export: path.resolve(__dirname, 'src/export/'),
      Forms: path.resolve(__dirname, 'src/forms/'),
      History: path.resolve(__dirname, 'src/history/'),
      Infobar: path.resolve(__dirname, 'src/infobar/'),
      Math: path.resolve(__dirname, 'src/math/'),
      Menu: path.resolve(__dirname, 'src/menu/'),
      Parse: path.resolve(__dirname, 'src/parse/'),
      Partners: path.resolve(__dirname, 'src/partners/'),
      Undo: path.resolve(__dirname, 'src/undo/'),
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      App$: path.resolve(__dirname, 'src/App.tsx'),
      FormContainer$: path.resolve(__dirname, 'src/FormContainer.ts'),
      Preferences$: path.resolve(__dirname, 'src/Preferences.ts'),
    },
    modules: ['node_modules'],
    extensions: [ '.tsx', '.ts', '.js' ]
  }
}

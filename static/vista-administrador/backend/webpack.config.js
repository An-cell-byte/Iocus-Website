const path = require('path');

module.exports = {
  entry: './src/index.js', // Cambia esto según tu estructura de archivos
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Asegúrate de tener babel-loader si lo necesitas
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  devtool: 'source-map', // Solo en desarrollo, si lo necesitas
};

// webpack.config.js
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // You likely have this already
require('dotenv').config(); // <--- Load .env variables

module.exports = (env, argv) => { // Use function form to access mode
  const isProduction = argv.mode === 'production';

  console.log('Webpack Mode:', argv.mode); // For debugging
  console.log('API Base URL from env:', process.env.REACT_APP_API_BASE_URL); // Check if loaded

  return {
    mode: argv.mode || 'development', // Set mode based on script
    entry: './src/index.tsx', // Your entry point
    output: {
      path: path.resolve(__dirname, 'build'), // Or 'dist'
      filename: 'bundle.[contenthash].js', // Add hash for production
      publicPath: '/', // Important for routing and dev server
      clean: true, // Clean output directory before build
    },
    module: {
      rules: [
        // --- TypeScript Loader ---
        {
          test: /\.tsx?$/,
          use: 'babel-loader', // Make sure you have ts-loader installed
          exclude: /node_modules/,
        },
        // --- CSS Loaders (Example) ---
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'], // Add loaders for CSS if needed
        },
        // --- Image/Asset Loaders (Example) ---
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', ".jsx"], // Allow importing without extension
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html', // Your HTML template
      }),
      // --- DefinePlugin to inject environment variables ---
      new webpack.DefinePlugin({
        // Stringify values! Important!
        'process.env': JSON.stringify({
            NODE_ENV: argv.mode || 'development',
            REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
        // Define other variables as needed
      }),
    })
      // Add other plugins (like MiniCssExtractPlugin for production CSS)
    ],
    devtool: isProduction ? 'source-map' : 'eval-source-map', // Source maps
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'), // Serve static files from public
      },
      compress: true,
      port: 3000, // Or your preferred port
      open: true, // Corresponds to --open flag
      hot: true, // Enable Hot Module Replacement
      historyApiFallback: true, // Crucial for single-page app routing
      // Add proxy configuration if needed (instead of CORS on backend)
      // proxy: {
      //   '/api': {
      //     target: process.env.REACT_APP_API_BASE_URL, // Your backend server
      //     changeOrigin: true,
      //     secure: false, // If backend is http
      //   },
      // },
    },
    performance: {
        hints: isProduction ? 'warning' : false // Show hints in production
    }
  };
};
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')

module.exports = {
    // target: 'electron-main',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    entry: {
        main: './frontend/index.js'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "./frontend/index.html",
            filename: "./index.html"
        }),
        new CleanWebpackPlugin(),
    ]
}
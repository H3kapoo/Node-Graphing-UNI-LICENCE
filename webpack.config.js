const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // target: 'electron-main',

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
        new CleanWebpackPlugin(['app/**/*.js', 'build/**/*.*'],
            {
                root: path.resolve('.'),
                verbose: true,
                dry: false
            })
    ]
}
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {HotModuleReplacementPlugin} = require('webpack')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    // 'production' | 'development' | 'none'
    mode: 'development',
    // 控制是否生成，以及如何生成 source map。
    devtool: 'eval-cheap-module-source-map',
    // 入口
    entry: {
        index: './src/main.ts',
    },
    // 出口
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    // 设置模块如何被解析
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension and parsing moudle in order
        // so can ignore suffix when import a module, such as: import File from '../path/to/file
        extensions: [".ts", ".tsx", ".js"]
    },
    // 模块化。[loaders](https://webpack.docschina.org/loaders/)
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['ts-loader'],
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { modules: false }]
                        ]
                    }
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        esModule: true,
                    }
                },
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader",
                        options: {
                            injectType: 'linkTag'
                        }
                    },
                    'css-loader',
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: "style-loader",
                        options: {
                            injectType: 'linkTag'
                        }
                    },
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif|webp)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5 * 1024, // 5k
                        fallcall: require.resolve('file-loader'),
                    }
                }
            },
        ]
    },
    // for webpack-dev-server
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000,
        compress: true,
        hotOnly: false,
        // reload auto
        watchContentBase: true,
        hot: false,
        liveReload: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/pages/template.ejs',
            templateParameters: {
                pageTitle: 'pageTitle',
            },
            minify: false,
            cache: true,
            showErrors: true,
        }),
        new HotModuleReplacementPlugin(),
    ],
    // 优化项
    optimization: {
        usedExports: true, // 标记无用代码
        minimize: true, // 清除无用代码
    }
};
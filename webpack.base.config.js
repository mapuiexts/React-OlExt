
module.exports = {
    devtool: 'eval-source-map', //https://stackoverflow.com/questions/61767538/devtools-failed-to-load-sourcemap-for-webpack-node-modules-js-map-http-e
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json' ],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, 
            //enable if using craco/less
            // {
            //     test: /\.less$/,
            //     use: [
            //     'style-loader',
            //     'css-loader',
            //     {
            //         loader: 'less-loader',
            //         options: {
            //         lessOptions: {
            //             javascriptEnabled: true
            //         }
            //         }
            //     }
            //     ]
            // }, 
            {
                test: /\.(ttf|eot|svg|kml)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset/resource'
            }
        ]
    }
};
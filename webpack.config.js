const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const merge = require('webpack-merge');

var apiHost = "";
var clientId = "NKRPrototype";
var clientSecret = "NKRPrototype!987123";

const setup = (env) => {
    if (env) {
        switch (true) {
            case env.prod:
                break;

            default:
                apiHost = "http://localhost:53869/api"
                break;
        }
    } else {
        apiHost = "http://localhost:53869/api"
    }
}

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    setup(env);

    // Configuration in common to both client-side and server-side bundles
    const sharedConfig = () => ({
        stats: { modules: false },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            filename: '[name].js',
            publicPath: 'dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                { test: /\.tsx?$/, include: /ClientApp/, use: 'awesome-typescript-loader?silent=true' },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
        plugins: [new CheckerPlugin()],
        // resolve: {
        //     root: path.resolve(__dirname),
        //     alias: {
        //         react: path.resolve(__dirname, 'node_modules/react')
        //     }
        // }

    });

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig(), {
        entry: { 'main-client': './ClientApp/boot-client.tsx' },
        module: {
            rules: [
                { test: /\.css$/, use: ExtractTextPlugin.extract({ use: isDevBuild ? 'css-loader' : 'css-loader?minimize' }) }
            ]
        },
        watch: true,
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        // externals: {
        //     'react': 'React',
        //     'react-dom': 'ReactDOM'
        // },
        plugins: [
            new ExtractTextPlugin('site.css'),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            }),
            new webpack.DefinePlugin({
                __API__: JSON.stringify(apiHost),
                __CLIENTID__: JSON.stringify(clientId),
                __CLIENTSECRET__: JSON.stringify(clientSecret),
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
                // Plugins that apply in production builds only
                new webpack.optimize.UglifyJsPlugin()
            ]),
        resolve: {
            modules: [path.resolve(__dirname, "ClientApp"), "node_modules"],
            alias: {
                'react': path.resolve("./node_modules/react")
            }
        }
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node
    // const serverBundleConfig = merge(sharedConfig(), {
    //     resolve: { mainFields: ['main'] },
    //     entry: { 'main-server': './ClientApp/boot-server.tsx' },
    //     plugins: [
    //         new webpack.DllReferencePlugin({
    //             context: __dirname,
    //             manifest: require('./ClientApp/dist/vendor-manifest.json'),
    //             sourceType: 'commonjs2',
    //             name: './vendor'
    //         })
    //     ],
    //     output: {
    //         libraryTarget: 'commonjs',
    //         path: path.join(__dirname, './ClientApp/dist')
    //     },
    //     target: 'node',
    //     devtool: 'inline-source-map',
    //     // resolve: {
    //     //     modules: [path.resolve(__dirname, "ClientApp"), "node_modules"],
    //     //     alias: {
    //     //         'react': path.resolve("./node_modules/react")
    //     //     }
    //     // }
    // });

    return [clientBundleConfig];
};
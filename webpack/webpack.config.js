const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const { InlineChunkHtmlPlugin } = require('./InlineChunkHtmlPlugin');
const { AssetsJSONPlugin } = require('./AssetsJSONPlugin/AssetsJSONPlugin');
const { resolveTsconfigPaths } = require('./resolveTsconfigPaths');

/**
 * @typedef {webpack.Configuration} Configuration
 * @typedef {webpack.WebpackOptionsNormalized} WebpackOptionsNormalized
 * @typedef {Partial<Configuration> & Pick<Partial<WebpackOptionsNormalized>, 'devServer'>} Config
 */

/** @type {ESLintPlugin.Options} */
const eslintOptions = {
  extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
  cache: true,
  cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
  exclude: ['node_modules', path.resolve(__dirname, '../src/lib')]
};

module.exports =
  /**
   * @param {CustomWebpackOption} option
   */
  option => {
    const { env } = require('./env');

    const outputName =
      /** @param {string} name */
      name =>
        option.serve ? name : name.replace(`[name]`, `[name].[contenthash]`);

    // eslint-disable-next-line
    console.table(env);

    const extractCss = !option.serve;

    /** @type {Config} */
    let config = {
      mode: option.mode,
      entry: {
        preload: './src/preload/index.ts',
        main: './src/main.ts'
      },
      output: {
        // for publicPath, https://stackoverflow.com/a/64715069
        publicPath: ``,
        path: path.resolve(__dirname, `../dist/`),
        filename: outputName('[name].bundle.js'),
        chunkFilename: outputName('[name].chunk.js')
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
          ...resolveTsconfigPaths({
            tsConfig: require('../tsconfig.json')
          })
        }
      },
      module: {
        rules: [
          {
            test: /\.(scss|sass)$/,
            use: [
              extractCss ? MiniCssExtractPlugin.loader : 'style-loader',
              {
                // "?-url" disable relative path resolution
                // reference: https://github.com/webpack-contrib/css-loader/issues/44
                loader: 'css-loader?-url'
              },
              {
                loader: require.resolve('postcss-loader'),
                options: { sourceMap: true }
              },

              {
                loader: 'sass-loader',
                options: {}
              }
            ]
          },
          {
            test: /\.tsx?$|\.jsx?$/,
            loader: 'ts-loader',
            include: path.join(__dirname, '../'),
            exclude: /node_modules/,
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true
            }
          }
        ]
      },
      optimization: {
        // if not false the value of `process.env.NODE_ENV` will depends on `webpack.mode`.
        nodeEnv: false,
        splitChunks: {
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              filename: outputName('[name].bundle.js')
            }
          }
        }
      },
      plugins: [
        new webpack.EnvironmentPlugin(env),

        new webpack.ProgressPlugin(),

        new HtmlWebpackPlugin({
          title: 'Phaser3 Starter',
          template: 'src/index.html'
        }),

        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime|prelaod/]),

        new ForkTsCheckerWebpackPlugin(),

        ...(process.env.RUNTIME_ESLINT_CHECK === 'false'
          ? []
          : [
              // eslint-disable-next-line
              // @ts-ignore
              new ESLintPlugin(eslintOptions)
            ]),

        new CopyWebpackPlugin({
          patterns: [
            {
              from: 'src/assets',
              to: 'assets'
            }
          ].filter(({ from }) => {
            const targetPath = path.resolve(process.cwd(), from);
            return (
              fs.existsSync(targetPath) && !!fs.readdirSync(targetPath).length
            );
          })
        }),

        // [ Image optimization ]
        // The processing time is too long and not much size reduced
        // new ImageMinimizerPlugin({
        //   test: /\.(jpe?g|png|gif|svg)$/i,
        //   minimizerOptions: {
        //     plugins: [
        //       ['gifsicle', { interlaced: true }],
        //       ['jpegtran', { progressive: true }],
        //       ['optipng', { optimizationLevel: 5 }],
        //       ['svgo', { plugins: [{ removeViewBox: false }] }]
        //     ]
        //   }
        // }),
        new ImageMinimizerPlugin({
          test: /\.(jpe?g|png|gif)$/i,
          filename: '[path][name].webp',
          minimizerOptions: {
            plugins: ['imagemin-webp']
          }
        }),

        new AssetsJSONPlugin({
          from: [{ input: 'src/assets', path: `../assets` }],
          to: 'assets/assets.json',
          include: ['**/*'],
          exclude: ['**/loading-page/**/*', '**/assets.json']
        })
      ]
    };

    if (option.sourceMap) {
      config.devtool = option.serve ? 'inline-source-map' : 'source-map';
    }

    if (!option.serve) {
      Object.assign(config.optimization, {
        // This split webpack runtime script into a`runtime.[contenthash].js`
        // HMR will be failed after page refresh possibly because its name has contenthash
        runtimeChunk: 'single'
      });
    }

    if (option.minify) {
      config.optimization?.minimizer?.push(
        new TerserPlugin({
          terserOptions: {
            // Since we are using XXXScene.name as the key of Phaser Scene
            // if `keep_fnames` not true, `XXXScene.name` may duplicate in production build
            keep_fnames: true,
            compress: { passes: 2 }
          }
        })
      );
    }

    if (extractCss) {
      config.plugins?.push(
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
          chunkFilename: '[id].[contenthash].css'
        })
      );
    }

    if (option.obfuscate) {
      config.plugins?.push(
        new WebpackObfuscator(
          {
            rotateStringArray: true,
            stringArray: true,
            stringArrayThreshold: 0.75
          },
          ['runtime.*.js', 'vendors.*.js']
        )
      );
    }

    /**
     * You cloud remove below comment if you are not using Phaser SpinePlugin
     */

    // // config for complie phaser spine plugin from its source instead of the bundeld outputs
    // // https://github.com/photonstorm/phaser/blob/331d5605ad4226938ef0edfbaf5708b2c931b185/plugins/spine/webpack.auto.config.js#L29-L46
    // Object.assign(config.resolve?.alias, {
    //   Spine: './runtimes/spine-both.js'
    // });

    // config.module?.rules?.push(
    //   {
    //     test: require.resolve('phaser/plugins/spine/src/runtimes/spine-both'),
    //     loader: 'imports-loader',
    //     options: {
    //       type: 'commonjs',
    //       wrapper: 'window'
    //     }
    //   },
    //   {
    //     test: require.resolve('phaser/plugins/spine/src/runtimes/spine-both'),
    //     loader: 'exports-loader',
    //     options: {
    //       type: 'commonjs',
    //       exports: 'single spine'
    //     }
    //   }
    // );

    if (option.serve) {
      config.devServer = {
        hot: process.env.DEV_SERVER_HMR !== 'false',
        open: process.env.DEV_SERVER_OPEN !== 'false',
        port: process.env.DEV_SERVER_PORT && Number(process.env.DEV_SERVER_PORT)
      };
    }

    return config;
  };

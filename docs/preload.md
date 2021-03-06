## Preload <!-- {docsify-ignore-all} -->

For scripts that should run as soon as possible, you could put it at `src/preload/`.

If the bundle size of preload becomes larger. You could create another `entry` in the webpack config. For example

```js file=webpack/webpack.common.js
const config = {
  entry: {
    preload: './src/preload/index.ts' // highlight-line
  }
  // ...
};
```

And update the `depndOn` option

```js file=webpack/webpack.config.js
const config = {
  mode: 'production',
  entry: {
    // ...
    dependOn: ['preload'] // highlight-line
  }
};
```

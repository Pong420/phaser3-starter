## Getting Started <!-- {docsify-ignore-all} -->

### Installation

Install [Yarn](https://classic.yarnpkg.com/en/docs/install) if not installed. Then install NPM packages by

```bash
yarn

```

or

```bash
yarn install

```

### Development

```bash
yarn dev
```

### Build

build for production reday ( `minify`, `js obfuscated`, `no console`, `no sourcemap` )

```bash
yarn build
```

build for debug ( `minify`, `has console`, `has sourcemap` )

```
yarn builder debug

```

Or you could customize your build output

```
yarn builder

```

### Serve

serve build output at `http://localhost:5000/`

```bash
yarn start
```

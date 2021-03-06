## Linter <!-- {docsify-ignore-all} -->

### ESLint

Currently, only the recommended rules configured with some rules are disabled. For more details, look at `.eslintrc.js`

#### ESlint Runtime

Eslint will be run automatically during development ( as [Webpack#ESLintPlugin](./webpack.md) ). But You could disable the checking by an [Environment Variable](./environment-variables.md)

```env file=.env.local
RUNTIME_ESLINT_CHECK = false
```

#### Ignore ESLint

Sometimes you may want to ignore eslint. You could

```ts
// Add below this comment at the top of the file
/* eslint-disable */ // highlight-line

// eslint-disable-next-line // highlight-line
var a = 1;

var a = 1; // eslint-disable-line // highlight-line

// You could add a specific rule after eslint-disable comment. For example
/* eslint-disable @typescript-eslint/ban-types */ // highlight-line
```

For more details, take a look at [Eslint - Ignoring Code](https://eslint.org/docs/user-guide/configuring/ignoring-code)

### Prettier

`Prettier` is a code formatter its config is configure in `.prettierrc`

You could use the `prettier-ignore` comment to ignore the next line. For example

```css highlight=1
/* prettier-ignore */
box-shadow: 
  inset -1px -1px 0 rgba(0, 0, 0, 0.05), 
  inset 1px 1px 0 rgba(0, 0, 0, 0.05);
```

You could force prettier to split an array or object to new-line by adding `//`

```ts
const numbers = [
  // // highlight-line
  1,
  2,
  3
];

// without `//`
const numbers = [1, 2, 3];
```

### Husky

[Husky](https://github.com/typicode/husky/tree/main) make git hooks easier to use.

### Lint-Staged

[Lint-Staged](https://github.com/okonet/lint-staged) lint the **staged** files before git commit.

For example below. The configuration means apply `eslint` and use `prettier` on staged `js,jsx,ts,tsx` files.
If combine with `pre-commit` hooks you cannot commit if your staged files do not pass the linting.

```json file=package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --rule 'no-console: [\"error\", { allow: [\"warn\", \"error\"] }]' --max-warnings=0",
      "prettier --ignore-path .eslintignore --write"
    ]
  }
}
```

#### Ignore lint-staged

You could use the `--no-verify` flag to ignore `lint-staged`

```
git commit -m 'commit msg' --no-verify
```

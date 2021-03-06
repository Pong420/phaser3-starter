const inquirer = require('inquirer');
const defaultRimraf = require('rimraf');
const { spawn } = require('./spawn');

/** @param {string} path */
function rimraf(path) {
  return new Promise((resolve, reject) => {
    defaultRimraf(path, error => (error ? reject(error) : resolve({})));
  });
}

/** @type {CustomWebpackOption} */
const dev = {
  mode: 'development',
  env: 'development',
  sourceMap: true,
  serve: true
};

/** @type {CustomWebpackOption} */
const debug = {
  mode: 'production',
  env: 'production',
  minify: true,
  sourceMap: true
};

/** @type {CustomWebpackOption} */
const prod = {
  mode: 'production',
  env: 'production',
  minify: true,
  obfuscate: true
};

/** @type {Record<string, CustomWebpackOption>} */
const presets = {
  debug,
  prod,
  dev
};

let [presetKey] = process.argv.slice(2);

async function getConfigs() {
  const custom = `custom`;

  if (!presetKey) {
    const result = await inquirer.prompt([
      {
        type: 'list',
        name: 'presetKey',
        message: 'Select a preset or custom',
        choices: [custom, ...Object.keys(presets)]
      }
    ]);
    presetKey = result.presetKey;
  }

  if (presetKey === custom) {
    /** @type {CustomWebpackOption['mode'][]} */
    const mode = ['production', 'development', 'none'];

    /** @type {CustomWebpackOption['env'][]} */
    const env = ['production', 'development', 'debug'];

    /** @type {BooleanFields<CustomWebpackOption>[]} */
    const flagsOption = ['minify', 'obfuscate', 'serve', 'sourceMap'];

    /** @type {inquirer.QuestionCollection<CustomWebpackOption & {flags: typeof flagsOption}>} */
    const questions = [
      {
        type: 'list',
        name: 'mode',
        message: 'Select webpack mode:',
        choices: mode
      },
      {
        type: 'list',
        name: 'env',
        message: 'Select Node Env:',
        choices: env
      },
      {
        type: 'checkbox',
        name: 'flags',
        message: 'Select other option',
        choices: flagsOption
      }
    ];

    const { flags, ...result } = await inquirer.prompt(questions);
    return {
      ...result,
      ...flags.reduce((r, f) => ({ ...r, [f]: true }), {})
    };
  }

  return { ...presets[presetKey] };
}

async function run() {
  const config = await getConfigs();

  const args = ['webpack', '--config', 'webpack/webpack.config.js'];
  const entries = Object.entries(config);

  if (config.serve) {
    args.splice(1, 0, 'serve');
  } else {
    await rimraf(`./dist`);
    await rimraf(`./*.tsbuildinfo`);
  }

  for (const [key, value] of entries) {
    if (value) {
      args.push(`--env`, typeof value === 'boolean' ? key : `${key}=${value}`);
    }
  }

  process.env.NODE_ENV = config.env;

  spawn(`yarn`, args);
}

run();

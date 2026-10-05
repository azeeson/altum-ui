const path = require('path');

module.exports = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    // Внутренние узлы библиотеки: не сторис и не публичный API.
    '!../src/components/internal/**',
  ],
  staticDirs: [{ from: path.join(__dirname, 'public'), to: '/' }],
  addons: [
    '@storybook/addon-essentials',
  ],
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
          },
        },
      ],
    });

    config.module.rules = config.module.rules.filter((rule) => {
      if (rule && rule.test && rule.test.toString().includes('css')) {
        return false;
      }
      return true;
    });

    config.module.rules.push({
      test: /\.css$/,
      exclude: /\.module\.css$/,
      use: ['style-loader', 'css-loader'],
    });

    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
        },
      ],
    });

    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};

module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'plugin:prettier/recommended',
    'prettier/flowtype',
    'prettier/react',
  ],
  plugins: ['flowtype', 'prettier', 'import'],
  globals: {
    window: true,
    Rust: true,
  },
  rules: {
    'import/extensions': 0, // TODO: configure Babel(?) resolver to pick up .jsx
    'import/exports-last': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
    'react/prefer-stateless-function': 0,
    'react/no-multi-comp': 0,
    'prettier/prettier': 'error',
    'class-methods-use-this': 1,
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
  overrides: [
    {
      files: ['src/**/*.jsx?'],
    },
  ],
};

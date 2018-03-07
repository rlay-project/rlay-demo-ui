module.exports = {
  parser: 'babel-eslint',
  extends: "airbnb",
  "globals": {
    "window": true,
    "Rust": true,
  },
  "rules": {
    "import/extensions": 0, // TODO: configure Babel(?) resolver to pick up .jsx
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "react/jsx-filename-extension": 0,
    "react/prop-types": 0,
  },
};

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  "plugins": ["const-enum", "@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties", "@babel/transform-typescript"]
};

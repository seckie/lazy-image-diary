module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};

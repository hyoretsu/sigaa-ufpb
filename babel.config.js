const config = {
 ignore: ['src/__tests__/*', 'src/@types/*'],
 plugins: [
  ['babel-plugin-styled-components', { pure: true }],
 ],
 presets: [
  ['@babel/preset-env', { targets: '>0.2%, not dead, not op_mini all' }],
  ['@babel/preset-react', { runtime: 'automatic' }],
  '@babel/preset-typescript',
 ],
};

export default config;

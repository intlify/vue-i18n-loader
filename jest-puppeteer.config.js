module.exports = {
  server: {
    port: 8080,
    command:
      'webpack-dev-server --config example/webpack.config.js --inline --hot'
  },
  launch: {
    dumpio: false,
    headless: process.env.HEADLESS !== 'false'
  },
  browser: 'chromium',
  browserContext: 'default'
}

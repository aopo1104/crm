module.exports = {
  apps: [{
    name: 'crm',
    script: 'app.js',
    cwd: __dirname,
    env: { PORT: 3002, NODE_ENV: 'production' }
  }]
}

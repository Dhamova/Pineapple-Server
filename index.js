const express = require('express')
const ParseServer = require('parse-server').ParseServer
const ParseDashboard = require('parse-dashboard')
const path = require('path')

const databaseUri = process.env.DATABASE_URL || process.env.MONGODB_URI
if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.')
}

const config = {
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', // Or add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse' // Don't forget to change to https if needed
}

const app = express()
app.use('/public', express.static(path.join(__dirname, '/public')))

const api = new ParseServer(config)
app.use('/', api)

var dashboard = new ParseDashboard({
  "allowInsecureHTTP": true,
	"apps": [
    {
      "serverURL": config.serverURL,
      "appId": config.appId,
      "masterKey": config.masterKey,
      "appName": "Pineapple App"
    }
  ],
  "users": [
    {
      "user": process.env.MASTER_USERNAME || 'admin',
      "pass": process.env.MASTER_PASSWORD || 'pineapple'
    }
  ]
}, { allowInsecureHTTP: true })
app.use('/dashboard', dashboard)

const port = process.env.PORT || 1337
const httpServer = require('http').createServer(app)
httpServer.listen(port, function () {
  console.log('Pineapple Server running on port ' + port + '.')
})

module.exports = {
  app,
  config,
};
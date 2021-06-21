const functions = require("firebase-functions");
const { Client } = require('@elastic/elasticsearch')

const config = functions.config()
const client = new Client({ node: config.env.elasticsearch })

module.exports = client
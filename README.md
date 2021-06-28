# Freeletics Hashtag Service

freeletics-hashtag-service is a service built from NodeJS + firebase cloud function + Google Pub/Sub for manipulate hashtag of Social platform that created by `Amity Social Cloud` ([ASC](https://www.amity.co/products/amity-social))

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install freeletics-hashtag-service.

```bash
cd functions
npm install
cp env.example env.json
```
## Environment Setup
Open file env.json 
```
elasticsearch={Elasticsearch_Endpoint}
topic={GOOGLE_PUBSUB_TOPIC}
asc_token={ASC_API_Key}
```

## Development
```bash
npm run serve
```

## Deployment
```bash
npm run deploy
```
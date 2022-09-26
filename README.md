# Earthquakes

## High Level Solution Design

High Level Diagram
![earthquakes.png](docs/earthquakes.png)

This repository uses Serverless Framework with AWS can supports offline mode to complete the solution at local environment.

## Getting Started
- Use the 16.x version of NodeJS framework by [NVM](https://github.com/nvm-sh/nvm)
```shell
nvm use 16
```

- Install Yarn
```shell
npm instal -g yarn typescript
```

- Install all node packages by yarn
```shell
yarn install
```

- Install [serverless framework](https://www.serverless.com/framework/docs/getting-started/)
```shell
npm install -g serverless
```

- Install dynamodb local for serverless
```shell
serverless dynamodb install
```

Caution: **The dynamodb local requires the machine has been installed [Java JRE](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html) > 8 to run**

- Start the serverless offline by

```
serverless offline start
```

- There are two ways to execute the API:

1. Import the postman configuration file to Postman and execute the collection API.
```json
{
	"info": {
		"_postman_id": "9a30abb0-eff7-45d3-88ef-3913164c4768",
		"name": "Earthquakes",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "FetchEarthquakes",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:3000/dev/earthquakes/fetch",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"dev",
						"earthquakes",
						"fetch"
					]
				}
			},
			"response": []
		},
		{
			"name": "GetEarthquakes",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:3000/dev/earthquakes",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"dev",
						"earthquakes"
					],
					"query": [
						{
							"key": "limit",
							"value": "50",
							"disabled": true
						},
						{
							"key": "cursor",
							"value": null,
							"disabled": true
						}
					]
				}
			},
			"response": []
		},
		{
			"name": "GetRequestHistory",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:3000/dev/history",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"dev",
						"history"
					],
					"query": [
						{
							"key": "limit",
							"value": "50",
							"disabled": true
						},
						{
							"key": "cursor",
							"value": null,
							"disabled": true
						}
					]
				}
			},
			"response": []
		}
	]
}
```
2. Uses CURL:
- Fetch earthquakes
```shell
curl --location --request GET 'http://localhost:3000/dev/earthquakes/fetch'

```
- Get earthquakes (Can add optional parameters: `limit` and `cursor`). `Cursor` is the `code` (this is primary key)
```shell
curl --location --request GET 'http://localhost:3000/dev/earthquakes'
```

- Get request history (Can add optional parameters: `limit` and `cursor`). `Cursor` is the `requestId` (this is primary key)
```shell
curl --location --request GET 'http://localhost:3000/dev/history'
```
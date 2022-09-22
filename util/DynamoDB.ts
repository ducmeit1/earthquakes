import { DynamoDB } from 'aws-sdk';
import "source-map-support/register";

export function NewDynamoDBClient(): DynamoDB.DocumentClient {
  return new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET',
  });
}


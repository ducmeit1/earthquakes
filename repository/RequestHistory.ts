import { DynamoDB } from 'aws-sdk';
import { DefaultLimitRecords, RequestHistoryTable } from '../constant';
import { PaginationResult, RequestHistoryFilter } from '../dto';
import { RequestHistory } from '../model';
import { NewDynamoDBClient } from '../util';
import 'source-map-support/register';

interface IRequestHistoriesRepository {
  getRequestHistory(filter: RequestHistoryFilter): Promise<any>;
  insertRequestHistory(item: RequestHistory): Promise<any>;
}

export class RequestHistoriesRepository implements IRequestHistoriesRepository {
  dynamoDBClient: DynamoDB.DocumentClient;
  tableName: string;

  constructor() {
    this.dynamoDBClient = NewDynamoDBClient();
    this.tableName = RequestHistoryTable;
  }

  async getRequestHistory(filter: RequestHistoryFilter): Promise<any> {
    try {
      let cursor: DynamoDB.DocumentClient.Key | undefined;
      if (filter?.pagination?.cursor != undefined) {
        cursor = {
          code: filter.pagination?.cursor,
        };
      }

      let limit: number = DefaultLimitRecords;
      if (filter?.pagination?.limit != undefined) {
        limit = filter.pagination?.limit;
      }

      const data = await this.dynamoDBClient
        .scan({
          TableName: this.tableName,
          Limit: limit,
          ExclusiveStartKey: cursor,
        })
        .promise();

      const paginationResult: PaginationResult<RequestHistory> = {
        totalCount: data.Count,
        nextCursor: data.LastEvaluatedKey?.code,
        records: data.Items as RequestHistory[],
      };

      return paginationResult;
    } catch (error) {
      console.error('Getting error when query data from DynamoDB: ', error);
      throw error;
    }
  }

  async insertRequestHistory(item: RequestHistory): Promise<any> {
    try {
      const data = await this.dynamoDBClient
        .put({
          TableName: this.tableName,
          Item: {
            requestId: item.requestId,
            path: item.path,
            httpMethod: item.httpMethod,
            userAgent: item.userAgent,
            requestTime: item.requestTime,
            protocol: item.protocol,
            statusCode: item.statusCode,
          },
        })
        .promise();

      return data;
    } catch (error) {
      console.error('Getting error when insert data to DynamoDB: ', error);
      throw error;
    }
  }
}

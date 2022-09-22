import { DynamoDB } from 'aws-sdk';
import { DefaultLimitRecords, EarthquakesTable } from '../constant';
import { EarthquakeFilter, PaginationResult } from '../dto';
import { Earthquake } from '../model';
import { NewDynamoDBClient } from '../util';
import "source-map-support/register";

interface IEarthquakesRepository {
  getEarthquakes(filter: EarthquakeFilter): Promise<any>;
  insertEarthquake(item: Earthquake): Promise<any>;
}

export class EarthquakesRepository implements IEarthquakesRepository {
  dynamoDBClient: DynamoDB.DocumentClient;
  tableName: string;

  constructor() {
    this.dynamoDBClient = NewDynamoDBClient();
    this.tableName = EarthquakesTable;
  }

  async getEarthquakes(filter?: EarthquakeFilter): Promise<any> {
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

      const paginationResult: PaginationResult<Earthquake> = {
        totalCount: data.Count,
        nextCursor: data.LastEvaluatedKey?.code,
        records: data.Items as Earthquake[],
      };

      return paginationResult;
    } catch (error) {
      console.error('Getting error when query data from DynamoDB: ', error);
      throw error;
    }
  }

  async insertEarthquake(item: Earthquake): Promise<any> {
    try {
      const data = await this.dynamoDBClient
        .put({
          TableName: this.tableName,
          Item: {
            code: item.code,
            mag: item.mag,
            time: item.time,
            updated: item.updated,
            tz: item.tz,
            url: item.url,
            detail: item.detail,
            felt: item.felt,
            cdi: item.cdi,
            mmi: item.mmi,
            alert: item.alert,
            status: item.status,
            tsunami: item.tsunami,
            sig: item.sig,
            net: item.net,
            ids: item.ids,
            sources: item.sources,
            types: item.types,
            nst: item.nst,
            dmin: item.dmin,
            rms: item.rms,
            gap: item.gap,
            magType: item.magType,
            type: item.type,
            title: item.title,
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

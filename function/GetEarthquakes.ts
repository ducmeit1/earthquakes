import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import _ from 'lodash';
import { EarthquakesRepository } from '../repository';
import { ApiResponse } from '../util';
import 'source-map-support/register';
import { EarthquakeFilter } from '../dto';
import { RequestLoggingMiddleware } from '../middleware';
import middy from '@middy/core';

const lambdaHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    let limit: number | undefined;
    let cursor: string | undefined;
    if (event.queryStringParameters != null) {
      if (event.queryStringParameters.limit != undefined) {
        const parsedLimit = parseInt(event.queryStringParameters.limit, 10);
        if (isNaN(parsedLimit)) {
          return ApiResponse.BadRequest({ message: 'invalid limit' });
        }
        limit = parsedLimit;
      }
      if (event.queryStringParameters.cursor != undefined) {
        cursor = event.queryStringParameters.cursor;
        if (_.isEmpty(cursor)) {
          return ApiResponse.BadRequest({ message: 'invalid cursor' });
        }
      }
    }

    const earthquakesRepository = new EarthquakesRepository();
    const params: EarthquakeFilter = {
      pagination: {
        limit: limit,
        cursor: cursor,
      },
    };
    const data = await earthquakesRepository.getEarthquakes(params);
    return ApiResponse.OK(data);
  } catch (error) {
    console.error('Getting unexpected error from axios: ', error);
    return ApiResponse.InternalServerError();
  }
};

export const handler = middy(lambdaHandler);
handler.use(RequestLoggingMiddleware());

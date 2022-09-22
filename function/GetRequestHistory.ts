import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import _ from 'lodash';
import { RequestHistoriesRepository } from '../repository';
import { ApiResponse } from '../util';
import 'source-map-support/register';
import { RequestHistoryFilter } from '../dto';

export const handler: Handler = async (
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

    const requestHistoriesRepository = new RequestHistoriesRepository();
    const params: RequestHistoryFilter = {
      pagination: {
        limit: limit,
        cursor: cursor,
      },
    };
    const data = await requestHistoriesRepository.getRequestHistory(params);
    return ApiResponse.OK(data);
  } catch (error) {
    console.error('Getting unexpected error from axios: ', error);
    return ApiResponse.InternalServerError();
  }
};

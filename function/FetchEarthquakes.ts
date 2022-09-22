import { ApiResponse } from '../util';
import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import _ from 'lodash';
import { EarthquakeFeature, PaginationResult } from '../dto';
import { Earthquake } from '../model';
import { EarthquakesRepository } from '../repository';
import middy from '@middy/core';
import { RequestLoggingMiddleware } from '../middleware';

import 'source-map-support/register';

const EarthquakeFeedEndpoint = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

const lambdaHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const earthquakesRepository = new EarthquakesRepository();
    const { data } = await axios.get(EarthquakeFeedEndpoint, { headers: { Accept: 'application/json' } });
    let earthquakes: Earthquake[] = [];

    _.take<EarthquakeFeature>(data.features, 100).forEach(async feature => {
      const earthquake = feature.properties;
      earthquakes.push(earthquake);
      await earthquakesRepository.insertEarthquake(earthquake);
    });

    const response: PaginationResult<Earthquake> = {
      totalCount: earthquakes.length,
      records: earthquakes,
    };

    return ApiResponse.OK(response);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Getting error from axios: ', error.message);
      return ApiResponse.InternalServerError({ error: error.message });
    } else {
      console.error('Getting unexpected error: ', error);
      return ApiResponse.InternalServerError();
    }
  }
};

export const handler = middy(lambdaHandler);
handler.use(RequestLoggingMiddleware());

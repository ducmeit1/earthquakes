import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RequestHistory } from '../model';
import { RequestHistoriesRepository } from '../repository';

export function RequestLoggingMiddleware(): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> {
    const requestHistoriesRepository = new RequestHistoriesRepository();
    const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request): Promise<void> => { };

    const after: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request): Promise<void> => {
        try {
            const event = request.event;
            const item: RequestHistory = {
                requestId: event.requestContext.requestId,
                requestTime: event.requestContext.requestTimeEpoch,
                path: event.path,
                httpMethod: event.httpMethod,
                statusCode: request.response?.statusCode,
                userAgent: event.headers['User-Agent'],
                protocol: event.requestContext.protocol,
            };
            await requestHistoriesRepository.insertRequestHistory(item);
        } catch (error) {
            console.log('Writing request logging has error ', error);
        }
    };

    return {
        before,
        after,
    };
}

import { APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";

function response(statusCode = 502, data = {}): APIGatewayProxyResult {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
    },
    statusCode: statusCode,
    body: JSON.stringify(data),
  };
}

export const ApiResponse = {
  OK(data = {}) {
    return response(200, data);
  },

  BadRequest(data = {}) {
    return response(400, data);
  },

  NotFound(data = {}) {
    return response(404, data);
  },

  InternalServerError(data = {}) {
    return response(500, data);
  },
};

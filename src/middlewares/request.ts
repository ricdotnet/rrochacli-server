import { Request } from 'express';

export class RequestContext {
  static _request: Request;

  constructor(request: Request) {
    RequestContext._request = request;
  }

  static getQuery(value: string) {
    return this._request.query[value];
  }

  static getParam(value: string) {
    return this._request.params[value];
  }
}

export function query(value: string) {
  return RequestContext.getQuery(value);
}

export function param(value: string) {
  return RequestContext.getParam(value);
}

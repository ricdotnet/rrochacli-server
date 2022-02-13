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

  static getBody() {
    return this._request.body;
  }

  static getFile() {
    return this._request.file;
  }
}

export function query(value: string) {
  return RequestContext.getQuery(value);
}

export function param(value: string) {
  return RequestContext.getParam(value);
}

export function body() {
  return RequestContext.getBody();
}

export function file() {
  return RequestContext.getFile();
}

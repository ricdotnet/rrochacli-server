import { Router } from 'express';
import { publish } from './publish/publish';
import { remove } from './remove/remove';

export const api: Router = Router();

api.use('/', publish);
api.use('/', remove);

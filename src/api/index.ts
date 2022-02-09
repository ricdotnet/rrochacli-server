import {Router} from "express";
import {test} from "./test/test";

export const api: Router = Router();

api.use('/', test);

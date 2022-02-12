import express from 'express';
import { api } from './api';
import cors from 'cors';
import { RequestContext } from './middlewares/request';

const app = express();

// app.use('/', (req, res, next) => {
//   const start = Date.now();
//   req.on('start', () => {
//     console.log('start');
//   });
//
//   req.on('end', () => {
//     console.log(res);
//     console.log((Date.now() - start), ' ms');
//   });
//
//   next();
// });

app.use(express.json({ limit: 26214400 }));
app.use(cors());

app.use('/', (req, res, next) => {
  new RequestContext(req);
  next();
});
app.use('/', api);

app.listen(2999, () => {
  console.log('server listening on port 2999');
});

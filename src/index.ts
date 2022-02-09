import express from 'express';
import {api} from "./api";
import cors from 'cors';

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

app.use(express.json());
app.use(cors());
app.use('/', api);

app.listen(2999, () => {
  console.log('server on');
});

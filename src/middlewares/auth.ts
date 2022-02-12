import * as dotenv from 'dotenv';
dotenv.config();

export async function auth(req: any, res: any, next: any) {
  const key: string = req.header('api-key');
  if (key !== process.env.KEY) {
    return res.status(401).send({ m: 'invalid key' });
  }

  next();
}

import {NextFunction, Router} from 'express';
import multer from 'multer';
import {storage} from '../../utils/multer';
import * as util from 'util';
import * as cp from 'child_process';
const exec = util.promisify(cp.exec);

import * as fs from 'fs/promises';

import * as dotenv from 'dotenv';
dotenv.config();

const upload = multer({storage});

export const test: Router = Router();

test.get('/send', (req, res) => {
  res.status(200).send({m: 'sent!'});
});

test.post('/send', auth, upload.single('project'), async (req, res) => {
  console.log('some request came through....');

  if (!req.file) {
    res.status(401).send({m: 'error'});
    throw('No File sent.');
  }
  const fileName = req.file!.originalname;
  const folderName = req.file!.originalname.split('.')[0];

  await exec(`mkdir /var/www/statics/${folderName}`);
  // await exec(`cp ${process.cwd()}/uploads/${fileName} /var/www/statics/${folderName}`);
  const {stderr, stdout} = await exec(`unzip -o ${process.cwd()}/uploads/${fileName} -d /var/www/static/${folderName} -x ${fileName}`);

  if (stderr)
    res.status(400).send({stderr: stderr})

  if (stdout)
    res.status(200).send({m: 'sent!'});
});

// temp auth
async function auth(req: any, res: any, next: any) {
  const key: string = req.header('api-key');
  if (key !== process.env.KEY) {
    return res.status(401).send({m: 'invalid key'});
  }

  next();
}

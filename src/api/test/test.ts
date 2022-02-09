import {NextFunction, Router} from 'express';
import multer from 'multer';
import {storage} from '../../utils/multer';
import * as util from 'util';
import * as cp from 'child_process';
const exec = util.promisify(cp.exec);

import * as fsp from 'fs/promises';

import chalk from 'chalk';

import * as dotenv from 'dotenv';
import {stub} from "../../stubs/virtualhost";
dotenv.config();

const upload = multer({storage});

export const test: Router = Router();

test.get('/send', (req, res) => {
  res.status(200).send({m: 'sent!'});
});

test.post('/send', auth, upload.single('project'), async (req, res) => {
  console.log('some request came through....');
  const projectName = req.body['project-name'];

  if (!req.file) {
    console.log('no file sent...')
    return res.status(401).send({m: 'no file was sent.'});
    // throw('No File sent.');
  }
  const fileName = req.file!.originalname;

  // const folderName = req.file!.originalname.split('.')[0];
  await exec(`mkdir /var/www/statics/${projectName}`);
  // await exec(`cp ${process.cwd()}/uploads/${fileName} /var/www/statics/${folderName}`);

  // TODO: Check for the same zip file inside and if there is then set the -x flag
  const {stderr, stdout} = await exec(`unzip -o ${process.cwd()}/uploads/${fileName} -d /var/www/statics/${projectName}`);
  if (stderr) {
    return res.status(400).send({stderr: stderr})
  }

  // TODO: check for an already existent VirtualHost file to replace in case of updating an existing project
  if (stdout) {

    const data = {
      '{--server-name--}': `${projectName}`,
      '{--server-alias--}': `${projectName}`,
      '{--folder-name--}': `${projectName}`,
    };

    const newVH = stub(data);
    await fsp.writeFile(`/etc/apache2/sites-available/${projectName}.conf`, newVH);
    await exec(`a2ensite ${projectName}`);
    await exec(`systemctl reload apache2`);

    console.log(`=== /\\/\\/\\/\\/\\ ===`);
    console.log(`New project created in ${projectName}`);
    console.log(`=== /\\/\\/\\/\\/\\ ===`);

    await exec(`rm -r ${process.cwd()}/uploads/${fileName}`);

    return res.status(200).send({m: 'sent!'});
  }
});

// temp auth
async function auth(req: any, res: any, next: any) {
  const key: string = req.header('api-key');
  if (key !== process.env.KEY) {
    return res.status(401).send({m: 'invalid key'});
  }

  next();
}

import { Controller, Post } from '@ricdotnet/decorators/src/Decorators';
import { request, respond } from '@ricdotnet/decorators/src/Routing';

import multer from 'multer';
import { storage } from '../utils/multer';
import * as util from 'util';
import * as cp from 'child_process';
const exec = util.promisify(cp.exec);

import * as fsp from 'fs/promises';

import chalk from 'chalk';

import { stub } from '../stubs/virtualhost';
import { auth } from '../middlewares/auth';
import {body, file} from '../middlewares/request';

const upload = multer({ storage });

@Controller('/publish')
export class Publish {
  // @ts-ignore
  @Post('/', [upload.single('project')])
  async publishApp() {
    console.log('some request came through....');
    // const projectName = request().body('project-name');
    const projectName = body()['project-name'];

    if (!file()) {
      return respond({ m: 'no file was sent' }, 401);
      // throw('No File sent.');
    }
    const fileName = file()!.originalname;

    const folderName = file()!.originalname.split('.')[0];
    await exec(`mkdir /var/www/statics/${projectName}`);
    await exec(`cp ${process.cwd()}/uploads/${fileName} /var/www/statics/${folderName}`);

    // TODO: Check for the same zip file inside and if there is then set the -x flag
    const { stderr, stdout } = await exec(
      `unzip -o ${process.cwd()}/uploads/${fileName} -d /var/www/statics/${projectName}`
    );
    if (stderr) {
      // return res.status(400).send({ stderr: stderr });
      return respond({ stderr }, 400);
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

      // return res.status(200).send({ m: 'sent!' });
      return respond({ m: 'project published!' }, 200);
    }
  }
}

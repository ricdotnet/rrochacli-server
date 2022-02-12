import { Request, Response, Router } from 'express';
import { auth } from '../../middlewares/auth';
import { query } from '../../middlewares/request';

import * as fs from 'fs/promises';
import * as util from 'util';
import { exec } from 'child_process';
const sh = util.promisify(exec);

export const remove: Router = Router();

// TODO: Better error handling
remove.delete('/remove', auth, async (req: Request, res: Response) => {
  const app = query('test');

  try {
    // disable the site
    await sh(`a2dissite ${app}`);

    // remove app files
    await fs.rmdir(`/var/www/statics/${app}`, { recursive: true });

    // remove the .conf file
    await fs.rm(`/etc/apache2/sites-available/${app}.conf`);

    // lastly remove disabled-by-admin files
    await fs.rm(`/var/lib/apache2/site/disabled_by_admin/${app}`);

    // after all steps complete restart apache
    await sh('systemctl reload apache2');
  } catch (e) {
    console.log(e);
    return res.status(400).send({ e });
  }

  res.status(200).send({
    m: `${app} was successfully deleted!`
  });
});

import { Controller, Delete } from '@ricdotnet/decorators/src/Decorators';
import { respond, query } from '@ricdotnet/decorators/src/Routing';
import fs from 'fs/promises';
import * as util from 'util';
import { exec } from 'child_process';
const sh = util.promisify(exec);

@Controller('/remove')
export class Remove {
  @Delete('/')
  async removeApp() {
    const { app } = query();

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
      return respond({ e: e }, 400);
    }

    return respond(
      {
        m: `${app} was successfully removed!`,
      },
      200
    );
  }
}

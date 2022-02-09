import {Router} from 'express';
import multer from 'multer';
import {storage} from '../../utils/multer';
import * as util from 'util';
import * as cp from 'child_process';
const exec = util.promisify(cp.exec);

const upload = multer({storage});

export const test: Router = Router();

test.get('/send', (req, res) => {
  res.status(200).send({m: 'sent!'});
});

test.post('/send', upload.single('project'), async (req, res) => {
  if (!req.file) {
    res.status(401).send({m: 'error'});
    throw('No File sent.');
  }
  const fileName = req.file!.originalname;

  // await exec('mkdir ~/Desktop/hello');
  await exec(`cp ${process.cwd()}/uploads/${fileName} ~/Desktop/t`);
  const {stderr, stdout} = await exec(`unzip -o ~/Desktop/t/${fileName} -d ~/Desktop/hello -x ${fileName}`);

  if (stderr)
    res.status(400).send({stderr: stderr})

  if (stdout)
    res.status(200).send({m: 'sent!'});
});


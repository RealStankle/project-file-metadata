const express = require('express');
const cors = require('cors');
const formidable = require('formidable');
const crypto = require('node:crypto');
const fs = require('node:fs');
require('dotenv').config();

const app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (_, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', (req, res, next) => {
  const form = formidable({
    uploadDir: './',
    filename: (_, ext) => `${crypto.randomUUID().slice(0, 8)}${ext}`,
    keepExtensions: true,
  });

  form.parse(req, (err, _, files) => {
    if (err) {
      next(err);
      return;
    }

    const file = files.upfile;

    fs.unlinkSync(file.filepath);

    res.json({
      name: file.originalFilename,
      type: file.mimetype,
      size: file.size,
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});

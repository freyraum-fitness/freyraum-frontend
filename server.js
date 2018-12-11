const express = require('express');
const path = require('path');

const host = '0.0.0.0';
const port = 4000;
const app = express();

const staticPath = path.join(__dirname, 'dest');
app.use(express.static(staticPath));

app.listen(port, host, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up %s:%s/ in your browser.', port, host, port);
});
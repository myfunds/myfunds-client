// server.js
import express from 'express';
import path from 'path';
import compression from 'compression';

const app = express();

app.use(compression());

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'build') });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Production Express server running at localhost: ${PORT}`);
});

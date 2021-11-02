require('dotenv/config');
const pg = require('pg');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.post('/api/posts', (req, res, next) => {
  const { imageUrl, summary, title, body } = req.body;
  if (!imageUrl || !summary || !title || !body) {
    throw new ClientError(400, 'imageUrl, summary, title and body are required fields');
  }
  const sql = `
    insert into "posts" ("imageUrl", "summary", "title", "body")
    values ($1, $2, $3, $4)
    returning "imageUrl", "summary", "title", "body", "createdAt"
  `;
  const params = [imageUrl, summary, title, body];
  db.query(sql, params)
    .then(result => {
      const [newPost] = result.rows;
      res.status(201).json(newPost);
    })
    .catch(err => next(err));
});

app.use(staticMiddleware);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});

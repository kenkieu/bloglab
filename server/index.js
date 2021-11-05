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
app.use(staticMiddleware);

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.post('/api/posts', (req, res, next) => {
  const { imageUrl, summary, title, body } = req.body;
  if (!imageUrl || !summary || !title || !body) {
    throw new ClientError(400, 'userId, imageUrl, summary, title and body are required fields');
  }
  const sql = `
    insert into "posts" ("userId", "imageUrl", "summary", "title", "body")
    values ($1, $2, $3, $4, $5)
    returning *
  `;
  const params = [1, imageUrl, summary, title, body];
  db.query(sql, params)
    .then(result => {
      const [newPost] = result.rows;
      res.status(201).json(newPost);
    })
    .catch(err => next(err));
});

app.get('/api/posts/:postId', (req, res, next) => {
  const postId = Number(req.params.postId);
  if (!postId) {
    throw new ClientError(400, 'postId must be a positive integer');
  }
  const sql = `
    select "imageUrl",
           "summary",
           "title",
           "username",
           "createdAt",
           "body"
    from "posts"
    join "users" using ("userId")
    where "postId" = $1
  `;

  const params = [postId];

  db.query(sql, params)
    .then(result => {
      if (!result.rows) {
        throw new ClientError(400, `cannot find post with postId ${postId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/posts', (req, res, next) => {
  const sql = `
    select "postId",
           "imageUrl",
           "summary",
           "title",
           "username",
           "createdAt",
           "body"
    from "posts"
    join "users" using ("userId")
    order by "postId" desc
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/comments', (req, res, next) => {
  // console.log(req.body);
  const { postId, userId, content } = req.body;
  if (!postId || !userId || !content) {
    throw new ClientError(400, 'postId, userId, and content are required fields');
  }
  const sql = `
    insert into "comments" ("postId", "userId", "content")
    values ($1, $2, $3)
  `;
  const params = [postId, userId, content];

  db.query(sql, params)
    .then(result => {
      const [newComment] = result.rows;
      res.status(201).json(newComment);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});

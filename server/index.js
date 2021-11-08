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
    select "p"."postId",
           "u"."userId",
           "p"."imageUrl",
           "p"."summary",
           "p"."title",
           "u"."username",
           "p"."createdAt",
           "p"."body",
           count("c".*) as "totalComments"
    from "posts" as "p"
    join "users" as "u" using ("userId")
    left join "comments" as "c" using ("postId")
    where "p"."postId" = $1
    group by "p"."postId", "u"."username", "u"."userId"
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
  const { postId, userId, content } = req.body;
  if (!postId || !userId || !content) {
    throw new ClientError(400, 'postId, userId, and content are required fields');
  }
  const firstSql = `
    insert into "comments" ("postId", "userId", "content")
    values ($1, $2, $3)
    returning *
  `;
  const secondSql = `
    select "username"
    from "users"
    where "userId" = $1
  `;
  const firstParams = [postId, userId, content];
  const secondParams = [userId];

  db.query(firstSql, firstParams)
    .then(firstResult => {
      return db.query(secondSql, secondParams)
        .then(secondResult => {
          const [commentData] = firstResult.rows;
          const [username] = secondResult.rows;
          const newComment = { ...commentData, ...username };
          res.status(201).json(newComment);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/comments/:postId', (req, res, next) => {
  const postId = Number(req.params.postId);
  const sql = `
    select "username",
           "content",
           "createdAt"
    from "comments"
    join "users" using ("userId")
    where "postId" = $1
  `;
  const params = [postId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows) {
        throw new ClientError(400, `cannot find post with postId ${postId}`);
      }
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/likes', (req, res, next) => {
  const { postId, userId } = req.body;
  if (!postId || !userId) {
    throw new ClientError(400, 'postId and userId are required fields');
  }
  const sql = `
    insert into "likePosts" ("postId", "userId")
    values ($1, $2)
    on conflict do nothing
    returning *
  `;

  const params = [postId, userId];

  db.query(sql, params)
    .then(result => {
      const [newLike] = result.rows;
      res.status(201).json(newLike);
    })
    .catch(err => next(err));
});

app.get('/api/likes/:postId', (req, res, next) => {
  const postId = Number(req.params.postId);
  const sql = `
    select count("l".*) as "totalLikes"
    from "likePosts" as "l"
    where "postId" = $1
    `;
  //
  const secondSql = `
    select count("l".*) > 0 as "userLiked"
    from "likePosts" as "l"
    where "postId" = $1 and "userId" = $2
  `;

  const secondParams = [postId, 1];
  //
  const params = [postId];

  db.query(sql, params)
    .then(firstResult => {
      if (!firstResult.rows) {
        throw new ClientError(400, `cannot find post with postId ${postId}`);
      }
      return db.query(secondSql, secondParams)
        .then(secondResult => {
          if (!secondResult.rows) {
            throw new ClientError(400, `cannot find post with postId ${postId}`);
          }
          const [totalLikes] = firstResult.rows;
          const [userLiked] = secondResult.rows;
          const likeData = { ...totalLikes, ...userLiked };
          res.json(likeData);
        });
    }).catch(err => next(err));
});

app.delete('/api/likes/:postId', (req, res, next) => {
  const postId = Number(req.params.postId);
  const sql = `
    delete from "likePosts"
    where "userId" = $1
    returning *
  `;
  const params = [1];

  db.query(sql, params)
    .then(result => {
      if (!result.rows) {
        throw new ClientError(400, `cannot find post with postId ${postId}`);
      }
      res.status(204).json(result.rows);
    }).then(data => console.log(data));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});

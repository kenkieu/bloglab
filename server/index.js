// const pg = require('pg');
const { Pool } = require('pg');
require('dotenv/config');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const express = require('express');
const sgMail = require('@sendgrid/mail');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const ClientError = require('./client-error');

// const db = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.get('/api/testing', (req, res) => res.send('Express on Vercel'));

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    throw new ClientError(400, 'username password, and email are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("username", "hashedPassword", "email")
        values ($1, $2, $3)
        returning "userId", "username", "email"
      `;
      const params = [username, hashedPassword, email];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.post('/api/posts', authorizationMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const { imageUrl, summary, title, body } = req.body;
  if (!imageUrl || !summary || !title || !body) {
    throw new ClientError(400, 'imageUrl, summary, title and body are required fields');
  }
  const sql = `
    insert into "posts" ("userId", "imageUrl", "summary", "title", "body")
    values ($1, $2, $3, $4, $5)
    returning *
  `;
  const params = [userId, imageUrl, summary, title, body];
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
           "u".email,
           "p"."createdAt",
           "p"."body",
           count("c".*) as "totalComments"
    from "posts" as "p"
    join "users" as "u" using ("userId")
    left join "comments" as "c" using ("postId")
    where "p"."postId" = $1
    group by "p"."postId", "u"."username", "u"."userId", "u".email
  `;

  const params = [postId];

  db.query(sql, params)
    .then(result => {
      const [post] = result.rows;
      if (!post) {
        throw new ClientError(404, `cannot find post with postId ${postId}`);
      }
      res.json(post);
    })
    .catch(err => next(err));
});

app.put('/api/posts/:postId', authorizationMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const postId = Number(req.params.postId);
  const { imageUrl, summary, title, body } = req.body;
  if (!imageUrl || !summary || !title || !body) {
    throw new ClientError(400, 'imageUrl, summary, title and body are required fields');
  }
  const sql = `
    update "posts"
    set "userId" = $1,
        "imageUrl" = $2,
        "summary" = $3,
        "title" = $4,
        "body" = $5
    where "postId" = $6
    returning *
  `;
  const params = [userId, imageUrl, summary, title, body, postId];
  db.query(sql, params)
    .then(result => {
      const [newPost] = result.rows;
      res.status(201).json(newPost);
    })
    .catch(err => next(err));
});

app.delete('/api/posts/:postId', authorizationMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const postId = Number(req.params.postId);
  const sql = `
    with "deleteLikes" as (
      delete from "likePosts"
      where "postId" = $1
      returning *
    ), "deleteComments" as (
      delete from "comments"
      where "postId" = $1
      returning *
    )
    delete from "posts"
    where "postId" = $1 and "userId" = $2
    returning *
  `;
  const params = [postId, userId];
  db.query(sql, params)
    .then(result => {
      const [post] = result.rows;
      if (!post) {
        throw new ClientError(404, `cannot find post with postId ${postId}`);
      }
      res.status(204).json();
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
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/my-posts', authorizationMiddleware, (req, res, next) => {
  const { userId } = req.user;
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
    where "userId" = $1
    order by "postId" desc
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/comments', authorizationMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const { postId, content } = req.body;
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
    select "userId",
           "username",
           "content",
           "createdAt"
    from "comments"
    join "users" using ("userId")
    where "postId" = $1
    order by "createdAt" desc
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

app.post('/api/likes', authorizationMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const { postId } = req.body;
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

  const params = [postId];

  db.query(sql, params)
    .then(result => {
      const [totalLikes] = result.rows;
      if (!totalLikes) {
        throw new ClientError(404, `cannot find post with postId ${postId}`);
      }
      res.json(totalLikes);
    })
    .catch(err => next(err));
});

app.get('/api/liked/:postId', authorizationMiddleware, (req, res, next) => {
  const postId = Number(req.params.postId);
  const { userId } = req.user;

  const sql = `
    select count("l".*) > 0 as "userLiked"
    from "likePosts" as "l"
    where "postId" = $1 and "userId" = $2
  `;

  const params = [postId, userId];

  db.query(sql, params)
    .then(result => {
      const [userLiked] = result.rows;
      if (userLiked === undefined) {
        throw new ClientError(404, `cannot find post with postId ${postId}`);
      }
      res.json(userLiked);
    })
    .catch(err => next(err));
});

app.delete('/api/likes/:postId', authorizationMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const postId = Number(req.params.postId);
  const sql = `
    delete from "likePosts"
    where "postId" = $1 and "userId" = $2
    returning *
  `;
  const params = [postId, userId];

  db.query(sql, params)
    .then(result => {
      res.status(204).json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/email-share', authorizationMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const sql = `
  select "email"
  from "users"
  where "userId" = $1
  `;

  const params = [userId];

  db.query(sql, params)
    .then(result => {
      const [userEmail] = result.rows;
      res.json(userEmail);
    });
});

app.post('/api/email-share', (req, res, next) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const { title, summary, body, email, username, totalLikes, totalComments } = req.body;
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: title,
    text: body,
    html: `
    <div style="font-family:Roboto;">
     <h1><strong>${title}</strong></h1>
     <p style="color: grey;">by ${username}</p>
     <p style="font-size:120%;"><em>${summary}</em></p>
     <p style="font-size:120%;">${body}</p>
     <p><strong>Likes: ${totalLikes} Comments: ${totalComments}</strong></p>
     <hr>
     <p><strong>&copy; 2021 bloglab</strong></p>
    </div>
    `
  };
  sgMail.send(msg)
    .then(() => {
      res.json({ success: true });
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});

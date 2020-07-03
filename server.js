require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const pool = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

// middleware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'yojigen-app/build')));

app.listen(port, () => {
  console.log(`Start server port: ${port}`);
});

// jwt //

// find user
async function getCurrentUserId(email) {
   const currentId = await pool.query(
    "select id from users where email = $1",[email]
   );
  return currentId.rows[0];
}

// find user and get user name
async function getCurrentUserName(email) {
   const currentId = await pool.query(
    "select name , id from users where email = $1",[email]
   );
  return currentId.rows[0];
}

// app.get('/posts', authenticateToken, (req, res) => {
//   res.json(posts.filter(post => post.name === req.user.name));
// })

app.post('/login', async (req, res) => {
  try {
    const user = await pool.query('select * from users where email = $1', [req.body.email]);
    if (typeof user.rows[0] == 'undefined') return res.status(400).send({ message: "メールアドレスが見つかりません" });
    if (await bcrypt.compare(req.body.password, user.rows[0].password)) {

      const accessToken = jwt.sign(user.rows[0].email, process.env.ACCESS_TOKEN_SECRET);
      res.send({ accessToken: accessToken });
    } else {
      res.send({ message: "passwordが一致しません"})
    }
  } catch (err) {
    console.log(err.message);
  }
});

function authenticateToken(req, res, next) {
  // headerのauthorization keyからvalueを受け取る
  const authHeader = req.headers['authorization'];
  // [Bearer token]からtokenのみを受け取る
  const token = authHeader && authHeader.split(' ')[1];
  // authrization error
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // forbitten error
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ROUTES //

// post like thread
app.post('/thread/like', authenticateToken, async (req, res) => {
  try {
    console.log('start');
    const { id } = await getCurrentUserId(req.user);
    console.log(id);
    console.log(req.body);
      
    const newBody = await pool.query(
      "insert into likes (user_id, thread_id) values ($1, $2) RETURNING *",
      [
        id,
        req.body.threadId,
      ]
    );
    res.json(newBody.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
})

// create a thread
app.post('/thread', authenticateToken, async (req, res) => {
  try {
    const body = req.body;
    const { id } = await getCurrentUserId(req.user);
    const newBody = await pool.query(
      "insert into threads (title, description, user_id) values ($1, $2, $3) RETURNING *",
      [
        body.title,
        body.description,
        id
      ]
    );
    res.json(newBody.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// create a comment
app.post('/comment', authenticateToken, async (req, res) => {
  try {
    const { id } = await getCurrentUserId(req.user);
    const body = req.body;
    const newBody = await pool.query(
      "insert into comments (comment, thread_id, user_id) values ($1, $2, $3) RETURNING *",
      [
        body.comment,
        body.thread_id,
        id
      ]
    );
    res.json(newBody.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// create a user
app.post('/user', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    }
    const newBody = await pool.query(
      "insert into users (name, email, password) values ($1, $2, $3) RETURNING *",
      [
        user.name,
        user.email,
        user.password,
      ]
    );
    res.json(newBody.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// get all threads
app.get('/thread', async (req, res) => {
  try {
    const query = `
      select threads.*, COUNT(likes.id) AS like
      from threads 
      left outer join likes
      on threads.id = likes.thread_id
      group by threads.id;
    `;
    const allThread = await pool.query(query);
    res.json(allThread.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// get user like
app.post('/like', async (req, res) => {
  try {
    const query = {
      text: `
      select id from likes where user_id = $1 and thread_id = $2;
    `,
      params: [
        req.body.userId,
        req.body.threadId,
      ]
    }
    const allThread = await pool.query(query.text, query.params);
    res.json(allThread.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// delete  like
app.delete('/thread/like/:id', async (req, res) => {
  try {
    const query = {
      text: `
      delete from likes where id = $1 RETURNING *;
    `,
      params: [
        req.params.id
      ]
    }
    const allThread = await pool.query(query.text, query.params);
    res.json(allThread.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// get all comments
app.get('/comment/:threadId', async (req, res) => {
  try {
    const threadId = req.params.threadId;
    const allComment = await pool.query("select * from comments where thread_id = $1", [threadId]);
    res.json(allComment.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// get all users
app.get('/user', async (req, res) => {
  try {
    const allUsers = await pool.query("select * from users");
    res.json(allUsers.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// get a thread
app.get('/thread/comments/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const threadQuery = {
      text: `select 
  threads.*,
  coalesce (json_agg(comments), '[]'::json) as comments
from threads
  left outer join comments on threads.id = comments.thread_id
where threads.id = $1
GROUP BY threads.id;`,
      params: [id]
    }
    const allThread = await pool.query(threadQuery.text, threadQuery.params);
    res.json(allThread.rows);
  } catch (err) {
    console.log(err.message);
  }
});
// get a thread
app.get('/thread/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const threadQuery = {
      text: "select * from threads where id = $1",
      params: [id]
    }
    const allThread = await pool.query(threadQuery.text, threadQuery.params);
    res.json(allThread.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// get a thread and comments
app.get('/thread/comments/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const threadQuery = {
      text: `select 
  threads.*,
  coalesce (json_agg(comments), '[]'::json) as comments
from threads
  left outer join comments on threads.id = comments.thread_id
where threads.id = $1
GROUP BY threads.id;`,
      params: [id]
    }
    const allThread = await pool.query(threadQuery.text, threadQuery.params);
    res.json(allThread.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// get a user name
app.get('/user-name', authenticateToken, async (req, res) => {
  try {
    const userName = await getCurrentUserName(req.user);
    console.log(userName);
    res.send({
      name: userName.name,
      id: userName.id,
    });
    // const allThread = await pool.query(threadQuery.text, threadQuery.params);
    // const id = req.params.id;
    // const allThread = await pool.query("select * from users WHERE id = $1", [id]);
    // res.json(allThread.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// update a thread
app.put('/thread/:id', authenticateToken, async (req, res) => {
  try {
    const userId = await getCurrentUserId(req.user);
    if (userId.id !== req.body.user_id) {
      return res.send({message: "編集できません"})
    } else {
      const id = req.params.id;
      const body = req.body;
      const updatedBody = await pool.query(
        "UPDATE threads SET title = $1, description = $2, updated_date = $3 WHERE id = $4 RETURNING *",
        [
          body.title,
          body.description,
          new Date(),
          id
        ]
      );
      res.json(updatedBody.rows[0]);
    }
  } catch (err) {
    console.log(err.message);
  }
});

// update a user
app.put('/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    
    const updatedBody = await pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [
        body.name,
        body.email,
        body.password,
        id
      ]
    );
    res.json(updatedBody.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// update a comment
app.put('/comment/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const userId = await getCurrentUserId(req.user);
    if (userId.id !== req.body.user_id) {
      return res.send({ message: "編集できません" })
    } else {
      const updatedBody = await pool.query(
        "UPDATE comments SET comment = $1, updated_date = $2 WHERE id = $3 RETURNING *",
        [
          body.comment,
          new Date(),
          id,
        ]
      );
      res.json(updatedBody.rows[0]);
    }
  } catch (err) {
    console.log(err.message);
  }
});

// delete a thread
app.delete('/thread/:id', authenticateToken, async (req, res) => {
  try {
    const userId = await getCurrentUserId(req.user);
    if (userId.id !== req.body.user_id) {
      return res.send({ message: "削除できません" })
    } else {
      const id = req.params.id;
      const deleteBody = await pool.query(
        "delete from threads where id = $1 RETURNING *", [id]
      );
      res.json(deleteBody.rows[0]);
    }
  } catch (err) {
    console.log(err.message);
  }
});

// delete a comment
app.delete('/comment/:id', authenticateToken, async (req, res) => {
  try {
    const userId = await getCurrentUserId(req.user);
    if (userId.id !== req.body.user_id) {
      return res.send({ message: "削除できません" })
    } else {
      const id = req.params.id;
      const deleteBody = await pool.query(
        "delete from comments where id = $1 RETURNING *", [id]
      );
      res.json(deleteBody.rows[0]);
    }

  } catch (err) {
    console.log(err.message);
  }
});


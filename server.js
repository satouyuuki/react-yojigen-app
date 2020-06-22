require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const pool = require('./db');
const jwt = require('jsonwebtoken');

// middleware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

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

// app.get('/posts', authenticateToken, (req, res) => {
//   res.json(posts.filter(post => post.name === req.user.name));
// })

app.post('/login', async (req, res) => {
  try {
    const allUsers = await pool.query("select * from users");
    const { email, password } = req.body;

    const currentUser = allUsers.rows.filter(user => user.email === email);
    if (currentUser.length > 0) {
      if (currentUser[0].password === password) {
        const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
        res.send({ accessToken: accessToken });
      } else {
        res.send({message: "passwordが一致しません"})
      }
    } else {
      res.send({message: "メールアドレスが見つかりません"})
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


// create a thread
app.post('/thread', authenticateToken, async (req, res) => {
  try {
    const body = req.body;
    const {id} = await getCurrentUserId(req.user);
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
app.post('/comment', async (req, res) => {
  try {
    const body = req.body;
    const newBody = await pool.query(
      "insert into comments (comment, thread_id, user_id) values ($1, $2, $3) RETURNING *",
      [
        body.comment,
        body.thread_id,
        body.user_id
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
    const body = req.body;
    const newBody = await pool.query(
      "insert into users (name, email, password) values ($1, $2, $3) RETURNING *",
      [
        body.name,
        body.email,
        body.password,
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
    const allThread = await pool.query("select * from threads");
    res.json(allThread.rows);
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
app.get('/thread/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const allThread = await pool.query("select * from threads WHERE id = $1", [id]);
    res.json(allThread.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// get a user
app.get('/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const allThread = await pool.query("select * from users WHERE id = $1", [id]);
    res.json(allThread.rows[0]);
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
app.put('/comment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    
    const updatedBody = await pool.query(
      "UPDATE comments SET comment = $1, updated_date = $2 WHERE id = $3 RETURNING *",
      [
        body.comment,
        new Date(),
        id,
      ]
    );
    res.json(updatedBody.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// delete a thread
app.delete('/thread/:id', authenticateToken, async (req, res) => {
  try {
    const userId = await getCurrentUserId(req.user);
    console.log(userId.id);
    console.log(req.body.user_id);
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
app.delete('/comment/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteBody = await pool.query(
      "delete from comments where id = $1 RETURNING *", [id]
    );
    res.json(deleteBody.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});


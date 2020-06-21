const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const pool = require('./db');

// middleware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Start server port: ${port}`);
});

// ROUTES //

// create a thread
app.post('/thread', async (req, res) => {
  try {
    const body = req.body;
    const newBody = await pool.query(
      "insert into threads (title, description, user_id) values ($1, $2, $3) RETURNING *",
      [
        body.title,
        body.description,
        body.user_id
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
      "insert into users (email, password) values ($1, $2) RETURNING *",
      [
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
app.put('/thread/:id', async (req, res) => {
  try {
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
app.delete('/thread/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteBody = await pool.query(
      "delete from threads where id = $1 RETURNING *", [id]
    );
    res.json(deleteBody.rows[0]);
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


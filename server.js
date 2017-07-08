require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const todoList = require('./controllers/todoList');

app.route('/tasks')
  .get(todoList.list)
  .post(todoList.create);

app.route('/tasks/:taskId')
  .get(todoList.read)
  .put(todoList.update)
  .delete(todoList.remove);

app.listen(port);

console.log(`TODO list RESTful API server started on: ${port}`);

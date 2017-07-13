require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');

//const dbConnector = require('./lokiDataBase').initialize('./dataBase/todo_db.json', 'todoList');
const dbConnector = require('./mongoDataBase').initialize('TodoList');

const todoList = require('./todoList')(dbConnector);

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json());

app.route('/tasks')
  .get(todoList.list)
  .post(todoList.insert);

app.route('/tasks/:taskId')
  .get(todoList.read)
  .put(todoList.update)
  .delete(todoList.remove);

app.listen(port);

console.log(`TODO list RESTful API server started on: ${port}`);

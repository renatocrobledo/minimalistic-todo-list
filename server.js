require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const collectionName = process.env.NODE_ENV === 'test' ? 'TodoList-test' : 'TodoList';
const dbConnector = require('./mongoDataBase').initialize(collectionName);
const todoList = require('./todoList')(dbConnector);
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept');
  next();
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json());

app.use(express.static('public'))

const crud = (action, params, res) => {
  action(params)
    .then(result => res.json(result))
    .catch(err => res.status(400).json(err));
};

app.route('/tasks')
  .get((req, res) => crud(todoList.list, null, res))
  .post((req, res) => crud(todoList.insert, req.body, res));

app.route('/tasks/:taskId')
  .get((req, res) => crud(todoList.read, req.params.taskId, res))
  .put((req, res) => crud(todoList.update, [req.params.taskId, req.body], res))
  .delete((req, res) => crud(todoList.remove, req.params.taskId, res));

app.listen(port);

module.exports = {
  app,
  todoList
};
console.log(`TODO list RESTful API server started on: ${port}`);

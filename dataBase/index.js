const loki = require('lokijs');
const initialize = () => new loki('./dataBase/todo.json');

module.exports = {
  initialize
};

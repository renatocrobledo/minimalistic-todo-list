const db = require('../../dataBase');
db.initialize();

function list(req, res){
 return res.send('list');
}
function create(req, res){
 return 'create';
}
function read(req, res){
 return 'read';
}
function update(req, res){
 return 'update';
}

function remove(req, res){
 return 'delete';
}

module.exports = {
  list,
  create,
  read,
  update,
  remove
};

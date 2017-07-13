module.exports = dbConnector => {
  const list = (req, res) => {
    dbConnector.find().then(result => res.json(result)).catch(err => res.json(err));
  };
  const insert = (req, res) => {
    dbConnector.insert(req.body).then(result => res.json(result)).catch(err => res.json(err));
  };
  const read = (req, res) => {
    dbConnector.get(req.params.taskId).then(result => res.json(result)).catch(err => res.json(err));
  };
  const update = (req, res) => {
    dbConnector.update(req.params.taskId, req.body).then(result => res.json(result)).catch(err => res.json(err));
  };
  const remove = (req, res) => {
    dbConnector.remove(req.params.taskId).then(result => res.json(result)).catch(err => res.json(err));
  };
  return {list, insert, read, update, remove};
}

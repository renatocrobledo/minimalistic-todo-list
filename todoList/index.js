module.exports = dbConnector => {
  return {
    list: dbConnector.find,
    insert: dbConnector.insert,
    read: dbConnector.get,
    update: params => dbConnector.update(...params),
    remove: dbConnector.remove
  };
}

module.exports = dbConnector => {

  const checkTextKey = params => {

    const normalized = Object.assign(params, {
      createdAt: Date.now(),
      status: "new"
    });

    if (!normalized.text) return Promise.reject({error:"Missing text key"});
    return Promise.resolve(normalized);
  }

  const addUpdatedAt = (objectId, data) => {
      const updatedData = Object.assign({updatedAt: Date.now()}, data);
      return Promise.resolve([objectId, updatedData]);
  };

  return {
    list: dbConnector.find,
    insert: params => checkTextKey(params).then(dbConnector.insert),
    read: dbConnector.get,
    update: params => addUpdatedAt(...params).then(params => dbConnector.update(...params)),
    remove: dbConnector.remove,
    removeAll: dbConnector.removeAll
  };
}

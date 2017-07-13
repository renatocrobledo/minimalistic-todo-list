const {MongoClient, ObjectId} = require('mongodb');
const url = process.env.MONGO_DB_URL;

const initialize = collectionName => {

  let db = null;
  let collection = null;

  MongoClient.connect(url, (err, dataBase) => {
    console.info('Connected correctly to mongo-server :)');
    db = dataBase;
    collection = db.collection(collectionName);
  });

  const execute = (action, params, options) => {
    if (!collection[action])
      return Promise.reject(`${action} is not available!`);
    return Promise.resolve(collection[action](...params));
  };

  const extractArrayFromCursor = (cursor) => {
    return new Promise((resolve, reject) => {
      cursor.toArray((err, results) => {
        resolve(results);
      });
    })
  };

  const _objectId = id => ({"_id": new ObjectId(id)});

  return {
    insert: data => execute('insert', [data]),
    find: () => execute('find', [{}]).then(extractArrayFromCursor),
    get: objectId => execute('findOne', [_objectId(objectId)]),
    update: (objectId, data) => execute('updateOne', [_objectId(objectId), data]),
    remove: (objectId) => execute('deleteOne',[_objectId(objectId)])
  };

};

module.exports = {
  initialize
};

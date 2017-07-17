const { MongoClient, ObjectId } = require('mongodb');
const url = process.env.MONGO_DB_URL;

const initialize = collectionName => {

  let db = null;
  let collection = null;

  const _objectId = id => ({ _id: new ObjectId(id) });

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

  const createDocument = (data) => {
    return execute('insert', [data])
      .then(result => {
        return Promise.resolve(result.ops[0]);
      });
  };

  const findAndUpdate = (objectId, data) => {
    return execute('findOne', [_objectId(objectId)])
      .then((obj) => {
        const merge = Object.assign(obj,data);
        delete merge._id;
        return execute('updateOne', [_objectId(objectId), merge]);
    });
  };


  MongoClient.connect(url, (err, dataBase) => {

    if (!err) console.info('Connected correctly to mongo-server :)');
    else return console.log('Error when try to connect to mongo-database!')

    db = dataBase;
    collection = db.collection(collectionName);
  });

  return {
    insert: createDocument,
    update: findAndUpdate,
    find: () => execute('find', [{}]).then(extractArrayFromCursor),
    get: objectId => execute('findOne', [_objectId(objectId)]),
    remove: (objectId) => execute('deleteOne', [_objectId(objectId)])
  };

};

module.exports = {
  initialize
};

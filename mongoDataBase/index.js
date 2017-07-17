const { MongoClient, ObjectId } = require('mongodb');
const url = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/inovation';

const initialize = (collectionName, done) => {

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
        return execute('updateOne', [_objectId(objectId), merge])
          .then(()=> Promise.resolve({message: "Task updated!"}));
    });
  };

  const removeDocument = (objectId) => {

    return execute('deleteOne', [_objectId(objectId)])
            .then(()=> Promise.resolve({message: 'Succesfully removed!'}))

  }

  MongoClient.connect(url, (err, dataBase) => {

    if (err) return console.log('Error when try to connect to mongo-database!');

    db = dataBase;
    collection = db.collection(collectionName);

    if(done) done();
  });

  return {
    insert: createDocument,
    update: findAndUpdate,
    remove: removeDocument,
    find: () => execute('find', [{}]).then(extractArrayFromCursor),
    get: objectId => execute('findOne', [_objectId(objectId)]),
    removeAll: () => execute('remove', [{}])
  };

};

module.exports = {
  initialize
};

const loki = require('lokijs');

const initialize = (path, collectionName) => {

  let collection = null;

  const db = new loki(path, {
    autoload: true,
    autosave: true,
    autosaveInterval: 4000,
    autoloadCallback: () => {
      collection = db.getCollection(collectionName) || db.addCollection(collectionName);
    }
  });

  const removeLokiFields = obj => {
    let cleanObj = {};

    Object.keys(obj).forEach((field) => {
      switch (field) {
        case 'meta':
          cleanObj.createdAt = obj.meta.created;
          break;
        case '$loki':
          cleanObj.objectId = obj.$loki;
          break;
        default:
          cleanObj[field] = obj[field];
      }
    });
    return cleanObj;
  };

  const getCleanJSON = obj => {

    if (obj instanceof Array)
      return obj.map(removeLokiFields);

    return removeLokiFields(obj);
  };


  const execute = (action, params, options) => {
    if (!collection[action])
      return Promise.reject(`${action} is not available!`);
    return Promise.resolve(collection[action](...params)).then(dataObj => {
      if (options.cleanJSON)
        return Promise.resolve(getCleanJSON(dataObj));
      return Promise.resolve(dataObj);
    });
  };

  return {
    find: () => execute('find', [], {'cleanJSON':true}),
    insert: data => execute('insert', [data]),
    get: objectId => execute('get', [parseInt(objectId)]),
    update: (objectId, data) => {
      return execute('get', [parseInt(objectId)]).then((obj) => {
        const dataInfo = Object.assign(obj, data);
        return execute('update', [dataInfo]);
      });
    },
    remove: objectId => {
      return execute('get', [parseInt(objectId)]).then((obj) => {
        return execute('remove', [obj]);
      });
    }
  };
};

module.exports = {
  initialize
}

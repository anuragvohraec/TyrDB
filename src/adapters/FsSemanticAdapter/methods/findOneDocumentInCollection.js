const Collection = require('../../../types/Collection/Collection');
const {find, matches} = require('lodash');

async function findOneDocumentInCollection(tyrInstance, dbName, colName, selector, options){
  const path = `${tyrInstance.options.path}/${dbName}/${colName}`;

  const listDocuments = await Directory.list(path)
  //
  // const documents = this.store.databases[dbName].collections[colName].documents;
  // if(selector.hasOwnProperty('_id')){
  //   const document = documents[selector._id];
    throw new Error('Not implemented')
  // }else{
  //   const document = find(documents,matches(selector));
  //   return document
  // }
};

module.exports = findOneDocumentInCollection;

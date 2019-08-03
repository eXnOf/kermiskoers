//Based on https://github.com/GoogleCloudPlatform/nodejs-getting-started/blob/master/2-structured-data/books/model-datastore.js

'use strict';

var debug = require('debug')('kk-backend:api')

var Koers = require('../domain/koers');
const {Datastore} = require('@google-cloud/datastore');

const ds = new Datastore();
const kind = 'Parcours';

function fromDatastore(obj) {
    
  // debug(JSON.parse(obj._polygonGeoJSON));

    let koers = new Koers(obj[Datastore.KEY].id, JSON.parse(obj._polygonGeoJSON));
    
    return koers;
}
  
function toDatastore(koers, nonIndexed) {
    nonIndexed = nonIndexed || [];
    const results = [];


    results.push({
      name: '_polygonGeoJSON',
      value: JSON.stringify(koers._polygonGeoJSON),
      excludeFromIndexes: true,
  });

    // Object.keys(koers).forEach(k => {
    //   if (koers[k] === undefined) {
    //     return;
    //   }

    //   if(typeof(koers[k]) === "object")
    //   {
    //     results.push({
    //         name: k,
    //         value: JSON.stringify(koers[k]),
    //         excludeFromIndexes: true,
    //       });
    //   }
    //   else {
    //     results.push({
    //         name: k,
    //         value: koers[k],
    //         excludeFromIndexes: nonIndexed.indexOf(k) !== -1,
    //     }); 
    // }
    // });
    return results;
  }

// Lists all books in the Datastore sorted alphabetically by title.
// The ``limit`` argument determines the maximum amount of results to
// return per page. The ``token`` argument allows requesting additional
// pages. The callback is invoked with ``(err, books, nextPageToken)``.
// [START list]
function list(limit, token, cb) {
    const q = ds
      .createQuery([kind])
      .limit(limit)
      //.order('title')
      .start(token);
  
    ds.runQuery(q, (err, entities, nextQuery) => {
      if (err) {
        cb(err);
        return;
      }
      const hasMore =
        nextQuery.moreResults !== Datastore.NO_MORE_RESULTS
          ? nextQuery.endCursor
          : false;
      cb(null, entities.map(fromDatastore), hasMore);
    });
  }
  // [END list]
  
  // Creates a new book or updates an existing book with new data. The provided
  // data is automatically translated into Datastore format. The book will be
  // queued for background processing.
  // [START update]
  function update(id, data, cb) {

    debug('Updating koers %s ------------', id);

    let key;
    if (id) {
      key = ds.key([kind, parseInt(id, 10)]);
    } else {
      key = ds.key(kind);
    }
  
    const entity = {
      key: key,
      data: toDatastore(data, ["_polygonGeoJSON", "_lineGeoJSON"]),
    };
  
    ds.save(entity, err => {
      data.id = entity.key.id;
      cb(err, err ? null : data);
    });
  }
  // [END update]
  
  function create(data, cb) {

    debug('Creating new koers -----------')

    update(null, data, cb);
  }
  
  function read(id, cb) {

    debug('Reading koers with id %s -------', id);

    const key = ds.key([kind, parseInt(id, 10)]);
    ds.get(key, (err, entity) => {
      if (!err && !entity) {
        err = {
          code: 404,
          message: 'Not found',
        };
      }
      if (err) {
        cb(err);
        return;
      }

      cb(null, fromDatastore(entity));
    });
  }
  
  function _delete(id, cb) {
    const key = ds.key([kind, parseInt(id, 10)]);
    ds.delete(key, cb);
  }
  
  // [START exports]
  module.exports = {
    create,
    read,
    update,
    delete: _delete,
    list,
  };
  // [END exports]
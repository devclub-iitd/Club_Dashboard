import {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import {createResponse, createError} from './helper';

const initCRUD = (model: mongoose.Model<mongoose.Document, {}>) => {
  const name = model.collection.collectionName;

  /**
   * POST /
   * Create a document
   */
  const create = (req: Request, res: Response, next: NextFunction) => {
    console.log('CREATE CREATE CREATE');
    console.log(req.body);

    return new Promise<any>((resolve, reject) => {
      console.log('Andar AAye?');
      model
        .create(req.body)
        .then(createdDoc => {
          console.log('Doc bana?');
          if (res.locals.no_send == undefined || res.locals.no_send == false) {
            console.log('or here??');
            res.json(
              createResponse(`${name} created with details:`, createdDoc)
            );
          }
          console.log('you should be here??');

          resolve(createdDoc);
          return createdDoc;
        })
        .catch(err => {
          console.log('Nahi bana?');
          console.log(err);
          reject(err);
          next(err);
        });
    });
  };

  /**
   * GET /:id
   * Get an existing document.
   */
  const get = (req: Request, res: Response, next: NextFunction) => {
    return new Promise<any>((resolve, reject) => {
      model
        .findById(req.params.id)
        .then(doc => {
          if (!doc) {
            next(
              createError(
                404,
                'Not found',
                `${name} does not exist with id ${req.params.id}`
              )
            );

                if (res.locals.no_send == undefined || res.locals.no_send == false) {
            res.json(createResponse(`${name} found with details:`, doc));
          }
          resolve(doc);
          return doc;
        })
        .catch(err => {
          reject(err);
          // return err;
          next(err);
        });
    });
  };

  /**
   * PUT /:id
   * Update an existing document by id .
   */
  const update = (req: Request, res: Response, next: NextFunction) => {
    return new Promise<any>((resolve, reject) => {
      model
        .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then(doc => {
          if (!doc) {
            next(
              createError(
                404,
                'Not found',
                `${name} does not exist with id ${req.params.docid}`
              )
            );
            return doc;
          }
          if (res.locals.no_send == undefined || res.locals.no_send == false) {
            res.json(
              createResponse(`${name} updated with new details as:`, doc)
            );
          }
          resolve(doc);
          return doc;
        })
        .catch(err => {
          reject(err);
          next(err);
        });
    });
  };

  /**
   * GET /
   * Gets all documents
   */
  const all = (_: Request, res: Response, next: NextFunction) => {
    return new Promise<any>((resolve, reject) => {
      model
        .find({})
        .then(docs => {
          if (!docs) {
            next(createError(404, 'Not found', `No ${name}s found`));
            return docs;
          }

          if (res.locals.no_send == undefined || res.locals.no_send == false) {
            res.json(createResponse(`${name} found with details:`, docs));
          }
          resolve(docs);
          return docs;
        })
        .catch(err => {
          reject(err);
          next(err);
        });
    });
  };

  /**
   * GET /
   * Gets all documents by query
   */

  const all_query = (req: Request, res: Response, next: NextFunction) => {
    return new Promise<any>((resolve, reject) => {
      model
        .find(req.body.query)
        .then(docs => {
          if (!docs) {
            next(createError(404, 'Not found', `Not data found`));
            return docs;
          }

          if (res.locals.no_send == undefined || res.locals.no_send == false) {
            res.json(createResponse(`${name} found with details:`, docs));
          }
          resolve(docs);
          return docs;
        })
        .catch(err => {
          reject(err);
          next(err);
        });
    });
  };

  /**
   * POST /
   * Deletes all documents
   */

  const all_delete = (_: Request, res: Response, next: NextFunction) => {
    return new Promise<any>((resolve, reject) => {
      model
        .remove({})
        .then((_: any) => {
          if (res.locals.no_send == undefined || res.locals.no_send == false) {
            res.json(createResponse(`data removed:`, ''));
          }
          resolve();
        })
        .catch(err => {
          reject(err);
          next(err);
        });
    });
  };

  /**
   * POST /
   * Deletes all documents by the query supplied
   */
  const delete_query = (req: Request, res: Response, next: NextFunction) => {
    return new Promise<number>((resolve, reject) => {
      if (req.body.query == undefined) {
        reject();

        if (res.locals.no_send == undefined || res.locals.no_send == false) {
          next(createError(400, 'Query not provided to delete', ''));
        }
        return;
      }

      model
        .deleteMany(req.body.query)
        .then(result => {
          if (res.locals.no_send == undefined || res.locals.no_send == false) {
            if (result.deletedCount != 0) {
              res.json(createResponse('Data removed', ''));
            } else {
              res.json(createResponse('No data removed', ''));
            }
          }
          resolve(result.deletedCount);
        })
        .catch(err => {
          reject(err);
          next(err);
        });
    });
  };

  return [create, get, update, all, all_query, all_delete, delete_query];
};

export default initCRUD;

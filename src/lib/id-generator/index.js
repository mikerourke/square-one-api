/* @flow */

/* External dependencies */
import moment from 'moment';

let entityModel;

/**
 * Gets the last ID number in the table for the corresponding model and breaks
 *    it down into each aspect.  The prefix represents the entity type, the
 *    date represents the day, month, and year the record was created, and
 *    the sequence is an arbitrary counter for the current day.
 * @returns {Promise} Promise with the ID elements as the resolution.
 */
const getElementsOfLastId = (): Promise<*> =>
  new Promise((resolve, reject) => {
    entityModel.max('id')
      .then((max) => {
        const maxId = max.toString();
        const idElements = {
          prefix: maxId.substring(0, 3),
          dateCreated: maxId.substring(3, 9),
          sequence: maxId.substring(9),
        };
        resolve(idElements);
      })
      .catch(error => reject(new Error(error)));
  });

/**
 * Constructs the next ID number based on the elements of the last ID number.
 *    If no elements are supplied, the ID number is build from the model
 *    properties.
 * @param {string} [prefix=''] Prefix based on the entity type.  If not
 *    specified, it's pulled from the model's getPrefix() method.
 * @param {string} [dateCreated=''] Date the last entity was created in the
 *    format 'YYMMDD'.  If not specified it defaults to today's date.
 * @param {string} [sequence=''] Sequence of the last created entity.  If not
 *    specified, the next sequence number will be 1 for the new entity.
 * @returns {number} Next ID number of the entity.
 */
const buildNextId = (
  prefix?: string = '',
  dateCreated?: string = '',
  sequence?: string = '',
): number => {
  const dateForId = moment().format('YYMMDD');

  // 1 will be added to the final result, that's why the sequence is set to
  // all zeroes.
  let sequenceForId = '0000';
  if (dateForId === dateCreated) {
    sequenceForId = sequence;
  }

  // The prefix is extrapolated from the ID number of the last entity created
  // in the database.  If not specified, each model has a getPrefix() method
  // that returns the prefix for the entity.
  let prefixForId = prefix;
  if (prefixForId === '') {
    prefixForId = entityModel.getPrefix();
  }

  // To ensure the ID ends up in the correct format (i.e. 1011701010001), the
  // value is created as a string first, then converted to a number and
  // incremented by 1.
  const idString = `${prefixForId}${dateForId}${sequenceForId}`;
  return (+idString + 1);
};

/**
 * Calculates the next ID number for the corresponding entity model.
 * @returns {Promise} Promise with the next ID number as the resolution.
 */
const calculateNextId = (): Promise<*> =>
  new Promise((resolve, reject) => {
    getElementsOfLastId()
      .then((idElements) => {
        const { prefix, dateCreated, sequence } = idElements;
        const nextId = buildNextId(prefix, dateCreated, sequence);
        resolve(nextId);
      })
      .catch(error => reject(new Error(error)));
  });

/**
 * Public method for calculating the next ID number.
 * @param {Object} modelForEntity Sequelize model for querying database.
 * @returns {Promise} Promise with the next ID number as the resolution.
 */
const getNextIdNumber = (modelForEntity: Object): Promise<*> =>
    new Promise((resolve, reject) => {
      // The Sequelize model is used by multiple methods in this file.  A
      // local instance of the model is set to avoid passing it into each
      // function as a parameter.
      entityModel = modelForEntity;

      // The database table for the specified model is queried to see if any
      // records are present.  If no records were found, an ID number is
      // built from scratch.
      calculateNextId()
        .then((nextId) => {
          if (isNaN(nextId)) {
            const idToUse = buildNextId();
            resolve(idToUse);
          } else {
            resolve(nextId);
          }
        })
        .catch(error => reject(new Error(error)));
    });

export default getNextIdNumber;
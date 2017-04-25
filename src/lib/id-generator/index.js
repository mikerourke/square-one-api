/* @flow */

/* External dependencies */
import moment from 'moment';

let entityModel;

/**
 * Gets the last ID number in the table for the corresponding model and breaks
 *      it down into each aspect.  The prefix represents the entity type, the
 *      date represents the day, month, and year the record was created, and
 *      the sequence is an arbitrary counter for the current day.
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
            .catch(error => reject(error));
    });

/**
 * Calculates the next ID number for the corresponding entity model.
 * @returns {Promise} Promise with the next ID number as the resolution.
 */
const calculateNextId = (): Promise<*> =>
    new Promise((resolve, reject) => {
        getElementsOfLastId()
            .then((idElements) => {
                const { prefix, dateCreated, sequence } = idElements;
                const dateForId = moment().format('YYMMDD');
                let sequenceForId = '0000';
                if (dateForId === dateCreated) {
                    sequenceForId = sequence;
                }
                const idString = `${prefix}${dateForId}${sequenceForId}`;
                const lastIdNumber = +idString;
                resolve(lastIdNumber + 1);
            })
            .catch(error => reject(error));
    });

/**
 * Public method for calculating the next ID number.
 * @param {Object} modelForEntity Sequelize model for querying database.
 * @returns {Promise} Promise with the next ID number as the resolution.
 */
const getNextIdNumber = (modelForEntity: Object): Promise<*> =>
    new Promise((resolve, reject) => {
        entityModel = modelForEntity;
        calculateNextId()
            .then(nextId => resolve(nextId))
            .catch(error => reject(error));
    });

export default getNextIdNumber;
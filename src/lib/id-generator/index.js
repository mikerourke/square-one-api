/* @flow */

let entityModel;

/**
 * Ensures the date element that is part of the ID number is two digits long,
 *      so if the current month is April (4), the ID number will have '04' in
 *      the month placeholder.
 * @param {string} dateElement Month or day to update (if required).
 * @returns {string} Month or day with two digits.
 */
const getTwoDigitDate = (dateElement: string): string => {
    if (dateElement.length === 1) {
        return `0${dateElement}`;
    }
    return dateElement;
};

/**
 * Returns the date portion of the ID number based on the current date in the
 *      format YYMMDD.  This is the part of the ID after the 3 digit prefix,
 *      so 4/20/2017 would be 170420 in the ID number.
 * @returns {string} Date portion of the ID number.
 */
export const currentDateIdElement = (): string => {
    const dateForFormat = new Date();
    const twoDigitYear = dateForFormat.getFullYear().toString();
    const currentMonth = (dateForFormat.getMonth() + 1).toString();
    const currentDay = dateForFormat.getDate().toString();

    const yearForId = twoDigitYear.substring(2, 4);
    const monthForId = getTwoDigitDate(currentMonth);
    const dayForId = getTwoDigitDate(currentDay);

    return `${yearForId}${monthForId}${dayForId}`;
};

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
                const dateForId = currentDateIdElement();
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
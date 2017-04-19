/* @flow */

/* Internal dependencies */
import models from '../../models';

let entityModel;
let specifiedPrefix;

const currentDateIdElement = () => {
    const dateForFormat = new Date();
    const twoDigitYear = dateForFormat.getFullYear().substring(2, 3);
    const currentMonth = (dateForFormat.getMonth() + 1);
    const currentDay = dateForFormat.getDate();
    return `${twoDigitYear}${currentMonth}${currentDay}`;
};

const getElementsOfLastId = () => new Promise((resolve, reject) => {
    entityModel.max('id')
        .then((lastId) => {
            const idElements = {
                prefix: lastId.substring(0, 3),
                dateCreated: lastId.substring(3, 9),
                sequence: lastId.substring(9),
            };
            resolve(idElements);
        })
        .catch(error => reject(error));
});

const calculateNextId = () => new Promise((resolve, reject) => {
    getElementsOfLastId()
        .then((idElements) => {
            const { prefix, dateCreated, sequence } = idElements;
            const dateForId = currentDateIdElement();
            let sequenceForId = '0000';
            if (dateForId === dateCreated) {
                sequenceForId = sequence;
            }
            const idString = `${prefix}${dateForId}${sequenceForId}`;
            resolve(+idString);
        })
        .catch(error => reject(error));
});

const getNextIdNumber = (idPrefix, modelName) =>
    new Promise((resolve, reject) => {
        entityModel = models[modelName];
        specifiedPrefix = idPrefix;
        calculateNextId()
            .then(nextId => resolve(nextId))
            .catch(error => reject(error));
    });

export default getNextIdNumber;
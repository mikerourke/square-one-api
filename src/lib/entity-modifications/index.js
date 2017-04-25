/* @flow */

/* Internal dependencies */
import models from '../../models';

/* Types */
type ModifyingUser = {
    id: number,
    username: string,
    fullName: string,
};

type Entity = {
    createdBy: number | ModifyingUser,
    updatedBy: number | ModifyingUser,
};

const updateEntityModifier = (
    entity: Entity,
    field: string,
    modifier: ModifyingUser,
): void => {
    entity[field] = {
        id: modifier.id,
        username: modifier.username,
        fullName: modifier.fullName,
    };
};

export const transformModifiers = (
    users: Array<Object>,
    entity: Entity,
): Object => {
    const creator = users.find(user => +user.id === +entity.createdBy);
    if (creator) {
        updateEntityModifier(entity, 'createdBy', creator);
    }
    const updater = users.find(user => +user.id === +entity.updatedBy);
    if (updater) {
        updateEntityModifier(entity, 'updatedBy', updater);
    }
    return entity;
};

const transformChildModifiers = (users: Array<Object>, entity: Entity) => {
    Object.entries(entity).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            const childEntities = value;
            entity[key] = childEntities.map(childEntity =>
                transformModifiers(users, childEntity));
        }
    });
    return entity;
};

export const getTransformedModifiers = (
    dataToTransform: entity | Array<Entity>,
): Promise<*> => new Promise((resolve, reject) => {
    if (!dataToTransform) {
        resolve();
    }
    const { User } = (models: Object);
    User.findAll()
        .then((users) => {
            const isDataArray = (Array.isArray(dataToTransform));
            let entities = dataToTransform;
            if (!isDataArray) {
                entities = [dataToTransform];
            }
            const transformedData = entities.map((entity) => {
                transformChildModifiers(users, entity);
                return transformModifiers(users, entity);
            });
            if (!isDataArray) {
                resolve(transformedData[0]);
            } else {
                resolve(transformedData);
            }
        })
        .catch(error => reject(error));
});

export const getFieldsForUpdate = (entity: Object): Array<string> => 
    Object.keys(entity).filter(key => !key.includes('At'));

export const getFieldsForCreate = (entity: Object): Array<string> =>
    getFieldsForUpdate(entity).concat(['id']);
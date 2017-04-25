/* @flow */

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

export const getBulkTransformedModifiers = (
    entities: Array<Entity>,
): Promise<*> => new Promise((resolve, reject) => {
    const { User } = (models: Object);
    User.findAll()
        .then((users) => {
            const transformedEntities = entities.map(entity =>
                transformModifiers(users, entity));
            resolve(transformedEntities);
        })
        .catch(error => reject(error));
});

export const getSingleTransformedModifiers = (
    entity: Entity,
): Promise<*> => new Promise((resolve, reject) => {
    const { User } = (models: Object);
    User.findAll()
        .then((users) => {
            const transformedEntity = transformModifiers(users, entity);
            resolve(transformedEntity);
        })
        .catch(error => reject(error));
});
/* @flow */

/* Internal dependencies */
import models from '../../models';

/* Types */
export type ModifyingUser = {
  id: number,
  username?: string,
  fullName?: string,
};

export type Entity = {
  id?: number,
  createdBy?: number | ModifyingUser,
  updatedBy?: number | ModifyingUser,
};

/**
 * Sets the value of the specified field to an object representing the user
 *    that created or updated the record.
 *
 * @param {Entity} entity Entity instance to update.
 * @param {string} field Name of the field with replacement value.
 * @param {ModifyingUser} modifier User that modified the record.
 */
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

/**
 * Finds the user associated with the ID number for the createdBy and updatedBy
 *    fields in the entity, and replaces the ID number with an object
 *    representing the user that made changes to the record.
 * @param {Array} users Array of users from the database.
 * @param {Entity} entity Entity instance to update.
 * @returns {Entity} Entity with updated fields.
 */
const transformModifiers = (
    users: Array<Object>,
    entity: Entity,
): Entity => {
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

/**
 * Determines if the specified entity has any associated child entities, and
 *    transforms the modifier data for those entities.
 * @param {Array} users Array of users from the database.
 * @param {Entity} parentEntity Parent entity with children.
 * @returns {Entity} Updated parent entity.
 */
const transformChildModifiers = (
    users: Array<Object>,
    parentEntity: Entity,
): Entity => {
  Object.entries(parentEntity).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      parentEntity[key] = value.map((childEntity: any) =>
       transformModifiers(users, childEntity));
    }
  });
  return parentEntity;
};

/**
 * Performs the modifier transformation for the specified entity/entities and
 *    returns updated data with the user ID replaced with user objects.
 * @param {Entity|Array} dataToTransform Single entity or array of entities to 
 *    transform.
 * @returns {Promise} Promise with updated data as the resolution.
 */
export const getTransformedModifiers = (
    dataToTransform: Entity | Array<Entity>,
): Promise<*> => new Promise((resolve, reject) => {
  /*
   * It's possible that the find operation that is called before this
   * method returned nothing.  If that's the case, the promise needs to be
   * resolved to ensure continued execution.
   */
  if (!dataToTransform) {
    resolve();
  }
  // The user records need to be pulled from the database to extract data.
  const { User } = (models: Object);
  User.findAll()
    .then((users) => {
      // If only one entity was found, add to an array of 1 element to
      // avoid writing duplicate code to perform transformation.
      const isDataArray = (Array.isArray(dataToTransform));
      let entities: Array<Entity> = [];
      if (Array.isArray(dataToTransform)) {
        entities = dataToTransform;
      } else {
        entities = Array.of(dataToTransform);
      }

      const transformedData = entities.map((entity) => {
        transformChildModifiers(users, entity);
        return transformModifiers(users, entity);
      });

      // If only 1 entity was passed in as an argument, return a single
      // object, rather than an array of 1 object.
      if (!isDataArray) {
        resolve(transformedData[0]);
      } else {
        resolve(transformedData);
      }
    })
    .catch(error => reject(new Error(error)));
});

/**
 * Loops through the fields in the entity and return an array of values that
 *    should be passed in to the update action for a Model instance.
 * @param {Entity} entity Entity to get fields for.
 * @returns {Array} Array of fields for update action.
 */
export const getFieldsForUpdate = (entity: Entity): Array<string> => 
  Object.keys(entity).filter(key => !key.includes('At') && key !== 'id');

/**
 * Loops through the fields in the entity and return an array of values that
 *    should be passed in to the create action for a Model instance.
 * @param {Entity} entity Entity to get fields for.
 * @returns {Array} Array of fields for create action.
 */
export const getFieldsForCreate = (entity: Entity): Array<string> =>
  getFieldsForUpdate(entity).concat(['id']);
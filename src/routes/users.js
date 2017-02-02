/**
 * Assigns routes for User entities to the application router.
 */
import models from '../models';

const notFoundMessage = { message: 'User not found' };

/**
 * Creates an object representing the where conditions to find the corresponding
 *      user using a Sequelize query.
 * @param {Object} entity Entity containing the data to build the condition.
 * @returns {Object} Condition object passed to Sequelize.
 */
const whereCondition = (entity) => {
    return {
        username: entity.username,
    };
};

/**
 * Assigns routes to the Express Router instance associated with User models.
 * @param {Object} router Express router that routes are assigned to.
 */
export default (router) => {
    router
        .route('/users/:username')
        .get((req, res) => {
            return models.User
                .findOne({
                    where: whereCondition(req.params),
                })
                .then((user) => {
                    if (!user) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(user);
                })
                .catch(error => res.status(400).send(error));
        })
        .patch((req, res) => {
            return models.User
                .findOne({
                    where: whereCondition(req.params),
                })
                .then((user) => {
                    if (!user) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return user
                        .update(req.body)
                        .then(() => res.status(200).send(user))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        });

    router
        .route('/users/:username/login')
        .patch((req, res) => {
            return models.User
                .findOne({
                    where: whereCondition(req.params),
                })
                .then((user) => {
                    if (!user) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return user
                        // TODO: Add authentication for login action.
                        .update({ isLoggedIn: true })
                        .then(() => res.status(200).send(user))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        });

    router
        .route('/users/:username/logout')
        .patch((req, res) => {
            return models.User
                .findOne({
                    where: whereCondition(req.params),
                })
                .then((user) => {
                    if (!user) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return user
                        .update({ isLoggedIn: false })
                        .then(() => res.status(200).send(user))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        });
};
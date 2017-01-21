/**
 * Assigns routes for Setting entities to the application router.
 */
import models from '../models';

const notFoundMessage = { message: 'Setting not found' };

/**
 * Creates an object representing the where conditions to find the corresponding
 *      setting using a Sequelize query.
 * @param {Object} entity Entity containing the data to build the condition.
 * @returns {Object} Condition object passed to Sequelize.
 */
const whereCondition = (entity) => {
    return {
        category: entity.category,
        groupName: entity.groupName,
    };
};

const populatedSetting = (requestBody) => {
    const settingWithContents = {};
    Object.keys(requestBody).forEach((key) => {
        settingWithContents[key] = requestBody[key];
    });
    return settingWithContents;
};

/**
 * Assigns routes to the Express Router instance associated with Setting models.
 * @param {Object} router Express router that routes are assigned to.
 */
export default (router) => {
    router
        .route('/settings/')
        .get((req, res) => {
            return models.Setting
                .findAll()
                .then((settings) => {
                    if (!settings) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(settings);
                })
                .catch(error => res.status(400).send(error));
        })
        .post((req, res) => {
            const newSetting = populatedSetting(req.body);
            return models.Setting
                .upsert(newSetting)
                .then((wasCreated) => {
                    const settingToSend = Object.assign(
                        {},
                        newSetting,
                        { action: wasCreated ? 'created' : 'updated' },
                    );
                    res.status(201).send(settingToSend);
                })
                .catch(error => res.status(400).send(error));
        });

    router
        .route('/settings/:category/:groupName')
        .get((req, res) => {
            return models.Setting
                .findOne({
                    attributes: ['data'],
                    where: whereCondition(req.params),
                })
                .then((setting) => {
                    if (!setting) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(setting.data);
                })
                .catch(error => res.status(400).send(error));
        })
        .patch((req, res) => {
            return models.Setting
                .findOne({
                    where: whereCondition(req.params),
                })
                .then((setting) => {
                    if (!setting) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return setting
                        .update(req.body)
                        .then(() => res.status(200).send(setting))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        });
};

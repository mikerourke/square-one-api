import models from '../models';

const notFoundMessage = { message: 'Setting not found' };

export default (router) => {
    router
        .route('/settings/:category/:groupName')
        .get((req, res) => {
            return models.Setting
                .findAll({
                    attributes: ['data'],
                    where: {
                        category: req.params.category,
                        groupName: req.params.groupName,
                    },
                })
                .then(settings => {
                    if (!settings) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(settings);
                })
                .catch(error => res.status(400).send(error));
        })
        .patch((req, res) => {
            return models.Setting
                .find({
                    where: {
                        category: req.params.category,
                        groupName: req.params.groupName,
                    },
                })
                .then(settings => {
                    if (!settings) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return settings
                        .update(req.body)
                        .then(() => res.status(200).send(settings))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        })
};
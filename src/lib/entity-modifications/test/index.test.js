/* Internal dependencies */
import db from '../../../models';
import { validLead } from '../../../models/test/helpers';
import {
    getFieldsForCreate,
    getFieldsForUpdate,
    getTransformedModifiers
} from '../index';

const validChange = {
    // parentId: 0,
    changeType: 'add',
    iconName: 'circle_add',
    title: 'Title of Change',
    details: 'This is a change for testing.',
    createdBy: 1,
    updatedBy: 1,
};

describe('Entity Modifications', () => {
    let changeFromDb;

    before((done) => {
        db.sequelize.sync().then(() => {
            db.Lead.create(validLead)
                .then((lead) => {
                    const changeToCreate = { ...validChange, parentId: lead.id };
                    db.Change.create(changeToCreate)
                        .then((change) => {
                            changeFromDb = change;
                            done();
                        })
                        .catch(error => done(error));
                })
                .catch(error => done(error));
            })
            .catch(error => done(error));
    });

    const expectedFields = [
        'parentId',
        'changeType',
        'iconName',
        'title',
        'details',
        'createdBy',
        'updatedBy',
    ];

    it('gets the correct fields for create', (done) => {
        const changeWithFields = Object.assign({}, changeFromDb.dataValues, {
            parentId: 0,
        });
        const actualResult = getFieldsForCreate(changeWithFields).sort();
        const expectedResult = expectedFields.concat(['id']).sort();
        expect(actualResult).to.eql(expectedResult);
        done();
    });

    it('gets the correct fields for update', (done) => {
        const changeWithFields = Object.assign({}, changeFromDb.dataValues, {
            parentId: 0,
        });
        const actualResult = getFieldsForUpdate(changeWithFields).sort();
        expect(actualResult).to.eql(expectedFields.sort());
        done();
    });

    it('transforms child modifiers', (done) => {
        getTransformedModifiers(changeFromDb)
            .then((transformedChange) => {
                const { createdBy, updatedBy } = transformedChange;
                const expectedResult = {
                    id: 1,
                    username: 'mike',
                    fullName: 'Mike Testing'
                };
                expect(createdBy).to.eql(expectedResult);
                expect(updatedBy).to.eql(expectedResult);
                done();
            })
            .catch(error => done(error));
    });

    it('gracefully handles transforming invalid modifiers', (done) => {
        // 999 is an arbitrary number, it is used to ensure the user ID doesn't
        // actually exist.
        const userId = 999;
        const invalidChange = Object.assign({}, changeFromDb, {
            createdBy: userId,
            updatedBy: userId
        });
        getTransformedModifiers(invalidChange)
            .then((transformedChange) => {
                const { createdBy, updatedBy } = transformedChange;
                expect(createdBy).to.equal(userId);
                expect(updatedBy).to.equal(userId);
                done();
            })
            .catch(error => done(error));
    });
});
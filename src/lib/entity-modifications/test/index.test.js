/* Internal dependencies */
import db from '../../../models';
import {
    getFieldsForCreate,
    getFieldsForUpdate,
    getTransformedModifiers
} from '../index';

describe('Entity Modifications', () => {
    let changeFromDb;

    before((done) => {
        db.sequelize.sync().then(() => {
            db.Change.findOne({ where: { id: 1021704260001 } })
                .then((change) => {
                    changeFromDb = change;
                    done();
                }).catch(err => done(err));
        }).catch(err => done(err));
    });

    const expectedFields = [
        'parentId',
        'changeType',
        'iconName',
        'title',
        'details',
        'createdBy',
        'updatedBy'
    ];

    it('gets the correct fields for create', (done) => {
        const changeWithFields = Object.assign({}, changeFromDb.dataValues, {
            parentId: 0,
        });
        const actualResult = getFieldsForCreate(changeWithFields);
        const expectedResult = expectedFields.concat(['id']);
        expect(actualResult).to.eql(expectedResult);
        done();
    });

    it('gets the correct fields for update', (done) => {
        const changeWithFields = Object.assign({}, changeFromDb.dataValues, {
            parentId: 0,
        });
        const actualResult = getFieldsForUpdate(changeWithFields);
        const expectedResult = expectedFields;
        expect(actualResult).to.eql(expectedResult);
        done();
    });

    it('transforms child modifiers', (done) => {
        getTransformedModifiers(changeFromDb)
            .then((transformedChange) => {
                const { createdBy, updatedBy } = transformedChange;
                const expectedResult = {
                    id: 1,
                    username: 'mike',
                    fullName: 'Mike Tester'
                };
                expect(createdBy).to.eql(expectedResult);
                expect(updatedBy).to.eql(expectedResult);
                done();
            }).catch(err => done(err));
    });

    it('gracefully handles transforming invalid modifiers', (done) => {
        const invalidChange = Object.assign({}, changeFromDb, {
            createdBy: 2,
            updatedBy: 2
        });
        getTransformedModifiers(invalidChange)
            .then((transformedChange) => {
                const { createdBy, updatedBy } = transformedChange;
                expect(createdBy).to.equal(2);
                expect(updatedBy).to.equal(2);
                done();
            }).catch(err => done(err));
    });
});
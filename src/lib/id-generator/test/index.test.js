/* External dependencies */
import SequelizeMock from 'sequelize-mock';

/* Internal dependencies */
import getNextIdNumber, { currentDateIdElement } from '../index';

let LeadMock;

const getIdForTesting = () => {
    const dateElements = currentDateIdElement();
    const idAsString = `101${dateElements}0001`;
    return +idAsString;
};

describe('ID Generator', () => {
    before((done) => {
        const idForTesting = getIdForTesting();
        const dbMock = new SequelizeMock();
        LeadMock = dbMock.define('lead', {
            id: idForTesting,
            name: ''
        });
        done();
    });

    it('should generate the next ID number', (done) => {
        const expectedId = getIdForTesting() + 1;
        getNextIdNumber(LeadMock).should.eventually.equal(expectedId)
            .notify(done);
    })
});
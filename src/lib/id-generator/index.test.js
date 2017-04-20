import SequelizeMock from 'sequelize-mock';

import getNextIdNumber from './index';

let LeadMock;

describe('ID Generator', () => {
    before(() => {
        const dbMock = new SequelizeMock();
        LeadMock = dbMock.define('lead', {
            id: 1011704200001,
            name: 'John Test'
        });
        LeadMock.create({
            id: 1011704200001,
            name: 'John Test'
        });
    });

    it('should generate the next ID number', (done) => {
        getNextIdNumber(LeadMock).should.eventually.equal(1011704200002)
            .notify(done);
    })
});
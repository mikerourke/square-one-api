/* Internal dependencies */
import db from '../../../models';
import { validLead, getIdForToday } from '../../../models/test/helpers';
import getNextIdNumber from '../index';

const deleteAllLeads = () => new Promise((resolve, reject) => {
  db.Lead.destroy({ where: {} })
    .then(() => resolve())
    .catch(error => reject(new Error(error)));
});

describe('ID Generator', () => {
  before((done) => {
    db.sequelize.sync()
      .then(() => {
        deleteAllLeads().then(() => done()).catch(error => done(error));
      })
      .catch(error => done(error));
  });

  after((done) => {
    deleteAllLeads().then(() => done()).catch(error => done(error));
  });

  it('generates the next ID for a model', (done) => {
    const expectedId = getIdForToday();
    getNextIdNumber(db.Lead)
      .then((nextId) => {
        expect(nextId).to.equal(expectedId);
        done();
      })
      .catch(error => done(error));
  });

  it('generates the next ID number before Lead creation', (done) => {
    const expectedId = getIdForToday();
    db.Lead.create(validLead)
      .then((lead) => {
        expect(+lead.id).to.equal(expectedId);
        done();
      })
      .catch(error => done(error));
  })
});
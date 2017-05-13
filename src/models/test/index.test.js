/* Internal dependencies */
import db from '../index';

describe('Models', () => {
  before((done) => {
    db.sequelize.sync().then(() => done()).catch(error => done(error));
  });

  it('returns the user model', () => {
    expect(db.User).to.not.be.undefined;
  });
});

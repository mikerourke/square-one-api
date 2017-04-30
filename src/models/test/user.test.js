/* Internal dependencies */
import db from '../index';

describe('User Model', () => {
    let user;
    const userInstance = {
        username: 'tester',
        fullName: 'John Testinghouse',
        phone: '1234567890',
        email: 'jt@website.com',
        title: 'Test Person',
        isLoggedIn: false,
        role: 'admin',
        password: '1234567',
        passwordConfirmation: '1234567',
    };

    before((done) => {
        db.sequelize.sync().then(() => done());
    });

    describe('User Field Validation', () => {
        beforeEach(() => {
            user = {};
            user = db.User.build(userInstance);
        });

        it('is valid', (done) => {
            user.validate()
                .should.eventually.not.equal(undefined)
                .notify(done);
        });

        it('must have a username', (done) => {
            user.username = '   ';
            user.validate()
                .should.eventually.not.equal(undefined)
                .notify(done);
        });

        it('must have an email', (done) => {
            user.email = '   ';
            user.validate()
                .should.eventually.not.equal(undefined)
                .notify(done);
        });

        it('username cannot be too long', (done) => {
            user.username = 'a'.repeat(16);
            user.validate()
                .should.eventually.not.equal(undefined)
                .notify(done);
        });

        it('email cannot be too long', (done) => {
            user.email = 'a'.repeat(244) + '@example.com';
            user.validate()
                .should.eventually.not.equal(undefined)
                .notify(done);
        });

        const validAddresses = [
            'user@example.com', 
            'USER@foo.COM', 
            'A_US-ER@foo.bar.org', 
            'first.last@foo.jp', 
            'alice+bob@baz.cn'
        ];
        validAddresses.forEach((validAddress) => {
            it(`email accepts valid address: ${validAddress}`, (done) => {
                user.email = validAddress;
                user.validate()
                    .should.eventually.equal(null)
                    .notify(done);
            });
        });

        const invalidAddresses = [
            'user@example,com', 
            'USER_stuff_at_foo.COM', 
            'first.last@foo.', 
            'alice+bob@bar+baz.cn'
        ];
        invalidAddresses.forEach((invalidAddress) => {
            it(`email rejects invalid address: ${invalidAddress}`,
                (done) => {
                    user.email = invalidAddress;
                    user.validate()
                        .should.eventually.not.equal(undefined)
                        .notify(done);
            });
        });

        

        it('password is present (nonblank)', (done) => {
            user.password = user.passwordConfirmation = ' '.repeat(6);
            user.validate()
                .should.eventually.not.equal(undefined)
                .notify(done);
        });

        it('password has a minimum length', (done) => {
            user.password = user.passwordConfirmation = ' '.repeat(5);
            user.validate()
                .should.eventually.not.equal(undefined)
                .notify(done);
        });
    });

    it('encrypts the password', (done) => {
        const digest = '$2a$10$gYpgjraxgEtUl8MfyzHvZuOFAaPjagx' +
                       '9en550HCthZALRS1BWqWKa';
        db.User.findOne({
            where: {
                email: 'jt@website.com',
            }
        }).then(result => {
            expect(result.passwordDigest).to.equal(digest);
            done();
        }).catch(err => done());
    });

    describe('User Password Validation', () => {
        it('authenticates the user', (done) => {
            db.User.create(userInstance)
                .then(user => {
                    user.authenticate('7654321')
                        .should.eventually.equal('Invalid password')
                        .notify(done);
                })
                .catch(err => done());
        })
    })
});

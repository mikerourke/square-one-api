import { assert, expect, should } from 'chai';
import models from '../index';

/* eslint-disable */

describe('User Model', () => {
    let user;
    const userInstance = {
        username: 'tester',
        firstName: 'John',
        lastName: 'Testinghouse',
        email: 'jt@website.com',
        title: 'Test Person',
        password: '1234567',
        passwordConfirmation: '1234567',
    }

    before(() => {
        models.User.destroy({
            where: {},
        });
    })

    describe('User Field Validation', () => {
        beforeEach(() => {
            user = models.User.build(userInstance);
        })

        it('is valid', (done) => {
            user.validate().should.eventually.not.equal(undefined).notify(done);
        });

        it('must have a username', (done) => {
            user.username = '   ';
            user.validate().should.eventually.not.equal(undefined).notify(done);
        });

        it('must have an email', (done) => {
            user.email = '   ';
            user.validate().should.eventually.not.equal(undefined).notify(done);
        });

        it('username should not be too long', (done) => {
            user.username = 'a'.repeat(16);
            user.validate().should.eventually.not.equal(undefined).notify(done);
        });

        it('email should not be too long', (done) => {
            user.email = 'a'.repeat(244) + '@example.com';
            user.validate().should.eventually.not.equal(undefined).notify(done);
        });

        const validAddresses = [
            'user@example.com', 
            'USER@foo.COM', 
            'A_US-ER@foo.bar.org', 
            'first.last@foo.jp', 
            'alice+bob@baz.cn'
        ];
        validAddresses.forEach((validAddress) => {
            it(`email should accept valid address: ${validAddress}`, (done) => {
                user.email = validAddress;
                user.validate().should.eventually.equal(null).notify(done);
            });
        })

        const invalidAddresses = [
            'user@example,com', 
            'USER_stuff_at_foo.COM', 
            'first.last@foo.', 
            'alice+bob@bar+baz.cn'
        ];
        invalidAddresses.forEach((invalidAddress) => {
            it(`email should reject invalid address: ${invalidAddress}`, 
                (done) => {
                    user.email = invalidAddress;
                    user.validate().should.eventually.not.equal(undefined)
                        .notify(done);
            });
        })

        it('email addresses should be unique', (done) => {
            const duplicateUser = user;
            user.save()
                .then(() => {
                    duplicateUser.save().should.eventually.not.equal(undefined)
                        .notify(done);
                })
                .catch(error => done());
        });

        it('password should be present (nonblank)', (done) => {
            user.password = user.passwordConfirmation = ' '.repeat(6);
            user.validate().should.eventually.not.equal(undefined).notify(done);
        });

        it('password should have a minimum length', (done) => {
            user.password = user.passwordConfirmation = ' '.repeat(5);
            user.validate().should.eventually.not.equal(undefined).notify(done);
        });
    });

    it('should encrypt the password', (done) => {
        const digest = '$2a$10$gYpgjraxgEtUl8MfyzHvZuOFAaPjagx' +
                       '9en550HCthZALRS1BWqWKa'
        models.User.findOne({
            where: {
                email: 'jt@website.com',
            }
        }).then(result => {
            expect(result.passwordDigest).to.equal(digest);
            done();
        }).catch(error => {
            done();
        });
    });

    describe('User Password Validation', () => {
        it('should authenticate the user', (done) => {
            models.User.create(userInstance)
                .then(user => {
                    user.authenticate('7654321')
                        .should.eventually.equal('Invalid password')
                        .notify(done);
                })
                .catch(error => {
                    done();
                });
        })
    })
});

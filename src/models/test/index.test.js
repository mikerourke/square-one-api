import { expect } from 'chai';
import models from '../index';

/* eslint-disable */

describe('Models', () => {
    it('returns the user model', () => {
        expect(models.User).to.be.ok;
    });
});

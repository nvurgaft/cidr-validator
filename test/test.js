const chai = require('chai');
const expect = chai.expect;
const { CidrValidator, CidrValidationError } = require('../CidrValidator.js');

describe('cidr-validator', function () {

    let validator

    it('should pass for localhost', function () {
        validator = new CidrValidator();
        expect(validator.validate("127.0.0.1")).equal(undefined);
    });

    it('should pass for localhost with a mask', function () {
        validator = new CidrValidator();
        expect(validator.validate("127.0.0.1/24")).equal(undefined);
    });

    it('should fail for invalid mask value', function () {
        validator = new CidrValidator();
        expect(()=> validator.validate("127.0.0.1/99")).to.throw(Error);
    });

    it('should pass multiple ip addresses', function () {
        validator = new CidrValidator();
        expect(validator.validate("127.0.0.1 120.150.1.22")).equal(undefined);
    });

    it('should fail for an invalid octet', function () {
        validator = new CidrValidator();
        expect(()=> validator.validate("127.0.0.9000")).to.throw(Error);
    });

    it('should pass for a range', function () {
        validator = new CidrValidator();
        expect(validator.validate("127.0.0.1-12")).equal(undefined);
    });

    it('should pass for multiple octet values', function () {
        validator = new CidrValidator();
        expect(validator.validate("127.0.0.1,2,3,4")).equal(undefined);
    });

    it('should fail for a reversed range', function () {
        validator = new CidrValidator();
        expect(()=> validator.validate("127.0.0.12-1")).to.throw(Error);
    });

    it('should fail for a malformed range', function () {
        validator = new CidrValidator();
        expect(()=> validator.validate("127.0.0.12-1-0")).to.throw(Error);
    });

    it('should pass for a range and singular values', function () {
        validator = new CidrValidator();
        expect(validator.validate("127.0.0.1-12,24,25,28")).equal(undefined);
    });

});
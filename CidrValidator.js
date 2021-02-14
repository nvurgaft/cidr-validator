"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CidrValidationError = /** @class */ (function (_super) {
    __extends(CidrValidationError, _super);
    function CidrValidationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CidrValidationError;
}(Error));
function isBlank(text) {
    return text !== undefined && text.trim().length === 0;
}
function isNaturalNumber(num) {
    return /^(0|([1-9]\d*))$/.test(num);
}
/**
 * Tests whether the argument is single number or a range.
 * e.g.
 * 0, 255, 7, 4-7 500-700, 4-3 will return true
 * 0-, 1--2 will return false
 * @param range
 */
function isNumericRange(range) {
    return /^(0|([1-9]\d*(-{0,1}[1-9]\d*){0,1}))$/.test(range);
}
/**
 *  Tests whether a number is a valid ipv8 octet (a natural number between 0-255)
 * @param octet
 */
function validateOctet(octet) {
    if (isNaturalNumber(octet.toString()) && (octet < 0 || octet > 255)) {
        throw new CidrValidationError("invalid octet: " + octet);
    }
}
/**
 *
 * @param value
 */
function validateBitmask(value) {
    if (isNaturalNumber(value.toString()) && (value < 0 || value > 32)) {
        throw new CidrValidationError("invalid subnet mask bit count: " + value);
    }
}
function validateTarget(target) {
    var _a = target.split('/'), ipadder = _a[0], bitmask = _a[1];
    if (ipadder) {
        if (isBlank(bitmask)) {
            throw new CidrValidationError("ipadder is blank");
        }
        var ipparts = ipadder.split('.');
        // is single value
        for (var _i = 0, ipparts_1 = ipparts; _i < ipparts_1.length; _i++) {
            var part = ipparts_1[_i];
            var subparts = part.split(',');
            if (subparts.length > 0) {
                for (var _b = 0, subparts_1 = subparts; _b < subparts_1.length; _b++) {
                    var subpart = subparts_1[_b];
                    // e.g. 0, 255, 3, 5-7
                    if (isNumericRange(subpart)) {
                        var _c = subpart.split('-'), start = _c[0], end = _c[1];
                        var nstart = parseInt(start);
                        var nend = parseInt(end);
                        validateOctet(nstart);
                        validateOctet(nend);
                        if (nstart >= nend) {
                            throw new CidrValidationError("range is not valid, start of range must be lower than end: " + subpart);
                        }
                    }
                    else if (!isNaturalNumber(subpart)) {
                        throw new CidrValidationError("value is not valid: " + subpart);
                    }
                }
            }
            else {
                validateOctet(parseInt(part));
            }
        }
    }
    if (bitmask) {
        if (isBlank(bitmask)) {
            throw new CidrValidationError("bitmask is blank");
        }
        validateBitmask(parseInt(bitmask));
    }
}
var CidrValidator = /** @class */ (function () {
    function CidrValidator() {
    }
    CidrValidator.prototype.validate = function (expression) {
        if (isBlank(expression)) {
            throw new CidrValidationError("cidr expression is blank");
        }
        var targets = expression.split(' ');
        for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
            var target = targets_1[_i];
            validateTarget(target);
        }
    };
    return CidrValidator;
}());
module.exports = { CidrValidator: CidrValidator, CidrValidationError: CidrValidationError };

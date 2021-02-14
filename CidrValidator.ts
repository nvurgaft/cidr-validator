class CidrValidationError extends Error {

}

function isBlank(text: string): boolean {
    return text!==undefined && text.trim().length === 0;
}

function isNaturalNumber(num: string): boolean {
    return /^(0|([1-9]\d*))$/.test(num);
}

/**
 * Tests whether the argument is single number or a range.
 * e.g. 
 * 0, 255, 7, 4-7 500-700, 4-3 will return true
 * 0-, 1--2 will return false
 * @param range 
 */
function isNumericRange(range: string): boolean {
    return /^(0|([1-9]\d*(-{0,1}[1-9]\d*){0,1}))$/.test(range);
}

/**
 *  Tests whether a number is a valid ipv8 octet (a natural number between 0-255)
 * @param octet 
 */
function validateOctet(octet: number) {
    if (isNaturalNumber(octet.toString()) && (octet < 0 || octet > 255)) {
        throw new CidrValidationError("invalid octet: " + octet);
    }
}

/**
 * 
 * @param value 
 */
function validateBitmask(value: number) {
    if (isNaturalNumber(value.toString()) && (value < 0 || value > 32)) {
        throw new CidrValidationError("invalid subnet mask bit count: " + value);
    }
}

function validateTarget(target: string): void {

    let [ipadder, bitmask] = target.split('/');
    if (ipadder) {
        if (isBlank(bitmask)) {
            throw new CidrValidationError("ipadder is blank");
        }

        let ipparts = ipadder.split('.');
        // is single value
        for (const part of ipparts) {

            let subparts = part.split(',');
            if (subparts.length > 0) {
                for (const subpart of subparts) {
                    // e.g. 0, 255, 3, 5-7
                    if (isNumericRange(subpart)) {
                        let [start, end] = subpart.split('-');
                        let nstart: number = parseInt(start);
                        let nend: number = parseInt(end);
                        validateOctet(nstart);
                        validateOctet(nend);
                        if (nstart >= nend) {
                            throw new CidrValidationError("range is not valid, start of range must be lower than end: " + subpart);
                        }
                    } else if (!isNaturalNumber(subpart)) {
                        throw new CidrValidationError("value is not valid: " + subpart);
                    }
                }
            } else {
                validateOctet(parseInt(part));
            }
        }
    }
    if (bitmask) {
        if (isBlank(bitmask)) {
            throw new CidrValidationError("bitmask is blank");
        }
        validateBitmask(parseInt(bitmask))
    }
}

class CidrValidator {
    validate(expression: string): void {
        if (isBlank(expression)) {
            throw new CidrValidationError("cidr expression is blank");
        }

        let targets = expression.split(' ');
        for (const target of targets) {
            validateTarget(target);
        }
    }
}

module.exports = {CidrValidator, CidrValidationError};
import {typeOf} from "@iosio/utils/lib/typeOf";

const isNested = (value) => ['array', 'object'].includes(typeOf(value));

export const basicNestedCopy = (value, disabled) => {
    if (disabled) return value;
    let cop = undefined;
    if (typeOf(value) === 'array') {
        cop = [];
        value.forEach(v => {
            cop.push(isNested(v) ? basicNestedCopy(v) : v);
        });
    } else if (typeOf(value) === 'object') {
        cop = {};
        for (let i in value) {
            if (Object.prototype.hasOwnProperty.call(value, i)) {
                cop[i] = isNested(value[i]) ? basicNestedCopy(value[i]) : value[i];
            }
        }
    } else {
        cop = value;
    }
    return cop;
};


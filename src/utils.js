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

export const convertArguments = (...args) => {
    if (!args || args.length === 0) return {};
    if (typeOf(args[0]) === 'object') return args[0];
    if (typeOf(args[0]) === 'string') return {
        name: args[0], initialState: args[1], logic: args[2], mapState: args[3],
        mapLogic: args[4], mapActions: args[5], options: args[6]
    };
    if (typeOf(args[0]) === 'array') {
        let arr = args[0];
        return {mapState: arr[0], mapLogic: arr[1], mapActions: arr[2], options: arr[3]}
    }
};
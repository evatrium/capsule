
/*
    slim query-string
 */

import {typeOf} from "@iosio/utils/lib/typeOf";


/**
 * converts an object to url search params
 * @param {Object} obj - the object to convert
 * @returns {string} - returns an empty string if no object is provided or no key values exist
 */
export const stringifyParams = (obj) => {
    if (typeOf(obj) !== 'object') return '';
    let keys = Object.keys(obj);
    if (keys.length === 0) return '';
    let the_string = '?';
    for (let i = 0; i < keys.length; i++) {
        let and = i === (keys.length - 1) ? '' : '&';
        the_string = the_string + encodeURI(keys[i]) + '=' + encodeURI(obj[keys[i]]) + and;
    }
    return the_string;
};

/**
 * check if a string is "true" or "false" and returns the appropriate boolean value, else returns the original value
 * @param {String} potentialBoolean - string to check
 * @returns {Boolean|string} - string or boolean
 */
export const isBool = (potentialBoolean) => {
    if (potentialBoolean === "true") return {ok: true, data: true};
    if (potentialBoolean === "false") return {ok: true, data: false};
    return {ok: false, data: potentialBoolean};
};

/**
 * builds an object from two indices of an array onto a provided string
 * @param {String} string - the string to append the values to provided with the beginning "{" bracket
 * @param {Array} parts - ["id", "3"]
 * @param {Number} propsLength - array.length of props to determine if a closing bracket should be appended
 * @param {Number} index - the current index of the props array, used to determine if a closing bracket should be appended
 * @returns {string} - the string with the appended values
 */
export const stringObj = (string, parts, propsLength, index) => {
    let key = parts[0], val = parts[1];
    const bool = isBool(val);
    const value = bool.ok
        ? bool.data
        : (typeOf(Number(val)) === 'nan' ? `"${val}"` : Number(val));
    return `${string}"${key}":${value}${index === propsLength - 1 ? '}' : ','}`;
};


/**
 * Builds a string based on an array of prop key=values
 * @param {Array} props - ex: ['id=3','detail=7']
 * @returns {string} - ex: "{ "id": 3, "detail" : 7 }"
 */
export const buildString = (props) => {


    const isArray = typeOf(props) === 'array';

    if (!isArray) return false;
    if (props.length < 1) return false;

    let start = '{';
    let string = start;
    //for every key value in the props array
    for (let i = 0; i < props.length; i++) {
        //split them into two parts by the '=' delineation
        let parts = props[i].replace(/\+/g, ' ').split('=');// ex (["id", "3"]
        //if there are two parts then make an object with it
        if (parts[0] && parts[1]) {
            //pass the whole string to append the new values
            //pass the props and index to determine a comma or closing "}"
            string = stringObj(string, parts, props.length, i);
        }
    }

    return string === start ? false : string;
};


/**
 * grabs the search parameters from the url and returns an array of properties
 * @param {string} search - pass window.location.search or a string to decode
 * @returns {Array|boolean} - returns an array of properties or false if nothing exists
 */
export const decode = (search) => {
    let decoded = false,
        just_search = '',
        props = '';
    //use decodeURI to get any search parameters after the path
    try {
        decoded = decodeURI(search)

    } catch (e) {
        console.error('search not decodable', e);
    }
    //if search params exist (ex: ?id=3)
    if (decoded) {
        //check for ?
        let searchIndex = decoded.indexOf("?");
        //grab only the search string after "?" if it exists
        if (searchIndex >= 0) {
            just_search = decoded.substr(searchIndex + 1);
            //get an array of properties delineated by "&" if anything after "?" exists (ex: id=3&detail=7)
            if (just_search.length > 0) {
                props = just_search.split('&');
            }
            //return the array of props if any exist (ex: ['id=3','detail=7'] )
            return props.length > 0 ? props : false;
        } else {
            return false;
        }

    } else {
        return false;
    }
};

/**
 * gets parses the search parameters from the url into a consumable object
 * @param {undefined|string} search - optionally pass a string. uses window.location.search by default
 * @returns {boolean | Object} - returns false if no params or error
 */
export const getParams = (search) => {
    //get the search value from the url
    let propsArray = decode(search || window.location.search),
        parsed;
    //if none exist then exit
    if (!propsArray) return false;
    try {
        //build the string from the array of values
        const string = buildString(propsArray);
        //then parse them to a consumable object
        parsed = string ? JSON.parse(string) : false;
    } catch (e) {
        parsed = false;
    }
    return parsed;
};

//- dont really need these but here for keepsake
/**
 * gets the pathname from a pathname+search string. ex: '/some/path/with?a=search&value=something' => /some/path/with
 * @param url
 * @returns {String | boolean} - returns a string if used correctly
 */
// export const getPathnameFromString = (url) =>typeof url === 'string' ? url.replace(/\?.+$/, '') : false;
/**
 * gets the search query from a url like string, ex: '/some/path/with?a=search&value=something' => a=search&value=something'
 * @param {String} url
 * @returns {any}
 */
// export const getSearchFromString = (url) => typeof url === 'string' ? url.split("?")[1] : false;

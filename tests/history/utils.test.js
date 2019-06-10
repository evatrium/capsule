import {stringifyParams, isBool, stringObj, buildString, decode, getParams} from "../../src/createHistory/utils";

describe('stringifyParams', () => {

    it('should create a url string out of an object', () => {

        const result = stringifyParams({asdf: '123', num: 1, a: true, b: false, c: null});
        expect(result).toBe('?asdf=123&num=1&a=true&b=false&c=null')
    });

    it('should return a string if no object is passed', () => {
        const result = stringifyParams();
        expect(result).toBe('')
    });

    it('should return a string if an empty object is passed', () => {
        const result = stringifyParams({});
        expect(result).toBe('')
    });
});

describe('isBool', () => {

    it('should return the correct object', () => {

        expect(isBool("true")).toEqual(
            expect.objectContaining(
                {ok: true, data: true}
            )
        );

        expect(isBool("false")).toEqual(
            expect.objectContaining(
                {ok: true, data: false}
            )
        );

        expect(isBool("asdf")).toEqual(
            expect.objectContaining(
                {ok: false, data: "asdf"}
            )
        );

        expect(isBool()).toEqual(
            expect.objectContaining(
                {ok: false, data: undefined}
            )
        );


    });

});

// describe('getPathnameFromString getSearchFromString', ()=>{
//
//     it('should return only the pathname from a url-like string', ()=>{
//         expect(getPathnameFromString('/some/path/with?a=search&value=something')).toBe('/some/path/with')
//     });
//
//     it('should return only the search query from a url-like string', ()=>{
//         expect(getSearchFromString('/some/path/with?a=search&value=something')).toBe('a=search&value=something')
//     })
//
// });


describe('stringObj', () => {

    it('should build the beginning of a string', () => {
        const result = stringObj('{', ["id", "3"], 2, 0);
        expect(result).toBe('{"id":3,')
    });

    it('should build a string containing one key pair value', () => {
        const result = stringObj('{', ["id", "3"], 1, 0);
        expect(result).toBe('{"id":3}')
    });

    it('should build a string with two key value pairs', () => {
        const string = '{"id":3,';
        const result = stringObj(string, ["derp", "asdf"], 2, 1);
        expect(result).toBe(string + '"derp":"asdf"}')
    });

});


describe('buildString', () => {

    it('should build a string object given an array of = delineated key values', () => {
        const props = ['id=3', 'detail=7'];
        const result = buildString(props);
        expect(result).toBe('{"id":3,"detail":7}')
    });

    it('should return false if there is no = delineator', ()=>{
        const props = ['id'];
        const result = buildString(props);
        expect(result).toBe(false)
    });

    it('should return false if array is empty or no array', () => {
        expect(buildString([])).toBe(false)
        expect(buildString()).toBe(false)
    });

});

describe('decode', () => {

    it('should decode a string with params and return an array with = delineated key values ', () => {
        const result = decode('?asdf=123&num=1');
        expect(result).toEqual(
            expect.arrayContaining(["asdf=123", "num=1"])
        )
    });

    it('should decode a string with params and return an array with = delineated key values ', () => {
        const result = decode('?asdf=123&num=1');
        expect(result).toEqual(
            expect.arrayContaining(["asdf=123", "num=1"])
        )
    });

    it('technically should pass this ', ()=>{
        expect(decode('?id')).toEqual(expect.arrayContaining(["id"]));
    });

    it('should return false if an invalid value is provided ', () => {
        expect(decode(false)).toBe(false);
        expect(decode()).toBe(false);
        expect(decode('')).toBe(false);
        expect(decode({})).toBe(false);
        expect(decode('?')).toBe(false);
    });

});

describe('getParams', () => {

    it('should return an object with a given search params string', () => {
        const result = getParams('?asdf=123&num=1&detail=hello');
        expect(result).toEqual(
            expect.objectContaining({asdf:123, num:1, detail: 'hello'})
        )
    });

    it('should return false for invalid values', () => {
        expect(getParams('asdf')).toBe(false);
        expect(getParams(true)).toBe(false);
        expect(getParams('?')).toBe(false);
        expect(getParams('?f&s')).toBe(false);
        expect(getParams('')).toBe(false);
        expect(getParams('?a=e&*)(*')).toBe(false);
    });

});

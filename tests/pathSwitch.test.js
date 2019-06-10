import {pathSwitch} from "../src/createRouting";


const replace = jest.fn();


describe('the router pathSwitch should return the expected value for the root router', () => {

    let rootPathMap = {
        '/': 'publicApp',
        '/admin': 'adminApp'
    };

    let props = {
        root: true,
        pathMap: rootPathMap,
        noMatch: '/',
        replace,
        pathname: '/',
        lastPathname: '/',
        lastUrl: '/'
    };

    let results;

    it('root router should render the public app when at /', () => {

        results = pathSwitch({...props});

        expect(results).toBe('publicApp');
    });


    it('root router should resolve to the public app if the root pathMap has no match', () => {

        results = pathSwitch({...props, pathname: '/profile'});

        expect(results).toBe('publicApp');
    });


    it('root router should render the admin app if the base pathname exists on the root pathMap', () => {

        results = pathSwitch({...props, pathname: '/admin'});

        expect(results).toBe('adminApp');
    });


    it('root router should render the admin app for any pathname that is prepended with "/admin" ', () => {

        results = pathSwitch({...props, pathname: '/admin/accounts'});

        expect(results).toBe('adminApp');
    });


    it('if no path is found on the pathMap and an invalid noMatch is provided then the pathSwitch will return undefined', () => {

        results = pathSwitch({...props, pathname: '/asdf', noMatch: '/derp'});

        expect(results).toBe(undefined);
    });

    it('the root router does not call the history replace function', () => {

        expect(replace).not.toBeCalled();
    });

});



describe('a "non" root router pathSwitch should return the expected value', () => {

    let pathMap = {
        '/': 'home',
        '/profile': 'profile',
        '/settings': 'settings',
        '/settings/password': 'password'
    };

    let props = {
        root: false,
        pathMap,
        noMatch: '/',
        replace,
        pathname: '/',
        lastPathname: '/',
        lastUrl: '/'
    };

    let results;

    it('pathSwitch should return "home" when at "/"', () => {

        results = pathSwitch({...props});

        expect(results).toBe('home');
    });


    it('should return "profile" when at "/profile" ', () => {

        results = pathSwitch({...props, pathname: '/profile'});

        expect(results).toBe('profile');
    });


    it('should return settings when at "/settings"', () => {

        results = pathSwitch({...props, pathname: '/settings'});

        expect(results).toBe('settings');
    });


    it('should return password when at "/settings/password" ', () => {

        results = pathSwitch({...props, pathname: '/settings/password'});

        expect(results).toBe('password');
    });

    it('should return the last result at the last url if no match is found and call the replace function, including any query params if they exist', ()=>{
        results = pathSwitch({...props, pathname:'/not/a/valid/path', lastPathname: '/profile', lastUrl:'/profile?id=3'});

        expect(results).toBe('profile');
        expect(replace).toBeCalledWith('/profile?id=3');
        replace.mockClear();
    });

    it('should return the result of a noMatch path if the lastPathname is equal to the current pathname', ()=>{
        results = pathSwitch({...props, pathname:'/not/a/valid/path', lastPathname: '/not/a/valid/path', lastUrl: '/not/a/valid/path'});

        expect(results).toBe('home');
        expect(replace).toBeCalledWith('/');
        replace.mockClear();
    });

    it('should return undefined if the noMatch is not valid, the last url is not valid, and no path from pathMap is resolved', ()=>{
        const config = {
            ...props,
            pathname: '/not/a/valid/path',
            noMatch:'/developerDidNotSetThis',
            lastUrl: '/not/a/valid/path',
            lastPathname:'/not/a/valid/path'
        };

        results = pathSwitch(config);
        expect(results).toBe(undefined);
        expect(replace).not.toBeCalled();
    })


});
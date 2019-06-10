import {createHistory} from "../../src/createHistory/createHistory";


describe('createHistory', () => {

    const hist = createHistory();

    const getLoc = () => hist.getLocation();

    it('should have all the properties', () => {

        expect(Object.keys(hist)).toEqual(
            expect.arrayContaining([
                'goTo',
                'push',
                'listen',
                'goBack',
                'goForward',
                'replace',
                'getParams',
                'getLocation'
            ])
        )
    });

    it('getLocation should return the correct object', () => {
        expect(hist.getLocation()).toMatchObject({
            pathname: '/',
            search: '',
            params: false,
            url: '/'
        })
    });

    it('should change the window pathname and search after calling goTo/push', () => {

        hist.goTo('/asdf');
        expect(getLoc().pathname).toBe('/asdf');

        hist.goTo('/asdf', {id: 1});
        expect(getLoc().search).toBe('?id=1');

        hist.push({pathname: '/'});
        expect(getLoc().pathname).toBe('/');
        expect(getLoc().search).toBe('');

        hist.push({pathname: '/derp', search: '?id=2'});
        expect(getLoc().url).toBe('/derp?id=2');

    });

    it('should listen to url changes and call the callbacks. unsubscribe should stop listening', () => {
        const histo = createHistory();
        histo.goTo('/');

        const cb1 = jest.fn();
        const unsubscribe1 = histo.listen(cb1);

        const cb2 = jest.fn();
        const unsubscribe2 = histo.listen(cb2);

        histo.goTo('/asdf');

        expect(cb1).toHaveBeenCalledTimes(1);
        expect(cb2).toHaveBeenCalledTimes(1);

        expect(cb1).toHaveBeenCalledWith({pathname: '/asdf', search: '', params: false, url: '/asdf'}, 'push');
        expect(cb2).toHaveBeenCalledWith({pathname: '/asdf', search: '', params: false, url: '/asdf'}, 'push');

        unsubscribe1();

        histo.goTo('/');
        expect(cb1).toHaveBeenCalledTimes(1);
        expect(cb2).toHaveBeenCalledTimes(2);

        unsubscribe2();

        histo.goTo('/zxcv');
        expect(cb1).toHaveBeenCalledTimes(1);
        expect(cb2).toHaveBeenCalledTimes(2);

    });

    it('should navigate to the appropriate history', () => {
        const histo = createHistory();
        histo.goTo('/');
        expect(getLoc().pathname).toBe('/');

        histo.goTo('/asdf');
        expect(getLoc().pathname).toBe('/asdf');

        // hist.goBack();


        //************
        // WINDOW.HISTORY.GO IS NOT WORKING IN THIS NODE ENVIRONMENT
        //************

        // window.history.go(-1);
        // expect(getLoc().pathname).toBe('/');
        //
        // hist.goForward();
        // expect(getLoc().pathname).toBe('/asdf');

    });

    it('should replace the current place in history', () => {
        hist.goTo('/');
        expect(getLoc().pathname).toBe('/');
        hist.replace('/replacement')
        expect(getLoc().pathname).toBe('/replacement');
    });

    it('should get the search params from the url', () => {
        hist.goTo('/qwerty', {id: 3});
        expect(getLoc().url).toBe('/qwerty?id=3')
    })


});
import {Capsule} from '../../src';

export const mainCapsule = Capsule({
    name: 'main',
    initialState: {
        loggedIn: false,
        isAdmin: false,
    },
    logic: ({actions: {main: {set, get, update, merge, toggle, getState}}, collective}) => {

        const {routing: r} = collective();

        const login = () => {
            set.loggedIn(true);
            r.goTo('/authOnly')
        };

        const logout = () => {
            set.loggedIn(false);
            r.goTo('/login');
        };

        const setAdmin = () => {
            toggle.isAdmin();
        };

        return {
            login,
            logout,
            setAdmin,
            getState
        }
    }

});
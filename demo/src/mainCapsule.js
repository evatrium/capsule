import {Capsule} from '../../src';

import {lsdb} from "@iosio/utils/lib/lsdb";

export const mainCapsule = Capsule({
    name: 'main',
    initialState: {
        loggedIn: lsdb.get('loggedIn'),
        isAdmin: false,
        text: ''
    },
    logic: ({actions: {main: {set, get, update, merge, toggle}}, collective}) => {

        const {routing: r} = collective();

        const login = () => {
            lsdb.set('loggedIn', true);
            set.loggedIn(true);
            r.route('/authOnly')
        };

        const logout = () => {
            lsdb.destroy('loggedIn');
            set.loggedIn(false);
            r.route('/login');
        };

        const onSubmitText = () => {
            r.route(get.text());
            set.text('');
        };

        const setAdmin = () => {
            toggle.isAdmin();
        };

        return {
            login,
            logout,
            setAdmin,
            onSubmitText
        }
    }

})();
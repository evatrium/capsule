import {Capsule} from '../../src';
import {goTo} from '@iosio/routing';

import {lsdb} from "@iosio/utils/lib/lsdb";

export const mainCapsule = Capsule({
    name: 'main',
    initialState: {
        loggedIn: lsdb.get('loggedIn'),
        isAdmin: false,
        text: ''
    },
    logic: ({actions: {main: {set, get,update, merge, toggle}}})=>{

        const login = ()=>{
            lsdb.set('loggedIn', true);
            set.loggedIn(true);
        };

        const logout = ()=>{
            lsdb.destroy('loggedIn');
            set.loggedIn(false);
        };

        const onSubmitText = ()=>{
            goTo(get.text());
            set.text('');
        };

        const setAdmin = ()=>{
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
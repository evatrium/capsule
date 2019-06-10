import {Capsule} from '../../../src';
import {lsdb} from "@iosio/utils/lib/lsdb";

export const mainCapsule = Capsule({
    name: 'main',
    initialState: {
        loggedIn: lsdb.get('loggedIn'),
        isAdmin: lsdb.get('isAdmin'),
        text: '',
        testObj: {},
        testArr: {}
        // pathRegistry,
        // accessiblePaths: initialAccessiblePaths
    },
    logic: ({actions: {main: {set, get, update, merge, toggle}}, collective}) => {

        const {routing: r} = collective();

        const login = () => {
            lsdb.set('loggedIn', true);
            merge({
                loggedIn: true,
                // accessiblePaths: [...publicPaths, ...authenticatedPaths]
            });
            r.route('/myProfile')
        };

        const logout = () => {
            lsdb.destroy('loggedIn');
            lsdb.destroy('isAdmin');
            merge({
                isAdmin:false,
                loggedIn:false,
                // accessiblePaths: publicPaths
            });
            r.route('/login');
        };

        const onSubmitText = () => {
            r.route(get.text());
            set.text('');
        };

        const loginAsAdmin = () => {
            lsdb.set('loggedIn', true);
            lsdb.set('isAdmin', true);
            merge({
                isAdmin:true,
                loggedIn:true,
                // accessiblePaths: pathRegistry
            });
            r.route('/admin');
        };

        // setTimeout(()=>{
            set.testObj({a:1, b:2});
            set.testArr(['a','s','d','f']);
        // },2000)


        return {
            login,
            logout,
            loginAsAdmin,
            onSubmitText
        }
    }

})();
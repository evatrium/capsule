import {Capsule} from '../../src';
import {lsdb} from "@iosio/utils/lib/lsdb";


// const publicPaths = ['/', '/detail', '/login'];
// const authenticatedPaths = ['/myProfile'];
// const adminPaths = ['/admin', '/admin/users', '/admin/analytics'];
//
// const pathRegistry = [...adminPaths, ...authenticatedPaths, ...publicPaths];
//
// const hasLoggedIn = lsdb.get('loggedIn');
// const hasBeenAdmin = lsdb.get('isAdmin');
//
// let initialAccessiblePaths = publicPaths;
//
// if(hasLoggedIn){
//     initialAccessiblePaths = [...initialAccessiblePaths, ...authenticatedPaths];
// }
// if(hasBeenAdmin){
//     initialAccessiblePaths = [...initialAccessiblePaths, ...adminPaths];
// }
//
// console.log(pathRegistry)

export const mainCapsule = Capsule({
    name: 'main',
    initialState: {
        loggedIn: lsdb.get('loggedIn'),
        isAdmin: lsdb.get('isAdmin'),
        text: '',
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
            r.goTo('/myProfile')
        };

        const logout = () => {
            lsdb.destroy('loggedIn');
            lsdb.destroy('isAdmin');
            merge({
                isAdmin:false,
                loggedIn:false,
                // accessiblePaths: publicPaths
            });
            r.goTo('/login');
        };

        const onSubmitText = () => {
            r.goTo(get.text());
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
            r.goTo('/admin');
        };

        return {
            login,
            logout,
            loginAsAdmin,
            onSubmitText
        }
    }

})();
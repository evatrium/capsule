import {Capsule} from '../../../src';
import {lsdb} from "@iosio/utils/lib/lsdb";


export default Capsule('main',
    {
        loggedIn: lsdb.get('loggedIn'),
        isAdmin: lsdb.get('isAdmin'),
        text: '',
        testObj: {a: 1, b: 2},
        testArr: ['a', 's', 'd', 'f']
    },
    ({set, get, merge}, {collective}) => {

        const {routing: {route}} = collective();

        const onSubmitText = () => {
            route(get.text());
            set.text('');
        };

        return {
            onSubmitText,
            login() {
                lsdb.set('loggedIn', true);
                merge({
                    loggedIn: true,
                });
                route('/myProfile')
            },
            logout() {
                lsdb.destroy('loggedIn');
                lsdb.destroy('isAdmin');
                merge({
                    isAdmin: false,
                    loggedIn: false,
                });
                route('/login');
            },
            loginAsAdmin() {
                lsdb.set('loggedIn', true);
                lsdb.set('isAdmin', true);
                merge({
                    isAdmin: true,
                    loggedIn: true,
                });
                route('/admin');
            },
            captureEnter: (e) => {
                let code = e.keyCode ? e.keyCode : e.which;
                if (code === 13) {
                    onSubmitText()
                }
            },
            updateNewURLText(e) {
                set.text(e.target.value);
            }

        }
    });


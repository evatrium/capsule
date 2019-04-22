import {createStore, createActions, connect, Provider} from "@iosio/store";
import {classNames} from "@iosio/utils/lib/classNames";
import {lazyLoader } from "./lazyLoader";
import {CapsuleModule} from "./CapsuleModule";
import {JSS_nano} from "@iosio/jss_nano";
import {Eventer} from '@iosio/utils/lib/eventer';
import {Routing} from "@iosio/routing";

export const CreateCapsule = () => {

    const events = Eventer();

    const {CapsuleProvider, Capsule} = CapsuleModule({
        createStore,
        connect,
        Provider,
        actionsCreator: createActions,
        classNames,
        asyncHOC: lazyLoader,
        jssProcessor: JSS_nano(process.env.NODE_ENV === 'development'),
        events
    });


    const {getLoc, goTo, subscribe} = Routing;

    const routingCapsule = Capsule({
        name: 'routing',
        initialState: {
            ...getLoc()
        },
        logic: ({actions: {routing: {merge}}}) => {
            let last_pathname = window.location.pathname;
            let last_params = window.location.search;
            subscribe((loc) => {
                if (loc.search !== last_params || loc.pathname !== last_pathname) {
                    merge(loc);
                }
                last_params = loc.search;
                last_pathname = loc.pathname
            });
            return {
                goTo,
                getLoc,
                subscribe
            }
        }
    })();

    return {
        CapsuleProvider,
        Capsule,
        events,
        lazyLoader,
        routingCapsule,
        Routing
    }

};

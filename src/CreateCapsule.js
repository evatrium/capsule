import {createStore, createActions, connect, Provider} from "@iosio/store";
import {classNames} from "@iosio/utils/lib/classNames";
import {lazyLoader } from "./lazyLoader";
import {CapsuleModule} from "./CapsuleModule";
import {JSS_nano} from "@iosio/jss_nano";
import {Eventer} from '@iosio/utils/lib/eventer';
import {createRouting} from "./routing";

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

    const {
        routing,
        Router,
        WithRouting,
        Linkage
    } = createRouting(Capsule);

    return {
        CapsuleProvider,
        Capsule,
        events,
        lazyLoader,
        routing,
        Router,
        Linkage,
        WithRouting
    }

};
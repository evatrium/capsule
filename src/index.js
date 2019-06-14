import {createCapsule} from "./createCapsule";
import {createRouting} from "./createRouting";

const {
    CapsuleProvider,
    Capsule,
    events,
    connect
} = createCapsule();

const {
    Router,
    Linkage,
    routing,
    pathSwitch
} = createRouting(Capsule);

export {
    CapsuleProvider,
    Capsule,
    events,
    connect,

    Router,
    Linkage,
    routing,
    pathSwitch
};
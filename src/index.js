import {createCapsule} from "./createCapsule";
import {createRouting} from "./createRouting";

const {
    CapsuleProvider,
    Capsule,
    events,
    useCapsule,
    connectCapsule
} = createCapsule();

const {
    routing,
    Router,
    Linkage,
    pathSwitch
} = createRouting(Capsule);

export {
    CapsuleProvider,
    Capsule,
    events,
    useCapsule,
    connectCapsule,
    routing,
    Router,
    Linkage,
    pathSwitch,

};


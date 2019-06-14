import {Capsule} from "../../../../../src";


export const dataCapsule = Capsule('data',
    {test1: {a: 1, b: 2}, test2: []},
    (({merge}) => ({
        detailPageReady: () => {
            let arr = ['a', 'b', '3'];
            merge(state => {
                return {
                    ...state,
                    test2: arr
                }
            });
        }
    }))
)();


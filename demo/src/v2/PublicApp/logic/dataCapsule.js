import {Capsule} from "../../../../../src";


export const dataCapsule = Capsule({
    name: 'data',
    initialState: {
        test1: {a: 1, b: 2},
        test2: []
    },
    logic: (({actions: {data: {set,get, merge, update}}}) => {

        let initialized = false;
        return {
            detailPageReady: () => {
                // if(initialized)return;
                // initialized = true;


                let arr = ['a', 'b', '3'];
                update(state => {
                    return {
                        ...state,
                        test2: arr
                    }
                });

                arr[0] = 'xyz';



            }
        }
    })
})();
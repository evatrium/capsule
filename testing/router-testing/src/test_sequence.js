
import {Capsule} from "./capsule";

export const logic = Capsule({
    reducer_name: 'test',
    initial_state: {
        mount: false,
        detail_id: 123,
        with_transition: true,
        ms_delay: 300,
        cur_page: {},
        no_fade: false,
    },
    logic_name: 'test',
    logic: ({state, collective}) => ({
        set_mount: (bool) => state.test.set.mount(bool),
        set_id: (id) => state.test.set.detail_id(id),
        get_id: ()=>state.test.get.detail_id(),
        set_trans: (bool) => state.test.set.with_transition(bool),
        set_delay: (num) => state.test.set.ms_delay(num),
        state,
        transTo: (path, id) => collective().routing.transTo(path, id, state.test.get.ms_delay()),
        goTo: (path, id) => collective().routing.goTo(path, id),
        getParams: () => collective().routing.getParams(),
        getPathName: ()=> collective().routing.getPathName(),
        set_cur_page: ({page, params})=> state.test.set.cur_page({page,params}),
        get_cur_page: ()=> state.test.get.cur_page()
    })
})();


const wait = time => new Promise(resolve => setTimeout(resolve, time));

const fail = ()=> console.error('test failed');
let t = 100;
export const test = async ()=>{
    console.log('reset to / and ms_delay to 0 and id to 123');
    logic.set_delay(0);
    logic.set_id('123');
    logic.goTo('/');

    await wait(t);

    console.log('app should mount');
    logic.set_mount(true);

    await wait(t);

    let cp = logic.get_cur_page();
    let path = logic.getPathName();
    console.log('current page should be "/"  result:', cp, 'pathname: ', path);
    if(!cp || cp.page !== 'list' || path !== '/') {
        return fail();
    }
    console.log('go to detail')
    logic.goTo('/detail', {id:logic.get_id()})

    await wait(t);

    cp = logic.get_cur_page();
    path = logic.getPathName();
    console.log('current page should be "/detail", id: 123  result:', cp.params, 'pathname:', path);
    if(!cp || !cp.params || cp.params.id !== '123' || path !== '/detail' ) {
        return fail();
    }
    console.log('set transition to 300');
    t = 800;

    logic.set_delay(300);
    console.log('transition to "/"')
    logic.transTo('/');
    let transitioning = logic.state.routing.get.transitioning();
    console.log('check transitioning: ', transitioning);
    if(!transitioning){
        return fail();
    }
    await wait(t);

    transitioning = logic.state.routing.get.transitioning();
    console.log('check transitioning complete', transitioning);
    if(transitioning){
        return fail();
    }
    cp = logic.get_cur_page();
    path = logic.getPathName();
    console.log('current page should be /  result:', cp, 'pathname: ', path);

    if(!cp || !path || path !== '/') {
        return fail();
    }

    console.log('cancel transitions');
    logic.state.test.set.no_fade(true);
    t = 500
    logic.set_delay(t);
    console.log('*** \n\n transition start \n\n visually inspect that fade transition affect does not happen \n\n ***');
    logic.transTo('/detail')
    await wait(t);
    console.log('*** \n\n COMPLETE \n\n \n\n***')
    console.log(
        ' this option exists because a routefader component may be used higher up on the tree as well as a nested component ' +
        ' but all route fader components listen to the same transitioning state.' +
        ' the developer may optionally turn off the parent fader for a desired effect.' +
        ' ex: switching to a logged in state with fade to a state that has a nav bar, but future route changes should not fade' +
        ' out the nav bar but only the content  '

    )



};
import React from 'react';
import {Page} from "./PageComponent";
import {render} from "react-testing-library";

export default class Detail extends React.Component{
    render(){
        return(<Page name={'Detail'} {...this.props}/>)
    }
}




describe('it renders the correct component when the location is changed', () => {




    const {container} = render(
        <CapsuleProvider>
            <App/>
        </CapsuleProvider>
    );

    const clickIt = (id) => {
        fireEvent.click(getById(container, id));
    };

    const runTest = ({click, startUrl, expected = {}, cb}) =>
        new Promise(resolve => {

            const {endUrl, endName} = expected;


            if (click === 'restricted') {
                // console.log(getLocation().url)
            }


            startUrl && expect(getLocation().url).toBe(startUrl);


            let resolved = false;


            let timeout

            const callback = ({name}) => {
                if (!resolved) {
                    // setTimeout();
                    console.log(name)
                    expect(name).toBe(endName);
                    expect(getLocation().url).toBe(endUrl);
                    resolve();
                    cb && cb();
                    resolved = true;
                }
                events.off('mounted', callback);
                clearTimeout(timeout);
            };

            events.on('mounted', callback);

            click && clickIt(click);

            if (!resolved) {

                timeout = setTimeout(() => {
                    if (!resolved) {
                        resolve();
                        expect(getLocation().url).toBe(endUrl);
                    }
                    events.off('mounted', callback);
                }, 1000);

            }

        });


    it('renders the correct route when routed to', () => {

        return runTest({
            startUrl: '/',
            click: 'detail',
            expected: {
                endUrl: '/detail',
                endName: 'Detail'
            }
        });

    });


    it('it does not go to a protected route when routed to', () => {

        // expect.assertions(3);
        return runTest({
            startUrl: '/detail',
            click: 'authOnly',
            expected: {
                endUrl: '/detail',
            }
        });

    });
//
//
// it('it allows a protected route to be accessible upon login', () => {
//
//     // expect.assertions(3);
//     return runTest({
//         startUrl: '/',
//         click: 'login',
//         expected: {
//             endName: 'AuthOnly',
//             endUrl: '/authOnly',
//         }
//     })
// });


// it('it allows another protected route to be accessible when logged in', () => {
//
//     // expect(authControls.getLoggedIn()).toBe(true);
//
//
//     return new Promise((resolve=>{
//
//         return runTest({
//             click: 'restricted',
//             startUrl: '/authOnly',
//             cb: resolve,
//             expected: {
//                 endName: 'Restricted',
//                 endUrl: '/restricted',
//             }
//         });
//     }))
// });


// it('it can navigate back home', () => {
//     return runTest({
//         startUrl: '/authOnly',
//         click: 'home',
//         expected: {
//             endName: 'Home',
//             endUrl: '/',
//         }
//     });
// });
//
//
// it('it can navigate back to the login page when logout is clicked', () => {
//     return runTest({
//         startUrl: '/',
//         click: 'logout',
//         expected: {
//             endName: 'Login',
//             endUrl: '/login',
//         }
//     }).then(() => {
//             expect(authControls.getState().loggedIn).toBe(false);
//             return runTest({
//                 startUrl: '/login',
//                 click: 'authOnly',
//                 expected: {
//                     endUrl: '/login',
//                 }
//             })
//         }
//     );
//
// });


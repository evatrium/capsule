import React from 'react';
// import {Capsule} from "@iosio/capsule";
import {Capsule} from "../../@iosio/capsule";


export const access_logic = Capsule({
    reducer_name: 'access',
    initial_state: {
        logged_in: false,
        requesting_login: false,
        user: false,
        request_login_fail: false,
    },

    logic_name: 'access',
    logic: ({state, fakeApi, collective}) => ({

        requestLogin: (credentials) => {

            state.access.update((state) => ({
                ...state,
                requesting_login: true,
                request_login_fail: false,
            }));

            fakeApi.requestAccess()
                .then((response) => {
                    state.access.set.requesting_login(false);
                    setTimeout(() => {
                        if (response.data.granted) {
                            state.access.update((state) => ({
                                ...state,
                                logged_in: true,
                                user: response.data.user
                            }));
                        } else {
                            state.access.update((state) => ({
                                ...state,
                                logged_in: false,
                                user: false,
                                request_login_fail: true,
                            }));
                        }

                    }, 300)

                });
        },

        logout: () => {
            const {routing} = collective();
            routing.goTo('/');
            state.access.update((state) => ({
                ...state,
                logged_in: false,
                user: false,
            }))
        }
    })

})();


@Capsule({
    mapStateToProps: (state) => ({
        logged_in: state.access.logged_in
    })
})
export class AppAccess extends React.Component {
    componentDidMount() {
        // console.log('app access mounted')
    }

    render() {
        const {LoginPage, App} = this.props;
        return (

            <React.Fragment>
                {
                    this.props.logged_in
                        ?
                        <React.Fragment>
                            {App}
                        </React.Fragment>
                        :
                        <React.Fragment>
                            {LoginPage}
                        </React.Fragment>
                }

            </React.Fragment>

        );
    }
}



import React from 'react';
// import {Capsule} from "@iosio/capsule";
import {Capsule} from "../../@iosio/capsule";


export const access_logic = Capsule({
    reducer_name: 'access',
    initial_state: {
        logged_in: false,
        requesting_login: false,
        user: false,
        //.....other states for failed login attempt
    },
    logic_name: 'access',
    logic: ({state, fakeApi, collective}) => {

        const requestLogin = (credentials) => {

            const {routing} = collective();

            state.access.set.requesting_login(true);


            fakeApi.requestAccess()
                .then((response) => {

                    state.access.set.requesting_login(false);

                    if (response.data.granted) {


                        setTimeout(() => {

                            state.access.update((state) => ({
                                ...state,
                                logged_in: true,
                                user: response.data.user
                            }));

                        }, 300)
                    } else {

                        // handle failed login logic
                    }


                });
        };

        const logout = () => {

            const {routing} = collective();
            routing.goTo('/');
            state.access.update((state) => ({
                ...state,
                logged_in: false,
                user: false,
            }))
        };

        return {
            requestLogin,
            logout,
        }

    }
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



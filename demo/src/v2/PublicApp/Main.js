import React, {createElement} from "react";
import {Capsule, Router as PublicRouter} from "../../../../src";
import {lazyLoader} from "../utils/lazyLoader";
import './logic/dataCapsule';

import {Nav} from "./Nav";


const Home = lazyLoader(() => import('./Pages/Home'));
const Detail = lazyLoader(() => import('./Pages/Detail'));
const Login = lazyLoader(() => import('./Pages/Login'));
const MyProfile = lazyLoader(() => import('./Pages/MyProfile'));
const Todos = lazyLoader(() => import('./Pages/Todos'));



const PublicMainComponent = () => {

    const pathMap = {
        '/': Home,
        '/detail': Detail,
        '/login': Login,
        '/myProfile': MyProfile,
        '/todos': Todos,
    };

    return (
        <React.Fragment>

            <Nav/>

            <PublicRouter noMatch={'/'} pathMap={pathMap}/>

        </React.Fragment>
    )
};
const PublicMain = Capsule({
    mapState: {main: 'loggedIn,isAdmin'},
})(PublicMainComponent);


export default PublicMain
import React from "react";
import {Capsule} from "../../../../src";
import {Router} from "../../../../src/routing";
import {lazyLoader} from "../utils/lazyLoader";
import './logic/dataCapsule';

import {Nav} from "./Nav";

const Home = lazyLoader(() => import('./Pages/Home'));
const Detail = lazyLoader(() => import('./Pages/Detail'));
const Login = lazyLoader(() => import('./Pages/Login'));
const MyProfile = lazyLoader(() => import('./Pages/MyProfile'));
const Todos = lazyLoader(() => import('./Pages/Todos'));


const pathMap = {
    '/': Home,
    '/detail': Detail,
    '/login': Login,
    '/myProfile': MyProfile,
    '/todos': Todos,
};

const PublicMainComponent = () => (
    //<>
    <React.Fragment>
        <Nav/>
        <Router noMatch={'/'} pathMap={pathMap}/>
    </React.Fragment>
    //</>
);

export default Capsule([
    {main: 'loggedIn,isAdmin'}
])(PublicMainComponent);
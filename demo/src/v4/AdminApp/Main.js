import React from "react";
import {Capsule, Router, Linkage} from '../../../../src';
import {lazyLoader} from "../utils/lazyLoader";

const AdminHome = lazyLoader(() => import('./Pages/AdminHome'));
const Analytics = lazyLoader(() => import('./Pages/Analytics'));
const Users = lazyLoader(() => import('./Pages/Users'));


const Link = ({toPath, toParams, name}) => (
    <Linkage toPath={toPath} toParams={toParams} className={'link'}>
        {({pathname}) => {
            const activeClass = toPath === pathname ? 'currPath' : null;
            return (
                <div className={activeClass}>
                    {name}
                </div>
            );
        }}
    </Linkage>
);


const Nav = Capsule([
    {main: 'loggedIn,isAdmin'},
    {main: 'logout,login'},
])(({loggedIn, logout}) => (
    <nav className={'nav'}>
        <div className={'flexRow'}>
            <Link toPath={'/'} name={'public app'}/>
            <Link toPath={'/admin'} name={'Admin Home'}/>
            <Link toPath={'/admin/users'} name={'Users'}/>
            <Link toPath={'/admin/analytics'} name={'Analytics'}/>
            {loggedIn && <Link toPath={'/myProfile'} name={'My Profile'}/>}
        </div>
        <div className={'flexRow'}>
            <button className={'btn'} onClick={logout}>Logout</button>
        </div>
    </nav>
));


const pathMap = {
    '/admin': AdminHome,
    '/admin/analytics': Analytics,
    '/admin/users': Users
};


export default () => (
    <React.Fragment>
        <Nav/>
        <Router noMatch={'/admin'} pathMap={pathMap}/>
    </React.Fragment>
);
import {Capsule, Router, lazyLoader, Linkage} from '../../../src';
import React from "react";

const AdminHome = lazyLoader(()=>import('./Pages/AdminHome'));
const Analytics = lazyLoader(()=>import('./Pages/Analytics'));
const Users = lazyLoader(()=>import('./Pages/Users'));



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


const Nav = Capsule({
    mapLogic: {main: 'logout,login'},
    mapState: {main: 'loggedIn,isAdmin'},
    mapActions: {main: 'set'}
})(({onSubmitText, text, set, loggedIn, logout, login, isAdmin}) => (
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

            <div>
                <h6>is Admin: {isAdmin ? "true" : "false"}</h6>
            </div>
        </div>

    </nav>
));



const AdminMain = Capsule({
    mapState: {main: 'loggedIn,isAdmin'},
})(({loggedIn, isAdmin})=>{

    const pathMap = {
        '/admin' : AdminHome,
        '/admin/analytics': Analytics,
        '/admin/users':Users
    };

    return(
        <React.Fragment>
            <Nav/>
            <Router noMatch={'/admin'} pathMap={pathMap}/>
        </React.Fragment>
    )
});



export default AdminMain;
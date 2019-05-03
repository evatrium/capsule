import React from "react";
import {Capsule, Router as PublicRouter, lazyLoader, Linkage} from '../../../src';

const Home = lazyLoader(() => import('./Pages/Home'));
const Detail = lazyLoader(() => import('./Pages/Detail'));
const Login = lazyLoader(() => import('./Pages/Login'));
const MyProfile = lazyLoader(() => import('./Pages/MyProfile'));


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
    mapLogic: {main: 'onSubmitText,loginAsAdmin,logout,login'},
    mapState: {main: 'loggedIn,isAdmin,text'},
    mapActions: {main: 'set'}
})(({onSubmitText, text, set, loggedIn, logout, loginAsAdmin, login, isAdmin}) => (
    <nav className={'nav'}>

        <div className={'flexRow'}>

            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmitText();
            }}>
                <input value={text} onChange={({target}) => set.text(target.value)}/>
                <button className={'btn'} onClick={onSubmitText}> go</button>
            </form>

            <Link toPath={'/tester'} name={'go to special route *'}/>
            <Link toPath={'/'} name={'Home'}/>
            <Link toPath={'/detail'} name={'Detail'}/>
            {loggedIn && <Link toPath={'/myProfile'} name={'My Profile'}/>}
        </div>

        {isAdmin && (
            <div className={'flexRow'}>
                <Link toPath={'/admin'} name={'Admin Home'}/>
                <Link toPath={'/admin/users'} name={'Users'}/>
                <Link toPath={'/admin/analytics'} name={'Analytics'}/>
            </div>
        )}

        <div className={'flexRow'}>
            {loggedIn ?
                <button className={'btn'} onClick={logout}>Logout</button>
                : <button className={'btn'} onClick={login}>login</button>
            }
            <button className={'btn'} onClick={() => loginAsAdmin()}>
                Login as admin
            </button>

            <div>
                <h6>is Admin: {isAdmin ? "true" : "false"}</h6>
            </div>
        </div>

    </nav>
));


const PublicMain = Capsule({
    mapState: {main: 'loggedIn,isAdmin'},
})(() => {

    const pathMap = {
        '/': Home,
        '/detail': Detail,
        '/login': Login,
        '/myProfile': MyProfile
    };

    return (
        <React.Fragment>

            <Nav/>

            <PublicRouter noMatch={'/'} pathMap={pathMap}/>

        </React.Fragment>
    )
});


export default PublicMain
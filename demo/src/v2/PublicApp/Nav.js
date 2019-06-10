import React, {useMemo} from 'react';
import {Capsule, Linkage} from "../../../../src";

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

const FormComponent = ({text, set, onSubmitText}) => {
    return useMemo(() => (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmitText();
        }}>
            <input value={text} onChange={({target}) => set.text(target.value)}/>
            <button className={'btn'} onClick={onSubmitText}> go</button>
        </form>
    ), [text])
};

const Form = Capsule({
    mapActions: {main: 'set'},
    mapLogic: {main: 'onSubmitText'},
    mapState: {main: 'text'}
})(FormComponent);

const NavComponent = ({onSubmitText, text, set, loggedIn, logout, loginAsAdmin, login, isAdmin}) => (
    <nav className={'nav'}>

        <div className={'flexRow'}>
            <Form/>
            <Link toPath={'/tester'} name={'go to special route *'}/>
            <Link toPath={'/'} name={'Home'}/>
            <Link toPath={'/detail'} toParams={{id:3}} name={'Detail'}/>
            <Link toPath={'/todos'} name={'Todos'}/>
            <Link toPath={'/invalidPath'} name={'invalidPath'}/>
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
);


export const Nav = Capsule({
    mapLogic: {main: 'loginAsAdmin,logout,login'},
    mapState: {main: 'loggedIn,isAdmin'},
})(NavComponent);
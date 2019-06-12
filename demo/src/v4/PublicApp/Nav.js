import React, {useMemo} from 'react';
import {Capsule} from "../../../../src";
import {Linkage} from "../../../../src/routing";

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

const FormComponent = ({text, updateNewURLText, onSubmitText, captureEnter}) => {
    return useMemo(() => (
        <React.Fragment>
            <input
                placeholder={'go to a /pathname'}
                onKeyPress={captureEnter}
                value={text}
                onChange={(e) => updateNewURLText(e)}/>
            <button className={'btn'} onClick={onSubmitText}> go</button>
        </React.Fragment>
    ), [text])
};

const Form = Capsule([
    {main: 'text'}, {main: 'onSubmitText,updateNewURLText,captureEnter'},
])(FormComponent);

const NavComponent = ({ loggedIn, logout, loginAsAdmin, login, isAdmin}) => (
    <nav className={'nav'}>

        <div className={'flexRow'}>
            <Form/>
            <Link toPath={'/tester'} name={'go to special route *'}/>
            <Link toPath={'/'} name={'Home'}/>
            <Link toPath={'/detail'} toParams={{id: 3}} name={'Detail'}/>
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
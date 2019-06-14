import {Capsule} from "./index";


const user = Capsule('user', {
    active: false,
    first_name: '',
    last_name: '',
    src: ''
});

const onUserStateChange = ({active}) => {
    user.merge({active});
};

const Avatar = user(({active, first_name, last_name, src}) => {

    return (
        <UserBox>
            <Img src={src}/>
            <Typo text={first_name + ' ' + last_name}/>
        </UserBox>
    );
});


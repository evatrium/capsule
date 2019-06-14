import React from "react";
import {Capsule} from "../../../../../src";


// const user = Capsule('user', {
//         active: false,
//         first_name: '',
//         last_name: '',
//         src: '',
//         data: [],
//         fetching_data: false,
//     }, ({merge}, {collective}) => ({
//         getData: async () => {
//             merge({fetching: true});
//             const data = await collective().api.getData();
//             merge({fetching: false, data});
//         }
//     })
// )();
// Capsule(
//     {mapState: {user: 'data'}, mapLogic: {user: 'getData'}}
// )();


export default class MyProfile extends React.Component {
    componentDidMount() {
        // console.log('mounted Home at this path: ', this.props.url);
    }

    componentWillUnmount() {
        // console.log('unmounted page')
    }

    getUrl = () => window.location.pathname;

    render() {
        return (
            <div className={'page'}>
                <h1>MY PROFILE</h1>
                <h1> you are here {this.getUrl()} </h1>
            </div>
        )
    }
}


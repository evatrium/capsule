import React from "react";
import {Capsule} from '../../../src';

export const Page = Capsule({
    name: 'page',
    logic: ({events, collective}) => {

        const listen = (props) =>
            collective().routing.listen((url) => {
                events.emit('location_update', props)
            });


        return {
            listen,
            onMount: (props) => {
                events.emit('mounted', props);
            }
        }
    },
    mapLogic: {page: 'onMount,listen'}
})(class Page extends React.Component {
    componentDidMount() {
        this.props.onMount && this.props.onMount(this.props);
        this.unlisten = this.props.listen(this.props);
    }

    componentWillUnmount() {
        this.props.unMounted && this.props.unMounted()
        this.unlisten && this.unlisten();
    }

    render() {
        return (
            <div className={'page'}>
                {JSON.stringify(this.props, null, 4)}
            </div>
        )
    }
});
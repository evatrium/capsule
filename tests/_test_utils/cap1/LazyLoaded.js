import React from 'react';
import {Capsule} from './exports'

export default Capsule({
    name: 'app',
    styles: ({color, mixins}) => ({
        app: {
            ...mixins.all100,
        },
        someOtherClass: {
            ...mixins.centerize
        },
        loginButton: {
            background: color.primary
        }
    }),
    logic: ({events, toLogicTest}) => ({
        onMount: (props) => {
            events.emit('mounted', {...props, toLogicTest})
        }
    }),
    mapLogicToProps: {app: 'onMount'}
})(class App extends React.Component {

    componentDidMount() {
        this.props.onMount(this.props);
    }

    render() {
        const {cx, classes} = this.props;
        return (
            <div className={cx(classes.app, classes.someOtherClass)}>
                <button className={classes.loginButton}>loggin</button>
                {JSON.stringify(this.props, null, 4)}
            </div>
        );
    }
});

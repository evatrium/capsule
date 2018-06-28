import React from 'react';
import {Provider} from 'react-redux';
import withStyles, { ThemeProvider } from 'react-jss';
import preset from 'jss-preset-default';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
const jss = create(preset());


export class MainComponent extends React.PureComponent {
    render() {
        const {
            children,
            store,
            global_styles,
            theme
        } = this.props;
        let GlobalStylesWrapper = props => props.children;
        GlobalStylesWrapper = withStyles(global_styles)(GlobalStylesWrapper);
        return (
            <Provider store={store}>
                <JssProvider jss={jss}>
                    <ThemeProvider theme={theme}>
                        <GlobalStylesWrapper>
                            {children}
                        </GlobalStylesWrapper>
                    </ThemeProvider>
                </JssProvider>
            </Provider>
        );
    };
}
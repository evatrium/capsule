
/*
-------------------- THEME -----------------------
 */


export const theme = {
    colors : [
        '#93ccdc',
        '#68accc',
        '#c49cc9',
        '#252336',
    ],
    nav:{
        height: 60
    }
};

/*
-------------------- GLOBAL STYLES -----------------------
 */

export const global_styles = () => ({
    '@global': {
        html: {
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
            WebkitFontSmoothing: 'antialiased', // Antialiasing.
            MozOsxFontSmoothing: 'grayscale', // Antialiasing.
            touchAction: 'manipulation',
            fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
            color: 'white',
            background:theme.colors[3]
        },
        '#root': {
            height: '100%',
            width: '100%'
        },
        body: {
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
            background:theme.colors[3]
        },
        '*': {
            boxSizing: 'border-box',
        },



    },
});
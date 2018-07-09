
/*
-------------------- THEME -----------------------
 */


export const theme = {
    colors : [
        '#93ccdc',
        '#68accc',
        '#c49cc9',
        '#57547d',
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
            background:'white',
            boxSizing: 'border-box',
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
            background:'white'
        },
        '*, *::before, *::after': {
            boxSizing: 'inherit',
        },



    },
});
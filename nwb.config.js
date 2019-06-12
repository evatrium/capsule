module.exports = {
    type: 'react-component',
    // webpack: {
    //     uglify: {
    //         sourceMap: false
    //     }
    // },
    npm: {
        esModules: true,
        umd: {
            global: 'capsule',
            externals: {
                react: 'React'
            }
        }
    },
    devServer: {
        hot: false
    }
};

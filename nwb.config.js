module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'capsule',
      externals: {
        react: 'React'
      }
    }
  },
  devServer:{
    hot: false
  }
};

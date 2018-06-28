const tester = require('./dist').tester;

tester().then(()=>{
    process.exit();
});
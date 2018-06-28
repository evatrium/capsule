let log_this = '';
const log = (it) => {
    let val;
    if (typeof it !== 'string') {
        val = JSON.stringify(it, null, 4);
    } else {
        val = it;
    }
    log_this = '\n' + log_this + '\n' + val + '\n';
};


export const tester = () => {
    return new Promise((resolve, reject) => {
        console.log(log_this);

        console.log('working');


        resolve()
    })
};
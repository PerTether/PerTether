
'use strict';

function getNumberInNormalDistribution(mean,std_dev){
    return mean + (randomNormalDistribution() * std_dev);
}

function randomNormalDistribution(){
    let u = 0.0, v = 0.0, w = 0.0, c;
    do {
        u =Math.random() * 2 - 1.0;
        v = Math.random() * 2 - 1.0;
        w = u * u + v * v;
    } while (w === 0.0|| w>= 1.0);
    c = Math.sqrt((-2 * Math.log(w)) / w);
    return u * c;
}

// function main() {
//     let res = [
//         ['0', 0],
//         ['2', 0],
//         ['4', 0],
//         ['6', 0],
//         ['8', 0],
//         ['10', 0],
//         ['12', 0],
//         ['14', 0],
//         ['16', 0],
//         ['18', 0],
//         ['20', 0],
//     ];
//     for (let i = 0; i < 1000; i ++){
//         let a = getNumberInNormalDistribution(12, 4);
//         let b = parseInt(a / 2);
//         console.log(a);
//         console.log(b);
//         if(b > 10) b = 10;
//         res[b][1] += 1;
//     }
//     for (let i = 0; i < 11; i ++) {
//         console.log(`${res[i][0]}:${res[i][1]}`);
//     }
// }
// main();
module.exports.getNumberInNormalDistribution = getNumberInNormalDistribution;

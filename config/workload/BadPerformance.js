
'use strict';

module.exports.run = function (level) {
    return {
        func: 'badPerfLevel' + level,
        param: [Math.random().toString(36).substr(2), Math.ceil(Math.random() * 10)]
    };
};

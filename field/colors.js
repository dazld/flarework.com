'use strict';

let colors = [
    '#53c9e3',
    '#86d9eb',
    '#cbeff7',
    '#ffffff',
    '#bfbfbf',
    '#9db4ba',
    '#69a4b1',
    '#438a99',
    '#daf303',
    '#e7e710',
    '#cddb1b',
    '#9ed223',
    '#51c330'
];

function makeIterator(items) {
    let count = 0;
    const numItems = items.length;

    return function () {
        count = count + 1;
        if (count >= numItems) {
            count = 0;
        }

        return items[count];
    };
}

const getColor = function () {
    const len = colors.length;

    return function (ratio) {
        return colors[Math.floor(ratio * len)];
    };
}();

function loadRandom(){
    fetch('https://sidesketch.com/api/palettes/random')
        .then(res => res.json())
        .then(data => colors = data.hex);

}

const cols = makeIterator(colors);

module.exports = {
    cols,
    colors,
    getColor,
    loadRandom
};

'use strict';

const colors = [
    '#e1252c',
    '#e2b250',
    '#496ec6',
    '#d3383d',
    '#d49f57',
    '#656ead',
    '#c64c4f',
    '#c68c5f',
    '#816d95',
    '#b85f60',
    '#b87966',
    '#9c6d7c',
    '#c63248',
    '#aa3f64',
    '#8e4d80',
    '#735a9c',
    '#657ab1',
    '#81879b',
    '#9d9386',
    '#b89f70',
    '#e29849',
    '#e27f43',
    '#e2653c',
    '#e14b36',
    '#e13e33'
];

function makeIterator(items) {
    let count = 0;
    const numItems = items.length;

    return function () {
        count = count + 1;
        if (count > numItems) {
            count = 0;
        }

        return items[count];
    };
}

const cols = makeIterator(colors);

module.exports = {
    cols,
    colors
};

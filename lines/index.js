/* eslint-env node, browser */
/* eslint-disable id-length */
'use strict';

const resize = require('canvas-fit');
const {cols} = require('./colors');
const Bird = require('./beings/bird');
const Chomper = require('./beings/chomper');

const bounds = {
    x: window.innerWidth * devicePixelRatio,
    y: window.innerHeight * devicePixelRatio
};

// populate sketch
const numBeings = window.innerWidth > 640 ? 350 : 50;
const food = Array(numBeings)
    .fill('')
    .map(function (_, idx) {
        const debug = idx === 0;

        return new Bird({
            x: Math.random() * bounds.x,
            y: Math.random() * bounds.y,
            fill: cols(),
            debug
        });
    });

const predators = [new Chomper({
    x: Math.random() * bounds.x,
    y: Math.random() * bounds.y,
    fill: 'white',
    debug: true,
    targets: {
        food,
        removeAtIdx: function (idx) {
            return food.splice(idx, 1);
        }
    }
}),new Chomper({
    x: Math.random() * bounds.x,
    y: Math.random() * bounds.y,
    fill: 'white',
    debug: true,
    targets: {
        food,
        removeAtIdx: function (idx) {
            return food.splice(idx, 1);
        }
    }
}),new Chomper({
    x: Math.random() * bounds.x,
    y: Math.random() * bounds.y,
    fill: 'white',
    debug: true,
    targets: {
        food,
        removeAtIdx: function (idx) {
            return food.splice(idx, 1);
        }
    }
})];

// setup stage
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const fit = resize(canvas, undefined, devicePixelRatio);

window.addEventListener('resize', fit(canvas), false);

// Main loop
function animate() {
    context.fillStyle = 'rgba(255,255,255,0.25';
    context.clearRect(0, 0, window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);
    food.concat(predators).forEach(function (b) {
        b.update(context);
        b.draw(context);
    });
    requestAnimationFrame(animate);
}

animate();

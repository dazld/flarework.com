/* eslint-env node, browser */
/* eslint-disable id-length */
'use strict';

const resize = require('canvas-fit');
const {cols} = require('./colors');
const Bird = require('./beings/bird');

const bounds = {
    x: window.innerWidth * devicePixelRatio,
    y: window.innerHeight * devicePixelRatio
};

// populate sketch
const numBeings = window.innerWidth > 640 ? 300 : 20;
const birds = Array(numBeings)
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

// setup stage
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const fit = resize(canvas, undefined, devicePixelRatio);

window.addEventListener('resize', fit(canvas), false);

// Main loop
function animate() {
    context.fillStyle = 'rgba(255,255,255,0.25';
    context.clearRect(0, 0, window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);
    birds.forEach(function (b) {
        b.update();
        b.draw(context);
    });
    requestAnimationFrame(animate);
}

animate();

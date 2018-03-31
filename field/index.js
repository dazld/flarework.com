/* eslint-env node, browser */
/* eslint-disable id-length */
'use strict';

const resize = require('canvas-fit');
const Victor = require('victor');
const SimplexNoise = require('simplex-noise');
const {cols} = require('./colors');

const noise = new SimplexNoise();

// setup stage
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const fit = resize(canvas, undefined, devicePixelRatio);

window.addEventListener('resize', fit(canvas), false);

// setup entities
const bounds = {
    x: window.innerWidth * devicePixelRatio,
    y: window.innerHeight * devicePixelRatio
};

class Point {
    constructor({fill, debug, x, y}){
        this.fill = fill;
        this.debug = debug;
        this.position = new Victor(x, y);
        this.direction = 0;
    }
    update(n) {
        const angle = n * (Math.PI * 2);
        this.direction = angle;
    }
    draw({ctx, x, y}) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.direction);
        ctx.translate(-25, -50);
        ctx.beginPath();
        ctx.strokeStyle = this.fill;
        ctx.lineWidth = 1;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 10);
        ctx.stroke();
        ctx.restore();
        // if (this.debug) {
        //     this.drawDebug(ctx);
        // }
    }
}

const square = 64;
const vecs = Array(square)
    .fill('')
    .map(function (_, cidx) {
        const row = Array(square).fill('')
            .map(function (__, ridx) {
                return new Point({
                    x: ridx,
                    y: cidx,
                    debug: true,
                    fill: cols()
                });
            });

        return row;
    });

// Main loop
function animate(dt) {
    context.fillStyle = 'rgba(255,255,255,0.25';
    context.clearRect(0, 0, window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);

    const spacingX = devicePixelRatio * window.innerWidth / square;
    const spacingY = devicePixelRatio * window.innerHeight / square;

    vecs.forEach(function (row, col) {
        row.forEach(function (el, row) {
            el.update(noise.noise3D(row / 32, col / 32, dt / 10000));
            el.draw({
                ctx: context,
                x: row * spacingX,
                y: col * spacingY
            });
        });
    });
    requestAnimationFrame(animate);
}

animate(0);

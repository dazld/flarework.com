/* eslint-env node, browser */
/* eslint-disable id-length */
'use strict';

const resize = require('canvas-fit');
const Victor = require('victor');
const {GUI} = require('dat-gui');
const SimplexNoise = require('simplex-noise');
const {cols, getColor, loadRandom} = require('./colors');

const noise = new SimplexNoise();
const gui = new GUI();

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

class Controls {
    constructor() {
        this.length = 30;
        this.width = 1;
        this.interval = 30000;
        this.blankingOpacity = 0.2;
        this.newPalette = loadRandom;
        this.piScale = 2;
        this.offsetX = 0;
        this.offsetY = 0;
    }
}

const c = new Controls();

gui.add(c, 'length', 1, 100);
gui.add(c, 'width', 1, 100);
gui.add(c, 'interval', 1000, 30000);
gui.add(c, 'blankingOpacity', 0, 0.5);
gui.add(c, 'piScale', 0.1, 12);
gui.add(c, 'offsetX', -50, 50);
gui.add(c, 'offsetY', -50, 50);

gui.add(c, 'newPalette');

class Point {
    constructor({fill, debug, x, y}){
        this.fill = fill;
        this.debug = debug;
        this.position = new Victor(x, y);
        this.direction = 0;
    }
    update(n) {
        const angle = n * (Math.PI * c.piScale);

        this.direction = angle;
        this.n = n;
    }
    draw({ctx, x, y}) {
        const absn = Math.abs(this.n);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.direction);
        ctx.translate(c.offsetX, c.offsetY);
        ctx.beginPath();
        ctx.strokeStyle = getColor(absn);
        ctx.lineWidth = c.width;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, c.length);
        ctx.stroke();
        ctx.restore();
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
    context.fillStyle = `rgba(50,50,50,${c.blankingOpacity})`;
    context.fillRect(0, 0, window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);

    const spacingX = devicePixelRatio * window.innerWidth / square;
    const spacingY = devicePixelRatio * window.innerHeight / square;

    vecs.forEach(function (row, col) {
        row.forEach(function (el, row) {
            el.update(noise.noise3D(row / 32, col / 32, dt / c.interval));
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

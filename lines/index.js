/* eslint-env node, browser */
/* eslint-disable id-length */
'use strict';

const Victor = require('victor');
const resize = require('canvas-fit');
const {triangle} = require('./shapes');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const fit = resize(canvas, undefined, devicePixelRatio);

window.addEventListener('resize', fit(canvas), false);


class Bird {
    constructor(x, y) {
        this.position = new Victor(x, y);
        this.direction = Math.random() * Math.PI * 2;
        this.speed = 0;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.direction);
        ctx.translate(-25, -50);
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.moveTo(0, 0);
        let cx = 0;
        let cy = 0;

        triangle.forEach(function (point) {
            ctx.lineTo(cx + point.x, cy + point.y);
            cx += point.x;
            cy += point.y;
        });

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    update() {

    }
}

const b = new Bird(300, 100);

b.draw(context);



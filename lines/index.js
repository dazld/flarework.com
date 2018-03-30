/* eslint-env node, browser */
/* eslint-disable id-length */
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

function makeIterator(items){
    let count = 0;
    const numItems = items.length;

    return function () {
        count++;
        if (count > numItems) {
            count = 0;
        }

        return items[count];
    };
}

const cols = makeIterator(colors);

const Victor = require('victor');
const resize = require('canvas-fit');
const {triangle} = require('./shapes');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const fit = resize(canvas, undefined, devicePixelRatio);

window.addEventListener('resize', fit(canvas), false);

class Bird {
    constructor({x, y, debug, fill}) {
        this.position = new Victor(x, y);
        this.speed = 11;
        this.direction = Math.random() * Math.PI * 2;
        this.scaler = (Math.random() * 0.05) + 0.94;
        this.debug = debug;
        this.fill = fill;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.direction);
        ctx.translate(-25, -50);
        ctx.beginPath();
        ctx.fillStyle = this.fill;
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
        // ctx.stroke();
        ctx.restore();
        ctx.font = '34px Monaco';
        // ctx.fillText(`${this.position.toArray().map(n => n.toPrecision(6))}`, 34, 34);
    }
    update() {
        if (this.speed === 0) {
            return;
        }
        const accel = new Victor(this.speed, 0);

        accel.rotateBy(this.direction);
        this.position.add(accel);


        this.speed = this.speed * this.scaler;
        if (this.speed < 0.1) {
            this.speed = 0;
        }

        const bounds = {
            x: window.innerWidth * devicePixelRatio,
            y: window.innerHeight * devicePixelRatio
        };

        const [x, y] = this.position.toArray();


        if (x < 0) {
            this.position.x = bounds.x;
        }

        if (y < 0) {
            this.position.y = bounds.y;
        }

        if (x > bounds.x) {
            this.position.x = 0;
        }

        if (y > bounds.y) {
            this.position.y = 0;
        }
    }
}


const bounds = {
    x: window.innerWidth * devicePixelRatio,
    y: window.innerHeight * devicePixelRatio
};
const birds = Array(250)
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

function animate() {
    context.fillStyle = 'rgba(255,255,255,0.12';
    context.fillRect(0, 0, window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);
    birds.forEach(function(b){
        b.update();
        b.draw(context);
        if (b.speed === 0) {
            b.speed = Math.random() * 10;
        }
    });

    requestAnimationFrame(animate);
}

animate();

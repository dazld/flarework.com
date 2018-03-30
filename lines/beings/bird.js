/* eslint-env node, browser */
/* eslint-disable id-length */
'use strict';

const Victor = require('victor');
const {triangle} = require('../shapes');
const randomDirection = () => Math.random() * Math.PI * 2;

class Bird {
    constructor({x, y, debug, fill}) {
        this.position = new Victor(x, y);
        this.speed = 0;
        this.direction = randomDirection();
        this.target = this.direction;
        this.scaler = (Math.random() * 0.05) + 0.94;
        this.debug = debug;
        this.fill = fill;
    }
    drawDebug(ctx) {
        const pos = this.position.toArray();

        ctx.font = '18px Monospace';
        ctx.fillStyle = 'black';
        ctx.fillText(`[${pos.map((n) => n.toFixed(0)).join(', ')}]`, ...pos);
        ctx.fillText(`${this.speed.toFixed(2)}, ${this.direction.toFixed(2)}, ${this.target.toFixed(2)}`, pos[0], pos[1] + 22);
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
        ctx.restore();
        if (this.debug) {
            this.drawDebug(ctx);
        }
    }
    checkBounds() {
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
    checkSpeed() {
        if (this.speed < 0.1) {
            this.speed = (Math.random() * 10) + 5;
        }
    }
    checkDirection() {
        if (this.target === this.direction) {
            this.target = randomDirection();
        }
    }
    update() {
        this.checkBounds();
        this.checkSpeed();
        this.checkDirection();
        const accel = new Victor(this.speed, 0);

        accel.rotateBy(this.direction);
        this.position.add(accel);
        this.speed = this.speed * this.scaler;
    }
}

module.exports = Bird;

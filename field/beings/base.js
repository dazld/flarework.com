/* eslint-env node, browser */
/* eslint-disable id-length */
'use strict';
const Victor = require('victor');
const randomDirection = () => Math.random() * Math.PI * 2;

class BaseBeing {
    constructor({x, y, debug, fill}) {
        this.position = new Victor(x, y);
        this.speed = 0;
        this.direction = randomDirection();
        this.target = this.direction;
        this.debug = debug;
        this.fill = fill;
        this.shape = [];
    }
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @returns {undefined}
     */
    drawDebug(ctx) {
        const pos = this.position.toArray();

        ctx.font = '18px Monospace';
        ctx.fillStyle = 'black';
        ctx.fillText(`[${pos.map((n) => n.toFixed(0)).join(', ')}]`, ...pos);
        ctx.fillText(`${this.speed.toFixed(2)}, ${this.direction.toFixed(2)}, ${this.target.toFixed(2)}`, pos[0], pos[1] + 22);
    }
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @returns {undefined}
     */
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

        this.shape.forEach(function (point) {
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
        // World is a torus!
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

    /**
     * Hook for implementing specific behaviour during update loop
     * @abstract
     * @returns {undefined}
     */
    onBeforeUpdate() {
        return this;
    }
    update(ctx) {
        this.onBeforeUpdate(ctx);
        this.checkBounds();
        this.checkSpeed();
    }
}

module.exports = {
    BaseBeing,
    randomDirection
};

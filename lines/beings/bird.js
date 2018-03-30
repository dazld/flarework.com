/* eslint-env node, browser */
/* eslint-disable id-length */
'use strict';

const Victor = require('victor');
const {BaseBeing, randomDirection} = require('./base');
const {triangle} = require('../shapes');

class Bird extends BaseBeing {
    constructor(...args) {
        super(...args);
        this.shape = triangle;
        this.scaler = (Math.random() * 0.05) + 0.94;
    }
    checkDirection() {
        if (this.target === this.direction) {
            this.target = randomDirection();
        }
    }
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @returns {undefined}
     */
    onBeforeUpdate(ctx) {
        this.checkDirection();
        const accel = new Victor(this.speed, 0);

        accel.rotateBy(this.direction);
        this.position.add(accel);
        this.speed = this.speed * this.scaler;
    }
}

module.exports = Bird;

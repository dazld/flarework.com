/* eslint-env node, browser */
/* eslint-disable id-length */
'use strict';
const Victor = require('victor');
const {BaseBeing, randomDirection} = require('./base');
const {triangle} = require('../shapes');

class Chomper extends BaseBeing {
    constructor({targets}) {
        super(...arguments);
        this.shape = triangle;
        this.scaler = (Math.random() * 0.05) + 0.94;
        this.targets = targets;
    }
    hunt(ctx) {
        const [x, y] = this.position.toArray();
        const targets = [...this.targets.food];
        let closestDistance = Infinity;
        let targetIdx = 0;

        const closestTarget = targets.reduce((target, candidate, idx) => {
            const distance = this.position.distance(candidate.position);

            if (distance < closestDistance) {
                closestDistance = distance;
                targetIdx = idx;
                candidate.debug = true;

                return candidate;
            } else {
                candidate.debug = false;
            }

            return target;
        }, targets.pop());

        this.direction = Math.atan2(...closestTarget.position.toArray()) - Math.atan2(...this.position.toArray());
        this.position = this.position.mix(closestTarget.position, 0.2);
        if (closestDistance < 40) {
            this.targets.removeAtIdx(targetIdx);
        }
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @returns {undefined}
     */
    onBeforeUpdate(ctx) {
        this.hunt(ctx);
        const accel = new Victor(this.speed, 0);

        accel.rotateBy(this.direction);
        this.position.add(accel);
        // this.speed = this.speed * this.scaler;
    }
}

module.exports = Chomper;

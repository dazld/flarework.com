/* global window, document */
'use strict';

const container = document.createElement('div');

document.body.appendChild(container);

// height & width
const hw = (function (w) {
    const dets = {
        width: w.innerWidth,
        height: w.innerHeight,
        get wpx() {
            return `${this.width}px`;
        },
        get hpx() {
            return `${this.height}px`;
        }
    };

    w.addEventListener('resize', function () {
        dets.width = window.innerWidth;
        dets.height = window.innerHeight;
    });

    return dets;
}(window));

const spacing = 2;
const size = hw.width / 4;

function doIt() {
    return Math.random() > 0.5;
}

function randInt(max = 10) {
    return Math.round(Math.random() * max);
}

function makeSquare(x, y, localSize, depth = 1) {
    const ops = [];
    const recurse = doIt();

    if (recurse && localSize > 8) {
        const nextDepth = depth + 1;
        const hs = (localSize / 2);

        ops.push(makeSquare(x, y, hs, nextDepth));
        ops.push(makeSquare(x + hs, y, hs, nextDepth));
        ops.push(makeSquare(x, y + hs, hs, nextDepth));
        ops.push(makeSquare(x + hs, y + hs, hs, nextDepth));
    } else {
        const timeToAnimate = (depth * 150) + randInt(depth * 150);
        const square = document.createElement('div');
        const halfSpace = spacing / 2;

        square.className = `square level${depth}`;
        square.style.top = `${x + halfSpace}px`;
        square.style.left = `${y + halfSpace}px`;
        square.style.height = `${localSize - halfSpace}px`;
        square.style.width = `${localSize - halfSpace}px`;
        ops.push(Promise.resolve()
                .then(delay(timeToAnimate))
                .then(function () {
                    container.appendChild(square);
                }));
    }

    return Promise.all(ops);
}

function delay(time) {
    return function (...args) {
        return new Promise(function (res) {
            setTimeout(res.bind(res, ...args), time);
        });
    };
}

function anim() {
    container.innerHTML = '';
    const ops = [];

    for (let x = 0; x <= hw.width; x += size) {
        for (let y = 0; y <= hw.height; y += size) {
            ops.push(makeSquare(y, x, size, 1));
        }
    }
    Promise.all(ops)
            .then(delay(3000))
            .then(anim);
}

anim();


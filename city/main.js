/* global window, document */
'use strict';
const container = document.querySelector('#base');
const hw = (function (base) {
    const box = base.getBoundingClientRect();
    const width = window.innerWidth;

    const dets = {
        width: width * 0.66,
        height: width * 0.66,
        get wpx() {
            return `${this.width}px`;
        },
        get hpx() {
            return `${this.height}px`;
        }
    };

    window.addEventListener('resize', function () {
        const side = window.innerWidth * 0.66;
        dets.width = side;
        dets.height = side;
    });

    return dets;
}(container));

const spacing = 3;
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

    if (recurse && localSize > 4) {
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
        square.style.top = `${x}px`;
        square.style.left = `${y}px`;
        square.style.height = `${localSize - halfSpace}px`;
        square.style.width = `${localSize - halfSpace}px`;

        ops.push(Promise.resolve()
                .then(delay(timeToAnimate))
                .then(function () {
                    container.appendChild(square);
                })
                .then(delay(1))
                .then(function () {
                    square.style.transform = `translateZ(${depth * 15}px)`;
                    square.style.opacity = `${depth / 6}`;
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

    for (let x = 0; x < hw.width; x += size) {
        for (let y = 0; y < hw.height; y += size) {
            ops.push(makeSquare(x, y, size, 1));
        }
    }
    Promise.all(ops)
            .then(delay(12000))
            .then(anim);
}

anim();


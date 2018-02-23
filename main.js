const container = document.createElement('div');
document.body.appendChild(container);

// height & width
var hw = (function (w) {
  w.addEventListener('resize', function(){
    dets.width = window.innerWidth;
    dets.height = window.innerHeight;
  });
  var dets = {
    width: w.innerWidth,
    height: w.innerHeight,
    get wpx() {
      return this.width + 'px';
    },
    get hpx() {
      return this.height + 'px';
    }
  };
  return dets;
})(window);

function doIt() {
  return Math.random() > 0.5;
}

function randInt(max = 10){
    return Math.round(Math.random() * max);
}


var spacing = 2;

async function makeSquare(x, y, size, depth) {
  depth = depth || 1;

  const ops = [];
  var recurse = doIt();

  if (recurse && size > 2) {
    depth += 1;
    var hs = (size / 2);
    ops.push(makeSquare(x, y, hs, depth));
    ops.push(makeSquare(x + hs, y, hs, depth));
    ops.push(makeSquare(x, y + hs, hs, depth));
    ops.push(makeSquare(x + hs, y + hs, hs, depth));

  } else {

    var timeToAnimate = randInt(Math.pow(depth, 3)) * 10;
    var square = document.createElement('div');
    square.className = 'square level'+depth;
    square.style.transform = 'scale(1)';
    square.style.top = x + spacing/2 + "px";
    square.style.left = y + spacing/2 + "px";
    square.style.height = size - spacing/2 + "px";
    square.style.width = size - spacing/2 +"px";
    square.style.zIndex = depth;
    ops.push(Promise.resolve()
                .then(delay(timeToAnimate))
                .then(function(){
                    container.appendChild(square); 
                }))  
  }

  return Promise.all(ops);
}

var size = hw.width / 4;

function delay(time) {
  return function() {
    const args = Array.from(arguments);
    return new Promise(function(res, rej){
      setTimeout(res.bind(res, ...args), time);
    });
  }
}

function anim() {
  container.innerHTML = '';
  const ops = [];
  for (var x = 0; x < hw.width; x += size) {
    for (var y = 0; y < hw.height; y += size) {
      ops.push(makeSquare(y, x, size, 1))
    }
  }
  Promise.all(ops)
    .then(delay(1000))
    .then(anim);
}

anim();


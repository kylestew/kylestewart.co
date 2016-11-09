define(function(require) {
  // require('lib/dat.gui.min');


  /* == ARRAY == */
  function getNs(n, v) {
    const res = [];
    for (let i = 0; i < n; i++) {
      res.push(v);
    }
    return res;
  }

  function getLinspaceYLinspaceX(n, xMin, xMax, yMin, yMax) {
    const res = [];
    const sX = (xMax - xMin) / n;
    const sY = (yMax - yMin) / n;
    let x = xMin;
    let y = yMin;

    for (let i = 0; i < n; i++) {
      res.push({x, y});
      x += sX;
      y += sY;
    }
    return res;
  }

//   function getGrid(n) {
//   const res = [];
//   for (let i=0; i<n; i++) {
//     for (let j=0; j<n; j++) {
//       const near = [];
//       if (i>0) {
//         near.push((i-1)*n+j);
//       }
//       if (i<n-1) {
//         near.push((i+1)*n+j);
//       }
//       if (j>0) {
//         near.push(i*n+j-1);
//       }
//       if (j<n-1) {
//         near.push(i*n+j+1);
//       }
//       res.push({ i, j, near });
//     }
//   }
//   return res;
// }

  function getGridPos(num, grid, rad, xMid, yMid) {

  }

  function permute(arr, noise) {
    const newArr = arr.map((v) => {
      const rnd = (1.0 - 2*Math.random()) * noise;
      return v + rnd;
    });
    return newArr;
  }

  function limit(v, ma, mi) {
    return Math.max(Math.min(v, ma), mi);
  }
  /* =========== */


  /* == DRAW == */
  const WHITE = 'rgba(255, 255, 255, 1.0)';
  const GRAY = 'rgba(0, 0, 0, 0.6)';
  const LIGHTGRAY = 'rgba(0, 0, 0, 0.05)';
  const CYAN = 'rgba(0, 170, 170, 1.0)';

  const PI = Math.PI;
  const TWOPI = Math.PI * 2.0;
  const HPI = Math.PI * 0.5;

  function drawPath(ctx, p) {
    //...
  }

  function drawDots(ctx, p, rad, fill) {
    for (let i = 0; i < p.length; i++) {
      const x = p[i].x;
      const y = p[i].y;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, TWOPI);
      if (fill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }
  }

  function clear(ctx, width, height) {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fill();
  }
  /* ========== */


  const LINEWIDTH = 2;
  const THINLINEWIDTH = 1;

  var num;
  const dotSize = 1.0;
  const noise = 0.01;


  function setup() {
    ctx.lineWidth = THINLINEWIDTH;

    ctx.fillStyle = WHITE;
    clear(ctx, width, height);

    ctx.strokeStyle = GRAY;
    ctx.fillStyle = 'rgba(0,0,0,0.05)';

    num = Math.floor(width);

    path = getLinspaceYLinspaceX(num, 0, width, height/2, height/2); // flat line
    velocity = getNs(num, 0); // empty array
  }

  function drawFrame() {
    // use velocity to affect path
    velocity = permute(velocity, noise);
    let s = 0;
    path = path.map(({x, y}, i) => {
      s += velocity[i];
      return {
        x,
        y: limit(y+s, height, 0)
      };
    });

    drawDots(ctx, path, dotSize, true);
  }


  // setup canvas
  var width, height;
  const canvas = document.getElementById("render-canvas");
  const ctx = canvas.getContext('2d');
  var updateCanvasSize = function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    setup();
  }
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize, false);

  // animation loop
  function animate() {
    requestAnimationFrame(animate);
    drawFrame();
  }
  setup();
  animate();
});

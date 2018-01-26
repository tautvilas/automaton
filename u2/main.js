const WIDTH = 600;
const HEIGHT = 600;
const CWIDTH = 10;
const CHEIGHT = 10;
const COLS = WIDTH / CWIDTH;
const ROWS = HEIGHT / CHEIGHT;

let cells =  Array.apply(null, Array(COLS * ROWS));
const canvas = document.getElementById("canvas");
canvas.addEventListener('mousedown', function(event) {
  if (event.buttons !== 1) return;
  const px = event.pageX - canvas.offsetLeft;
  const py = event.pageY - canvas.offsetTop;
  const x = ~~(px  / CWIDTH);
  const y = ~~(py  / CHEIGHT);
  cells[y * COLS + x] = 3;
}, false);
const ctx = canvas.getContext("2d");

function at(index) {
  return {
    x: index % COLS,
    y: ~~(index / COLS)
  }
}

function ta({x, y}) {
  return (y * COLS + x);
}

function neighbours({x, y}) {
  return [
    {x: x + 1, y},
    {x: x - 1, y},
    {x, y: y + 1},
    {x, y: y - 1},
    {x: x + 1, y: y + 1},
    {x: x - 1, y: y - 1},
    {x: x + 1, y: y - 1},
    {x: x - 1, y: y + 1},
  ];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

let renderFinished = true;
cells = cells.map(c => 0);

setInterval(() => {
  if (!renderFinished) {
    console.warn('frame skipped');
    return;
  };
  renderFinished = false;

  cells.forEach((c, i) => {
    const ns = neighbours(at(i));
    const n = ns[getRandomInt(ns.length)];
    const neighbour = cells[ta(n)];
    if (neighbour !== undefined) {
      const diff = getRandomInt(3);
      if (Math.abs(neighbour + c) > 1) return;
      const newVal1 = neighbour + diff - 1;
      const newVal2 = c + diff - 1;
      if (newVal1 > -3 && newVal1 < 3 && newVal2 > -3 && newVal2 < 3) {
        cells[ta(n)] = newVal1;
        cells[at(i)] = newVal2;
      }
    }
  })
  cells.forEach((val, i) => {
    ctx.fillStyle = '#' + (50 + 10 * val) + '0000';
    const {x, y} = at(i);
    ctx.fillRect(x * CWIDTH, y * CHEIGHT, CWIDTH, CHEIGHT);
    return val;
  });

  renderFinished = true;
}, 10);


const WIDTH = 600;
const HEIGHT = 600;
const CWIDTH = 2;
const CHEIGHT = 2;
const COLS = WIDTH / CWIDTH;
const ROWS = HEIGHT / CHEIGHT;
const COLORMAP = [
  '#000000',
  '#200000',
  '#400000',
  '#600000',
  '#800000',
];

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
      if (neighbour === 0 && c === 0) return;
      //if ((neighbour < 0 && c < 0) || (neighbour > 0 && c > 0)) return;
      //if (Math.abs(neighbour + c) > 1) return;
      let diff = getRandomInt(3) - 1;
      const polarity = Math.abs(neighbour - c);
      const exchangeChance = getRandomInt(10);
      if (exchangeChance > polarity) {
        return;
      }
      //console.log(neighbour + c);
      if (Math.abs(neighbour + diff + (c - diff)) > Math.abs((c + neighbour))) {
        diff = -diff;
      }
      const newVal1 = neighbour + diff;
      const newVal2 = c - diff;
      if (newVal1 > -3 && newVal1 < 3 && newVal2 > -3 && newVal2 < 3) {
        //console.log(neighbour, c, newVal1, newVal2, diff, ta(n), at(i));
        //debugger;
        cells[ta(n)] = newVal1;
        //cells[i] = newVal2;
      }
    }
  })
  cells.forEach((val, i) => {
    ctx.fillStyle = COLORMAP[val + 2];
    const {x, y} = at(i);
    ctx.fillRect(x * CWIDTH, y * CHEIGHT, CWIDTH, CHEIGHT);
    return val;
  });

  renderFinished = true;
}, 1);


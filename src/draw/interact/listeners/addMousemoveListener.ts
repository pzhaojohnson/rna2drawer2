interface Movement {
  x: number;
  y: number;
}

interface MousemoveListener {
  (event: MouseEvent, movement: Movement): void;
}

let prevX = NaN;
let prevY = NaN;

let listeners = [] as MousemoveListener[];

window.addEventListener('mousemove', event => {
  let currX = event.screenX;
  let currY = event.screenY;
  let movement = {
    x: currX - prevX,
    y: currY - prevY,
  };
  if (Number.isFinite(movement.x) && Number.isFinite(movement.y)) {
    listeners.forEach(f => f(event, movement));
  }
  prevX = currX;
  prevY = currY;
});

export function addMousemoveListener(f: MousemoveListener) {
  listeners.push(f);
}

interface MouseupListener {
  (event: MouseEvent): void;
}

let listeners = [] as MouseupListener[];

window.addEventListener('mouseup', event => {
  listeners.forEach(f => f(event));
});

export function addMouseupListener(f: MouseupListener) {
  listeners.push(f);
}

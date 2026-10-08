export const bus = {
  progress: 0,
  section: 0,
  pointerX: 0,
  pointerY: 0,
  flavorIndex: 0,
  reduced: false,
};

const flavorListeners = new Set<() => void>();

export function setFlavorIndex(index: number) {
  bus.flavorIndex = index;
  flavorListeners.forEach((fn) => fn());
}

export function subscribeFlavor(fn: () => void) {
  flavorListeners.add(fn);
  return () => flavorListeners.delete(fn);
}

export function getFlavorIndex() {
  return bus.flavorIndex;
}

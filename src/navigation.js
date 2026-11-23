// PUBLIC_INTERFACE
export function nextFocus(target, direction) {
  /** Move within a row-major board; bottom Down reaches restart, restart Up reaches 7. */
  if (target === 'restart') return direction === 'up' ? 7 : target;
  if (!Number.isInteger(target) || target < 0 || target > 8) return 0;
  switch (direction) {
    case 'left': return target % 3 === 0 ? target : target - 1;
    case 'right': return target % 3 === 2 ? target : target + 1;
    case 'up': return target < 3 ? target : target - 3;
    case 'down': return target > 5 ? 'restart' : target + 3;
    default: return target;
  }
}

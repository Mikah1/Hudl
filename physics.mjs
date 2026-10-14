export const G = 9.81;
export function solve(speed, angle) {
  const radians = angle * Math.PI / 180;
  const vx = speed * Math.cos(radians), vy = speed * Math.sin(radians);
  const rise = vy / G, total = 2 * rise;
  return {x0:vx, xavg:vx, xf:vx, dx:vx*total, xt:total, xa:0,
    y0:vy, yavg:vy/2, yf:0, dy:vy*vy/(2*G), yt:rise, ya:-G,
    speed, rise, total, height:vy*vy/(2*G), range:vx*total};
}
export function isCorrect(input, expected) {
  if (String(input).trim() === '' || !Number.isFinite(Number(input))) return false;
  return Math.abs(Number(input)-expected) <= Math.max(0.015, Math.abs(expected)*0.01);
}
export function randomProblem(previous = {}) {
  let speed, angle;
  do { speed = 15 + Math.floor(Math.random()*46); angle = 25 + Math.floor(Math.random()*46); }
  while (speed === previous.speed && angle === previous.angle);
  return {speed,angle};
}

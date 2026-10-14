import test from 'node:test';
import assert from 'node:assert/strict';
import {solve,isCorrect,randomProblem,G} from './physics.mjs';
test('known 45 degree launch satisfies independent flight identities',()=>{
 const a=solve(20,45);
 assert.ok(Math.abs(a.range-400/G)<1e-10);
 assert.ok(Math.abs(a.height-100/G)<1e-10);
 assert.ok(Math.abs(a.total-2*a.rise)<1e-10);
 assert.equal(a.yf,0);assert.equal(a.ya,-G);assert.equal(a.xa,0);
});
test('random solutions satisfy displacement and velocity equations',()=>{
 let previous={};for(let i=0;i<1000;i++){const p=randomProblem(previous);assert.notDeepEqual(p,previous);const a=solve(p.speed,p.angle);assert.ok(Math.abs(a.y0*a.total-.5*G*a.total**2)<1e-9);assert.ok(Math.abs(a.y0-G*a.rise)<1e-9);assert.ok(Math.abs(Math.hypot(a.x0,a.y0)-p.speed)<1e-9);assert.equal(a.dx,a.range);assert.equal(a.dy,a.height);previous=p;}
});
test('grading rejects blanks, wrong signs and nonnumbers; allows rounded answers',()=>{assert.equal(isCorrect('',0),false);assert.equal(isCorrect(' ',0),false);assert.equal(isCorrect('abc',0),false);assert.equal(isCorrect('9.81',-9.81),false);assert.equal(isCorrect('-9.81',-9.81),true);assert.equal(isCorrect('0',0),true);assert.equal(isCorrect('26.79',solve(34,52).y0),true)});

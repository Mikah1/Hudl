import {solve,isCorrect,randomProblem} from './physics.mjs';
const $ = id => document.getElementById(id);
const variables=[['0','v₀','Initial velocity'],['avg','v̄','Average velocity'],['f','vᶠ','Final velocity'],['d','Δ','Displacement'],['t','t','Time'],['a','a','Acceleration']];
let problem={speed:34,angle:52}, answers, completed=0, number=1, finished=false;
const fields=[];
function hintFor(key) {
 const launch = `${problem.speed.toFixed(1)} m/s`, angle = `${problem.angle}°`;
 const hints = {
  x0: `Resolve the launch along x: v₀ₓ = v₀ cos θ. Use ${launch} × cos(${angle}) with your calculator in degree mode.`,
  xavg: 'With no drag, aₓ = 0, so horizontal velocity stays constant. Average horizontal velocity equals v₀ₓ.',
  xf: 'There is no horizontal acceleration. Use vᶠₓ = v₀ₓ + aₓt; the acceleration term vanishes.',
  dx: 'Use Δx = v₀ₓt + ½aₓt². Since aₓ = 0, multiply horizontal launch velocity by the TOTAL flight time.',
  xt: 'The horizontal motion lasts for the entire flight. Find the rise time from 0 = v₀ᵧ − gt, then double it because the landing height equals the launch height.',
  xa: 'Ignoring drag, gravity is the only force during flight, and it acts vertically. What horizontal acceleration does that leave?',
  y0: `Resolve the launch along y: v₀ᵧ = v₀ sin θ. Use ${launch} × sin(${angle}) in degree mode. Upward is positive.`,
  yavg: 'For constant acceleration, v̄ᵧ = (v₀ᵧ + vᶠᵧ)/2. This interval ends at maximum height, where vertical velocity is zero.',
  yf: 'At maximum height the cannonball changes from rising to falling. Its instantaneous vertical velocity is zero, even though gravity still acts.',
  dy: 'Use vᶠᵧ² = v₀ᵧ² + 2aᵧΔy. At the top vᶠᵧ = 0 and aᵧ = −9.81 m/s², so Δy = v₀ᵧ²/(2g).',
  yt: 'Use vᶠᵧ = v₀ᵧ + aᵧt. Substitute vᶠᵧ = 0 at the top and aᵧ = −g, then rearrange: t = v₀ᵧ/g. This is the RISE time.',
  ya: 'Upward is positive and gravity acts downward. Use the given magnitude of gravity with a negative sign and acceleration units.',
  speed: `The launch speed is given directly in the question (${launch}). It is the magnitude before resolving into horizontal and vertical components.`,
  rise: 'First find v₀ᵧ = v₀ sin θ. Then use vᶠᵧ = v₀ᵧ − gt with vᶠᵧ = 0 at the top: tᵣᵢₛₑ = v₀ᵧ/g.',
  total: 'The cannonball lands at its launch height, so the descent takes as long as the rise. Use tₜₒₜₐₗ = 2tᵣᵢₛₑ = 2v₀ sin θ/g.',
  height: 'Find v₀ᵧ = v₀ sin θ, then use vᶠᵧ² = v₀ᵧ² + 2aᵧΔy with vᶠᵧ = 0. Maximum height above launch is h = v₀ᵧ²/(2g).',
  range: 'Find v₀ₓ = v₀ cos θ and the TOTAL flight time (twice the rise time). With aₓ = 0, range = v₀ₓ × tₜₒₜₐₗ.'
 };
 return hints[key];
}
function row(parent,key,label,description,unit,question=false){
 const el=document.createElement('div');el.className='answer-row';
 el.innerHTML=`${question?`<label class="question-label" for="${key}">${description}</label>`:''}<div class="entry">${question?'':`<label class="symbol" for="${key}" title="${description}">${label}</label>`}<input id="${key}" type="number" step="any" aria-label="${description}" autocomplete="off"><select aria-label="Unit for ${description}"><option value="">unit</option><option>m</option><option>m/s</option><option>m/s²</option><option>s</option></select><button class="check" aria-label="Check ${description}" title="Check answer">✓</button></div><span class="row-feedback" aria-live="polite"></span><button type="button" class="hint-button" aria-expanded="false" aria-controls="hint-${key}" aria-label="Hint for ${description}">Need a hint?</button><p class="answer-hint" id="hint-${key}" hidden></p>`;
 parent.append(el);const field={el,key,unit,input:el.querySelector('input'),select:el.querySelector('select'),message:el.querySelector('.row-feedback'),correct:false};fields.push(field);
 el.querySelector('button.check').onclick=()=>{check(field);update()};
 const hintButton=el.querySelector('.hint-button'), hint=el.querySelector('.answer-hint');
 hintButton.onclick=()=>{const open=hint.hidden;hint.hidden=!open;hint.textContent=hintFor(key);hintButton.textContent=open?'Hide hint':'Need a hint?';hintButton.setAttribute('aria-expanded',String(open))};
 field.input.onkeydown=e=>{if(e.key==='Enter'){check(field);update()}};
 for(const control of [field.input,field.select])control.addEventListener('input',()=>{field.correct=false;el.classList.remove('correct','incorrect');field.message.textContent='';update()});
}
for(const axis of ['x','y'])for(const [suffix,symbol,name] of variables){const key=suffix==='d'?'d'+axis:axis+suffix;row($(axis==='x'?'horizontal':'vertical'),key,suffix==='d'?`Δ${axis}`:symbol,`${axis==='x'?'Horizontal':'Vertical'} ${name.toLowerCase()}`,suffix==='t'?'s':suffix==='a'?'m/s²':suffix==='d'?'m':'m/s')}
row($('questions'),'speed','', 'What is the initial launch speed?', 'm/s',true);
for(const [key,text,unit] of [['rise','How long did the cannonball rise?','s'],['total',"What was its total flight time?",'s'],['height','What was its maximum height?','m'],['range','How far from the cannon did it land?','m']])row($('questions'),key,'',text,unit,true);
function check(f){const valueOK=isCorrect(f.input.value,answers[f.key]);f.correct=valueOK&&f.select.value===f.unit;f.el.classList.toggle('correct',f.correct);f.el.classList.toggle('incorrect',!f.correct);f.message.textContent=f.correct?'Correct ✓':f.input.value.trim()===''?'Enter a value and choose a unit.':!valueOK?'Try again · check your calculation and sign.':`Check the unit for this quantity.`}
function update(){const count=fields.filter(f=>f.correct).length;$('progress').textContent=`${count} of ${fields.length} answers checked`;
 if(count===fields.length){if(!finished){finished=true;completed++;$('streak').textContent=`${completed} problem${completed===1?'':'s'} completed`}$('feedback').textContent='All correct! Your next challenge is ready.';$('next').hidden=false;}
 else {$('feedback').textContent='Use signed velocities; round to 2 decimals (1% tolerance).';$('next').hidden=true;}}
function load(){answers=solve(problem.speed,problem.angle);finished=false;$('problemNumber').textContent=`PROBLEM ${String(number).padStart(2,'0')}`;$('prompt').innerHTML=`A student fires a cannonball at <strong>${problem.speed.toFixed(1)} m/s</strong>, at an angle of <strong>${problem.angle}°</strong> above horizontal. For vertical motion, consider the flight <strong>until maximum height</strong>. For horizontal motion, consider the <strong>total flight</strong>.`;
 for(const f of fields){f.input.value='';f.select.value='';f.correct=false;f.el.className='answer-row';f.message.textContent='';f.el.querySelector('.answer-hint').hidden=true;const hintButton=f.el.querySelector('.hint-button');hintButton.textContent='Need a hint?';hintButton.setAttribute('aria-expanded','false')}
 const theta=problem.angle*Math.PI/180,x=67+125*Math.cos(theta),y=180-125*Math.sin(theta);$('launchArrow').setAttribute('d',`M67 180 L${x} ${y}`);$('angleArc').setAttribute('d',`M107 180 A40 40 0 0 0 ${67+40*Math.cos(theta)} ${180-40*Math.sin(theta)}`);$('angleLabel').setAttribute('x',113);$('angleLabel').setAttribute('y',165);$('angleLabel').textContent=problem.angle+'°';$('speedLabel').setAttribute('x',x+8);$('speedLabel').setAttribute('y',y-6);$('speedLabel').textContent=problem.speed.toFixed(1)+' m/s';$('trajectory').setAttribute('d',`M67 180 Q225 ${180-158*Math.tan(theta)} 383 180`);update();}
$('checkAll').onclick=()=>{fields.forEach(check);update()};$('next').onclick=()=>{problem=randomProblem(problem);number++;load();clearSketch();$('notes').value='';$('prompt').scrollIntoView({behavior:'smooth',block:'center'})};
$('referenceToggle').onclick=()=>{const open=$('reference').hidden;$('reference').hidden=!open;$('referenceToggle').setAttribute('aria-expanded',String(open))};
const canvas=$('canvas'),ctx=canvas.getContext('2d');let strokes=[],active=null;
function redraw(){const rect=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.scale(dpr,dpr);for(const stroke of strokes){ctx.beginPath();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=stroke.color;ctx.lineWidth=stroke.erase?18:2;ctx.globalCompositeOperation=stroke.erase?'destination-out':'source-over';stroke.points.forEach(([x,y],i)=>{if(i===0)ctx.moveTo(x*rect.width,y*rect.height);else ctx.lineTo(x*rect.width,y*rect.height)});ctx.stroke()}ctx.globalCompositeOperation='source-over'}
function point(e){const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]}
canvas.onpointerdown=e=>{e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=point(e);active={color:$('ink').value,erase:$('eraser').checked,points:[p,[p[0]+.0001,p[1]+.0001]]};strokes.push(active);redraw()};canvas.onpointermove=e=>{if(active){active.points.push(point(e));redraw()}};canvas.onpointerup=canvas.onpointercancel=()=>{active=null};function clearSketch(){strokes=[];active=null;redraw()}$('clearCanvas').onclick=clearSketch;$('undo').onclick=()=>{strokes.pop();redraw()};new ResizeObserver(redraw).observe(canvas);load();

// Keep the projects heading in step with the number of projects in projects.js.
(()=>{const w=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve'][PROJECTS.length]||String(PROJECTS.length);
  document.getElementById('workTitle').innerHTML=`${w} projects, ${w.toLowerCase()} <em>clusters</em>.`;})();
const cardsEl=document.getElementById('cards');
PROJECTS.forEach((pr,i)=>{
  const a=document.createElement('article');a.className='card';a.tabIndex=0;a.dataset.i=i;a.setAttribute('role','button');a.setAttribute('aria-label','Open project: '+pr.t);
  a.innerHTML=`<span class="kind">${pr.k}</span><h3>${pr.t}</h3><p>${pr.c}</p><div class="path">${pr.p.map(s=>`<span>${s}</span>`).join('<i>→</i>')}<span class="open">Open ↗</span></div>`;
  a.addEventListener('click',e=>openProject(i,e.clientX,e.clientY));
  a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const r=a.getBoundingClientRect();openProject(i,r.left+r.width/2,r.top+r.height/2);}});
  cardsEl.appendChild(a);
});

// ---- project window ----
const win=document.getElementById('win'),winBody=document.getElementById('winBody'),winId=document.getElementById('winId');
let openIdx=-1,lastFocus=null;
const pad=n=>String(n).padStart(2,'0');
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function controls(box,names,update){const row=el('div','demo-controls');names.forEach((n,i)=>{const b=el('button');b.type='button';b.textContent=n;b.setAttribute('aria-pressed',String(i===0));
  b.onclick=()=>{row.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));update(i);};row.append(b);});box.append(row);}
function buildDemo(pr){
  const d=el('div','demo');d.append(el('span','tag',pr.url?'Try it · sample data from the app':'Try it · sample data, not a live Slate connection'));
  const out=el('div','demo-out');out.setAttribute('aria-live','polite');
  const table=(rows,i)=>{const v=rows.filter(r=>i===0||r[2]==='Missing');
    out.innerHTML=`<table><thead><tr><th scope="col">Applicant</th><th scope="col">Document</th><th scope="col">Status</th></tr></thead><tbody>${v.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td class="${r[2]==='Missing'?'miss':''}">${r[2]}</td></tr>`).join('')}</tbody></table><p style="margin-top:10px">${v.length} sample records shown</p>`;};
  const stepper=(steps)=>{d.append(el('p',null,pr.demo==='steps'?'Step through the build guide a teammate would follow.':'Step through the journey a newly admitted student follows.'));
    controls(d,steps.map(s=>s[0]),i=>{out.innerHTML=`<h4>${steps[i][1]}</h4><p>${steps[i][2]}</p>`;});d.append(out);out.innerHTML=`<h4>${steps[0][1]}</h4><p>${steps[0][2]}</p>`;};
  if(pr.demo==='table'||pr.demo==='table2'){
    const rows=pr.demo==='table'?[['T-1001','College transcript','Missing'],['T-1002','College transcript','Received'],['T-1003','English proficiency','Missing'],['T-1004','Course prerequisites','Received']]:[['F-2001','High school transcript','Missing'],['F-2002','English proficiency','Received'],['F-2003','High school transcript','Received'],['F-2004','Passport copy','Missing']];
    d.append(el('p',null,'Filter a sample checklist the way staff would during review.'));controls(d,['All documents','Outstanding only'],i=>table(rows,i));d.append(out);table(rows,0);
  }else if(pr.demo==='message'){
    const kinds=['college transcript','high school transcript','graduate transcript'];
    const msg=i=>{out.innerHTML=`<p>Hello Sample Applicant,</p><p style="margin-top:8px">Your <strong class="bad">${kinds[i]}</strong> is still outstanding. Please follow the official submission instructions in your application portal, and check your checklist for updates.</p>`;};
    d.append(el('p',null,'Pick the missing document and watch the message change.'));controls(d,['College','High school','Graduate'],msg);d.append(out);msg(0);
  }else if(pr.demo==='journey'){
    stepper([['Account','Set up your account','Activate your university account using the instructions in your official welcome message.'],['Checklist','Review your checklist','Check your application portal for outstanding items and published deadlines.'],['Documents','Submit documents','Follow the official document submission requirements.'],['Status','Monitor your application','Return to the portal to review updates and any new requests.']]);
  }else if(pr.demo==='qa'){
    const samples=['Hello {{name}}, visit our portal: http://example.invalid/apply','Hello Sample Applicant, visit our portal: https://example.com/apply'];
    const run=i=>{const m=samples[i];const checks=[[!m.includes('{{'),'Greeting resolved','Unresolved placeholder'],[m.includes('https://'),'Secure HTTPS link','Insecure link']];
      out.innerHTML=`<p style="font-family:var(--f-mono);font-size:13px">${m.replace(/</g,'&lt;')}</p><ul>${checks.map(c=>`<li class="${c[0]?'ok':'bad'}">${c[0]?'Pass: '+c[1]:'Needs review: '+c[2]}</li>`).join('')}<li>Destination not tested in this demo</li></ul>`;};
    d.append(el('p',null,'Compare a flawed sample message with the corrected version.'));controls(d,['Before QA','After QA'],run);d.append(out);run(0);
  }else if(pr.demo==='fire'){
    d.append(el('p',null,'This project is the page around you. Send a wave through the network behind this window.'));
    controls(d,['Fire every neuron','Fire this cluster'],i=>{window.__fire&&window.__fire(i===0?'all':5);out.innerHTML=`<p>${i===0?'Every neuron just fired. Watch the amber wave spread along the synapses.':'Cluster 06 is firing. It keeps pulsing while this window is open.'}</p>`;});
    d.append(out);out.innerHTML='<p>Pick a button to fire the network.</p>';
  }else if(pr.demo==='campus'){
    const tabs={Professor:['Group names and sizes: visible','Who is in each group: visible','Every group\'s messages: visible','Class roster: visible'],
      'Student in the group':['Group names and sizes: visible','Who is in the group: visible','The group\'s messages: visible','Class roster: hidden'],
      'Other students':['Group names and sizes: visible','Who is in the group: hidden','The group\'s messages: hidden','Class roster: hidden']};
    const names=Object.keys(tabs);const show=i=>{out.innerHTML=`<h4>${names[i]}</h4><ul>${tabs[names[i]].map(t=>`<li>${t}</li>`).join('')}</ul>`;};
    d.append(el('p',null,'Switch roles to see what each person can access. These rules are enforced by the database, not just the website.'));controls(d,names,show);d.append(out);show(0);
  }else{
    stepper([['Population','Define the population','Specify the applicant type and term before choosing any fields.'],['Fields','Select fields','Include a unique applicant ID, the document name and the checklist status.'],['Validation','Validate results','Compare a small sample with source records, and investigate blanks and duplicate rows.'],['Documentation','Document the workflow','Record assumptions, field definitions, validation steps and known limitations.']]);
  }
  return d;
}
function renderProject(i){
  const pr=PROJECTS[i];openIdx=i;winId.textContent=`Cluster ${pad(i+1)} / ${pad(PROJECTS.length)}`;
  winBody.innerHTML='';
  const head=el('div','win-head');head.append(el('span','kind',pr.k));const h=el('h2',null,pr.t);h.id='winTitle';head.append(h);head.append(el('p','lede',pr.c));
  const sig=el('div','signal');pr.p.forEach((n,j)=>{if(j)sig.append(el('span','w'));sig.append(el('span','n',n));});head.append(sig);
  const grid=el('div','win-grid');
  const a=el('div');a.append(el('h3',null,'The challenge'),el('p',null,pr.ch));
  const b=el('div');b.append(el('h3',null,'What I did'));const ol=el('ol');pr.did.forEach(t=>ol.append(el('li',null,t)));b.append(ol);
  const c=el('div');c.append(el('h3',null,'Why it mattered'),el('p',null,pr.imp));
  grid.append(a,b,c);
  const tools=el('div','win-block');tools.append(el('h3',null,'Tools'));const chips=el('div','chips');pr.tools.forEach(t=>chips.append(el('span',null,t)));tools.append(chips);
  if(pr.url){const l=el('a','btn',`View the code on GitHub ↗`);l.href=pr.url;l.target='_blank';l.rel='noreferrer';l.style.marginTop='16px';tools.append(l);}
  const foot=el('div','win-foot');const NP=PROJECTS.length,prev=PROJECTS[(i+NP-1)%NP],next=PROJECTS[(i+1)%NP];
  const pb=el('button',null,`<small>Previous cluster</small>← ${prev.t}`);pb.type='button';pb.onclick=()=>go(-1);
  const nb=el('button',null,`<small>Next cluster</small>${next.t} →`);nb.type='button';nb.onclick=()=>go(1);foot.append(pb,nb);
  winBody.append(head,grid,buildDemo(pr),tools,foot);win.scrollTop=0;
  window.__dive&&window.__dive(i);
  try{history.replaceState(null,'','#'+pr.id);}catch(e){}
}
function openProject(i,x,y){
  lastFocus=document.activeElement;
  win.style.setProperty('--ox',(x??innerWidth/2)+'px');win.style.setProperty('--oy',(y??innerHeight/2)+'px');
  renderProject(i);win.hidden=false;document.body.classList.add('locked');
  void win.offsetWidth;win.classList.add('open');
  setTimeout(()=>document.getElementById('winClose').focus({preventScroll:true}),50);
}
function closeProject(){
  if(win.hidden)return;win.classList.remove('open');openIdx=-1;window.__dive&&window.__dive(-1);
  const done=()=>{win.hidden=true;document.body.classList.remove('locked');};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)done();else setTimeout(done,750);
  try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
  lastFocus&&lastFocus.focus&&lastFocus.focus({preventScroll:true});
}
function go(d){if(openIdx<0)return;renderProject((openIdx+d+PROJECTS.length)%PROJECTS.length);}
document.getElementById('winClose').onclick=closeProject;
document.getElementById('winPrev').onclick=()=>go(-1);
document.getElementById('winNext').onclick=()=>go(1);
addEventListener('keydown',e=>{if(win.hidden)return;if(e.key==='Escape')closeProject();if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);});
window.openProject=openProject;

(function(){
  if(!window.THREE){return;}
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small=innerWidth<720;
  const N=small?1400:2600;         // particles
  const NODES=small?120:220;       // particles that also form synapses
  const LINK=small?1.25:1.1;       // max synapse length

  const canvas=document.getElementById('field');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.setSize(innerWidth,innerHeight);
  renderer.setClearColor(0x04060c,1);
  const scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x04060c,.045);
  const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,100);
  camera.position.set(0,0,12);
  const group=new THREE.Group();scene.add(group);

  // round soft sprite
  const sc=document.createElement('canvas');sc.width=sc.height=64;const sx=sc.getContext('2d');
  const g=sx.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');
  sx.fillStyle=g;sx.fillRect(0,0,64,64);
  const sprite=new THREE.CanvasTexture(sc);

  const pos=new Float32Array(N*3), col=new Float32Array(N*3), vel=new Float32Array(N*3);
  const tgt=new Float32Array(N*3), act=new Float32Array(N), cluster=new Int8Array(N).fill(-1);
  const cRest=new THREE.Color(0x7fe7ff), cDim=new THREE.Color(0x2a4a7a), cFire=new THREE.Color(0xffb86b);
  for(let i=0;i<N;i++){const r=6+Math.random()*6,a=Math.random()*6.283,b=Math.acos(2*Math.random()-1);
    pos[i*3]=r*Math.sin(b)*Math.cos(a);pos[i*3+1]=r*Math.sin(b)*Math.sin(a);pos[i*3+2]=r*Math.cos(b);}
  const pg=new THREE.BufferGeometry();
  pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  pg.setAttribute('color',new THREE.BufferAttribute(col,3));
  const points=new THREE.Points(pg,new THREE.PointsMaterial({size:small?.11:.09,map:sprite,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  group.add(points);

  const MAXL=NODES*8;
  const lpos=new Float32Array(MAXL*6), lcol=new Float32Array(MAXL*6);
  const lg=new THREE.BufferGeometry();
  lg.setAttribute('position',new THREE.BufferAttribute(lpos,3));
  lg.setAttribute('color',new THREE.BufferAttribute(lcol,3));
  const lines=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  group.add(lines);

  // ---- shapes ----
  const viewW=()=>2*Math.tan(camera.fov*Math.PI/360)*camera.position.z*camera.aspect;
  const offsetX=()=>small?0:viewW()*.2;
  function rnd(a,b){return a+Math.random()*(b-a)}
  function shapeBrain(){ // two hemispheres with folds
    const ox=offsetX(),s=small?2.3:3.1;
    for(let i=0;i<N;i++){const side=i%2?1:-1,u=Math.random()*6.283,v=Math.acos(2*Math.random()-1);
      const fold=1+.08*Math.sin(u*7)*Math.sin(v*9);
      let x=Math.sin(v)*Math.cos(u)*.85,y=Math.cos(v)*.78,z=Math.sin(v)*Math.sin(u)*1.05;
      x=Math.abs(x)*side+side*.07;
      tgt.set([ox+x*s*fold,(small?2.6:0)+y*s*fold,z*s*fold],i*3);cluster[i]=-1;}
  }
  function sampleText(txt){
    const c=document.createElement('canvas'),W=900,H=260;c.width=W;c.height=H;const x=c.getContext('2d');
    x.fillStyle='#fff';x.font='800 210px Syne, Arial Black, sans-serif';x.textAlign='center';x.textBaseline='middle';
    x.fillText(txt,W/2,H/2+8);
    const d=x.getImageData(0,0,W,H).data,pts=[];
    for(let y=0;y<H;y+=3)for(let X=0;X<W;X+=3)if(d[(y*W+X)*4+3]>128)pts.push([X/W-.5,.5-y/H]);
    return pts;
  }
  function shapeText(txt,yOff){
    const pts=sampleText(txt),w=Math.min(viewW()*.9,small?7:12),ox=small?0:viewW()*.1;
    for(let i=0;i<N;i++){const p=pts[(Math.random()*pts.length)|0];
      tgt.set([ox+p[0]*w+rnd(-.03,.03),yOff+p[1]*w*.29+rnd(-.03,.03),rnd(-.4,.4)],i*3);cluster[i]=-1;}
  }
  const centers=[];
  function shapeClusters(){
    centers.length=0;const R=small?3:5.2;
    const NP=PROJECTS.length;for(let k=0;k<NP;k++){const a=k/NP*6.283+.4;centers.push([Math.cos(a)*R,Math.sin(a)*R*.55,Math.sin(a*2)*1.5]);}
    for(let i=0;i<N;i++){const k=i%(NP+1);
      if(k===NP){tgt.set([rnd(-9,9),rnd(-5,5),rnd(-5,3)],i*3);cluster[i]=-1;continue;}
      const c=centers[k],r=Math.pow(Math.random(),.6)*(small?.9:1.2),a=Math.random()*6.283,b=Math.acos(2*Math.random()-1);
      tgt.set([c[0]+r*Math.sin(b)*Math.cos(a),c[1]+r*Math.sin(b)*Math.sin(a),c[2]+r*Math.cos(b)],i*3);cluster[i]=k;}
  }
  function shapeHelix(){
    const len=small?10:16,ox=small?0:viewW()*.05;
    for(let i=0;i<N;i++){const t=Math.random(),strand=i%3,a=t*18+strand*Math.PI;
      const r=strand===2?rnd(0,1.6):1.6;
      tgt.set([ox+(t-.5)*len,Math.cos(a)*r+rnd(-.08,.08),Math.sin(a)*r+rnd(-.08,.08)],i*3);cluster[i]=-1;}
  }
  const SHAPES={brain:shapeBrain,name:()=>shapeText('RIFATH',small?4.2:4.1),clusters:shapeClusters,helix:shapeHelix,hello:()=>shapeText('HELLO',small?3.2:1.6)};
  let current='brain';SHAPES.brain();
  if(reduce)pos.set(tgt);
  const LAYERS={brain:'input',name:'profile',clusters:'projects',helix:'experience',hello:'output'};
  function setShape(s){if(s===current)return;current=s;SHAPES[s]();
    for(let i=0;i<NODES;i++)if(Math.random()<.5)act[i]=1; // a wave of firing on every morph
    document.getElementById('rLayer').textContent=LAYERS[s];
    if(reduce)pos.set(tgt);}

  const sections=[...document.querySelectorAll('section[data-shape]')];
  const navLinks=[...document.querySelectorAll('nav a')];
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){setShape(e.target.dataset.shape);
    navLinks.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id));}})},{rootMargin:'-45% 0px -45% 0px'});
  sections.forEach(s=>io.observe(s));

  // project hover → cluster fires
  let litCluster=-1;
  document.querySelectorAll('.card').forEach(c=>{
    const on=()=>{litCluster=+c.dataset.i;},off=()=>{if(openIdx<0)litCluster=-1;};
    c.addEventListener('mouseenter',on);c.addEventListener('mouseleave',off);c.addEventListener('focus',on);c.addEventListener('blur',off);
  });

  // clickable cluster labels, shown while the constellation stage is on screen
  const labelsEl=document.getElementById('clabels'),labelBtns=[];
  PROJECTS.forEach((pr,k)=>{const b=document.createElement('button');b.type='button';b.className='clabel';b.innerHTML=`<b>${pad(k+1)}</b><span>${pr.t}</span>`;
    b.setAttribute('aria-label','Open project: '+pr.t);
    b.addEventListener('click',e=>openProject(k,e.clientX,e.clientY));
    b.addEventListener('mouseenter',()=>{litCluster=k;});b.addEventListener('mouseleave',()=>{if(openIdx!==k)litCluster=-1;});
    b.addEventListener('focus',()=>{litCluster=k;});b.addEventListener('blur',()=>{if(openIdx!==k)litCluster=-1;});
    labelsEl.append(b);labelBtns.push(b);});
  let stageOn=false;
  new IntersectionObserver(es=>{es.forEach(e=>{stageOn=e.isIntersecting&&e.intersectionRatio>.35;labelsEl.classList.toggle('on',stageOn);})},{threshold:[0,.35,.6]}).observe(document.getElementById('stage'));

  // camera dive into an opened cluster
  let dive=-1;const camGoal=new THREE.Vector3(0,0,12),look=new THREE.Vector3(),lookGoal=new THREE.Vector3(),wc=new THREE.Vector3();
  window.__dive=k=>{dive=k;if(k>=0){if(current!=='clusters')setShape('clusters');litCluster=k;}else litCluster=-1;};
  window.__fire=w=>{if(w==='all'){for(let i=0;i<N;i++)act[i]=1;}else{for(let i=0;i<N;i++)if(cluster[i]===w)act[i]=1;}};
  if(/^#[a-z-]+$/.test(location.hash)){const k=PROJECTS.findIndex(p=>'#'+p.id===location.hash);if(k>=0)setTimeout(()=>openProject(k),400);}

  // pointer in world space (z=0 plane)
  const mouse=new THREE.Vector2(9,9),world=new THREE.Vector3(99,99,0),ray=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,0,1),0);
  addEventListener('pointermove',e=>{mouse.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);});
  addEventListener('pointerleave',()=>mouse.set(9,9));

  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);SHAPES[current]();});

  const rN=document.getElementById('rNeurons'),rF=document.getElementById('rFiring');rN.textContent=N.toLocaleString();
  const inv=new THREE.Matrix4(),local=new THREE.Vector3();
  let t0=performance.now(),frame=0;
  function tick(now){
    const dt=Math.min((now-t0)/1000,.05);t0=now;frame++;
    const time=now/1000;
    group.rotation.y=reduce?0:Math.sin(time*.12)*.25+mouse.x*.12*(mouse.x<5);
    group.rotation.x=reduce?0:Math.cos(time*.1)*.06-mouse.y*.06*(mouse.y<5);
    group.updateMatrixWorld();
    if(dive>=0&&centers[dive]){wc.set(...centers[dive]).applyMatrix4(group.matrixWorld);camGoal.set(wc.x*.85,wc.y*.85,wc.z+4.2);lookGoal.copy(wc);}
    else{camGoal.set(0,0,12);lookGoal.set(0,0,0);}
    const ease=reduce?1:1-Math.pow(.03,dt);camera.position.lerp(camGoal,ease);look.lerp(lookGoal,ease);camera.lookAt(look);
    if(stageOn&&current==='clusters'&&dive<0){for(let k=0;k<labelBtns.length;k++){wc.set(...centers[k]).applyMatrix4(group.matrixWorld).project(camera);
      labelBtns[k].style.transform=`translate(${(wc.x*.5+.5)*innerWidth}px,${(-wc.y*.5+.5)*innerHeight}px) translate(-50%,-50%)`;}}
    // cursor point in group-local coords
    if(mouse.x<5){ray.setFromCamera(mouse,camera);ray.ray.intersectPlane(plane,world);inv.copy(group.matrixWorld).invert();local.copy(world).applyMatrix4(inv);}else local.set(99,99,99);
    const spring=reduce?0:2.2, damp=Math.pow(.04,dt);
    for(let i=0;i<N;i++){const j=i*3;
      let x=pos[j],y=pos[j+1],z=pos[j+2];
      let ax=(tgt[j]-x)*spring,ay=(tgt[j+1]-y)*spring,az=(tgt[j+2]-z)*spring;
      // breathing
      if(!reduce){const n=Math.sin(time*1.3+i*.7)*.12;ax+=n*Math.cos(i);ay+=n*Math.sin(i);}
      // cursor repels and excites
      const dx=x-local.x,dy=y-local.y,dz=z-local.z,d2=dx*dx+dy*dy+dz*dz;
      if(d2<2.6){const f=(2.6-d2)*4;ax+=dx*f;ay+=dy*f;if(i<NODES&&Math.random()<.08)act[i]=1;}
      if(litCluster>=0&&cluster[i]===litCluster){act[i]=Math.max(act[i],.6+.4*Math.sin(time*6+i));}
      vel[j]=(vel[j]+ax*dt)*damp;vel[j+1]=(vel[j+1]+ay*dt)*damp;vel[j+2]=(vel[j+2]+az*dt)*damp;
      pos[j]=x+vel[j]*dt*6;pos[j+1]=y+vel[j+1]*dt*6;pos[j+2]=z+vel[j+2]*dt*6;
      act[i]*=Math.pow(.18,dt);
      const a=act[i],base=i<NODES?1:.55+.25*Math.sin(i);
      col[j]=(cDim.r+(cRest.r-cDim.r)*base)*(1-a)+cFire.r*a*1.4;
      col[j+1]=(cDim.g+(cRest.g-cDim.g)*base)*(1-a)+cFire.g*a*1.4;
      col[j+2]=(cDim.b+(cRest.b-cDim.b)*base)*(1-a)+cFire.b*a*1.4;
    }
    // spontaneous firing, spreading along synapses
    if(!reduce&&Math.random()<.25)act[(Math.random()*NODES)|0]=1;
    let li=0,firing=0;const L2=LINK*LINK;
    for(let a=0;a<NODES&&li<MAXL;a++){const ja=a*3;
      for(let b=a+1;b<NODES&&li<MAXL;b++){const jb=b*3;
        const dx=pos[ja]-pos[jb],dy=pos[ja+1]-pos[jb+1],dz=pos[ja+2]-pos[jb+2],d2=dx*dx+dy*dy+dz*dz;
        if(d2>L2)continue;
        const s=1-d2/L2,e=Math.max(act[a],act[b]);
        if(e>.5){firing++;if(act[a]<.35&&act[b]>.85)act[a]=.9;else if(act[b]<.35&&act[a]>.85)act[b]=.9;}
        const k=li*6;
        lpos[k]=pos[ja];lpos[k+1]=pos[ja+1];lpos[k+2]=pos[ja+2];lpos[k+3]=pos[jb];lpos[k+4]=pos[jb+1];lpos[k+5]=pos[jb+2];
        const r=(cRest.r*.35*(1-e)+cFire.r*e)*s,gg=(cRest.g*.35*(1-e)+cFire.g*e)*s,bb=(cRest.b*.35*(1-e)+cFire.b*e)*s;
        lcol[k]=lcol[k+3]=r;lcol[k+1]=lcol[k+4]=gg;lcol[k+2]=lcol[k+5]=bb;li++;}}
    lg.setDrawRange(0,li*2);lg.attributes.position.needsUpdate=true;lg.attributes.color.needsUpdate=true;
    pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true;
    if(frame%10===0)rF.textContent=firing;
    renderer.render(scene,camera);
    requestAnimationFrame(tick);
  }
  // re-sample text once the display face has loaded
  document.fonts&&document.fonts.ready.then(()=>{if(current==='name'||current==='hello')SHAPES[current]();});
  requestAnimationFrame(tick);
})();

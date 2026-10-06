import * as THREE from 'three';

const canvas = document.querySelector('#universe');
const renderer = new THREE.WebGLRenderer({canvas, antialias: false, alpha: true, powerPreference: 'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020305, 0.032);
const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, .1, 120);
camera.position.set(0, 0, 14);

const universe = new THREE.Group(); scene.add(universe);
const starCount = innerWidth < 700 ? 1100 : 2400;
const positions = new Float32Array(starCount * 3);
const colors = new Float32Array(starCount * 3);
const palette = [new THREE.Color(0x34d5c5), new THREE.Color(0x12375b), new THREE.Color(0x59e5a0), new THREE.Color(0xc6f4e8)];
for (let i=0;i<starCount;i++) {
  const r = 8 + Math.random()*42, a=Math.random()*Math.PI*2, z=(Math.random()-.5)*55;
  positions[i*3]=Math.cos(a)*r; positions[i*3+1]=Math.sin(a)*r*.55; positions[i*3+2]=z;
  const c=palette[(Math.random()*palette.length)|0]; colors.set([c.r,c.g,c.b],i*3);
}
const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(positions,3)); geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
const stars=new THREE.Points(geo,new THREE.PointsMaterial({size:.045,vertexColors:true,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false})); universe.add(stars);

const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2,4),new THREE.MeshBasicMaterial({color:0x34d5c5,wireframe:true,transparent:true,opacity:.16,blending:THREE.AdditiveBlending}));
core.position.set(5.5,.3,-3); universe.add(core);
const halo = new THREE.Mesh(new THREE.TorusGeometry(3.8,.012,8,180),new THREE.MeshBasicMaterial({color:0x59e5a0,transparent:true,opacity:.38})); halo.position.copy(core.position); halo.rotation.x=1.15; universe.add(halo);

// Neural constellation—an abstract human/intelligence signal rather than a literal portrait.
const neural = new THREE.Group(); neural.position.set(-5,-1,-5); universe.add(neural);
const nodeMaterial = new THREE.MeshBasicMaterial({color:0x59e5a0,transparent:true,opacity:.7});
const lineMaterial = new THREE.LineBasicMaterial({color:0x34d5c5,transparent:true,opacity:.23});
const nodes=[];
for(let i=0;i<28;i++){const y=(Math.random()-.5)*7;const width=2.2*(1-Math.abs(y)/8)+.35;const p=new THREE.Vector3((Math.random()-.5)*width,y,(Math.random()-.5)*1.2);nodes.push(p);const m=new THREE.Mesh(new THREE.SphereGeometry(.035,5,5),nodeMaterial);m.position.copy(p);neural.add(m)}
for(let i=0;i<nodes.length-1;i++){const pts=[nodes[i],nodes[(i+1+((Math.random()*5)|0))%nodes.length]];neural.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),lineMaterial))}

let mouseX=0,mouseY=0,scroll=0,targetScroll=0;
addEventListener('pointermove',e=>{mouseX=(e.clientX/innerWidth-.5);mouseY=(e.clientY/innerHeight-.5);const glow=document.querySelector('.cursor-glow');if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
addEventListener('scroll',()=>targetScroll=scrollY/(document.documentElement.scrollHeight-innerHeight||1),{passive:true});

const clock=new THREE.Clock();
function render(){const t=clock.getElapsedTime();scroll+=(targetScroll-scroll)*.045;stars.rotation.z=t*.008+scroll*.6;stars.rotation.y=t*.004;core.rotation.x=t*.08;core.rotation.y=t*.12;halo.rotation.z=t*.07;neural.rotation.y=Math.sin(t*.2)*.12;universe.position.x+=(mouseX*.6-universe.position.x)*.025;universe.position.y+=(-mouseY*.4-universe.position.y)*.025;camera.position.z=14-scroll*6;camera.position.y=-scroll*5;renderer.render(scene,camera);requestAnimationFrame(render)}render();

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});

if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-title .line span',{yPercent:110,duration:1.35,stagger:.12,ease:'power4.out',delay:.2});
  gsap.from('.nav-shell',{y:-80,opacity:0,duration:1,ease:'power3.out'});
  gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:45,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  gsap.utils.toArray('.split-title').forEach(el=>gsap.from(el,{y:70,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 82%'}}));
  gsap.utils.toArray('.project-card').forEach((card,i)=>{
    gsap.from(card,{y:100,opacity:0,scale:.96,duration:1,scrollTrigger:{trigger:card,start:'top 88%'}});
    gsap.to(card.querySelector('.project-visual'),{y:-60,rotation:i%2?8:-8,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:1.2}})
  });
  gsap.to('.contact-orb',{scale:1.25,opacity:.75,ease:'none',scrollTrigger:{trigger:'.contact',start:'top bottom',end:'center center',scrub:1}});
}


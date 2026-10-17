/* =====================================================================
   UI: menu, scrollspy, reveal, FAQ, carrossel
===================================================================== */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var nav=$('#nav'), tg=$('#navToggle');

  tg.addEventListener('click',function(){
    var o=nav.classList.toggle('open'); tg.setAttribute('aria-expanded',o); tg.textContent=o?'Fechar':'Menu';
  });
  $$('#navLinks a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');tg.setAttribute('aria-expanded','false');tg.textContent='Menu'})});

  function onScroll(){ document.body.classList.toggle('scrolled',window.scrollY>40);
    var y=window.scrollY+window.innerHeight*0.4, cur='';
    $$('main section[id]').forEach(function(s){var r=s.getBoundingClientRect(),t=r.top+window.scrollY; if(y>=t&&y<t+r.height)cur=s.id});
    $$('#navLinks a[data-spy]').forEach(function(a){a.classList.toggle('on',(' '+a.dataset.spy+' ').indexOf(' '+cur+' ')>-1)});
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
    $$('.rv').forEach(function(el){io.observe(el)});
  } else document.documentElement.classList.add('js-off');

  $$('.faq-item').forEach(function(it){
    var b=$('.faq-q',it);
    b.addEventListener('click',function(){
      var open=!it.classList.contains('open');
      $$('.faq-item.open').forEach(function(o){o.classList.remove('open');$('.faq-q',o).setAttribute('aria-expanded','false')});
      if(open){it.classList.add('open');b.setAttribute('aria-expanded','true')}
    });
  });

  $$('.shot img').forEach(function(img){var ph=img.parentNode;function bad(){ph.classList.add('noimg')}img.addEventListener('error',bad);if(img.complete&&img.naturalWidth===0)bad()});
  var slides=$$('#team .slide'), idx=0;
  $$('#team .photo img').forEach(function(img){
    var ph=img.parentNode;
    function bad(){ph.classList.add('noimg')}
    img.addEventListener('error',bad); if(img.complete&&img.naturalWidth===0)bad();
  });
  $$('#team .ctrl').forEach(function(b){b.addEventListener('click',function(){
    slides[idx].classList.remove('on'); idx=(idx+parseInt(b.dataset.dir,10)+slides.length)%slides.length; slides[idx].classList.add('on');
  })});
})();

/* =====================================================================
   Fundo de partículas WebGL — triângulos que se transformam no scroll
   cérebro → nuvem → lâmpada → globo → nuvem → forma final
===================================================================== */
(function(){
  'use strict';
  var cv=document.getElementById('fx'), gl=null;
  try{gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'high-performance'})||cv.getContext('experimental-webgl')}catch(e){}
  if(!gl){document.documentElement.classList.add('no-gl');return}

  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TAU=Math.PI*2;

  /* ---------- shaders ---------- */
  function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s}
  var vs=sh(gl.VERTEX_SHADER,
    'attribute vec4 aP;attribute vec4 aC;attribute float aT;uniform vec2 uR;uniform float uD;uniform float uMax;'+
    'varying vec4 vC;varying float vA;varying float vT;varying float vS;'+
    'void main(){gl_Position=vec4(aP.x/uR.x*2.-1.,1.-aP.y/uR.y*2.,0.,1.);float s=min(aP.z*uD,uMax);gl_PointSize=s;vC=aC;vA=aP.w;vT=aT;vS=s;}');
  var fs=sh(gl.FRAGMENT_SHADER,
    'precision mediump float;varying vec4 vC;varying float vA;varying float vT;varying float vS;'+
    'float tri(vec2 p){const float k=1.7320508;const float r=.78;p.x=abs(p.x)-r;p.y=p.y+r/k;if(p.x+k*p.y>0.)p=vec2(p.x-k*p.y,-k*p.x-p.y)*.5;p.x-=clamp(p.x,-2.*r,0.);return -length(p)*sign(p.y);}'+
    'float seg(vec2 p,vec2 a){vec2 pa=p-a;float h=clamp(dot(pa,-a)/dot(a,a),0.,1.);return length(pa+a*h);}'+
    'void main(){vec2 p=gl_PointCoord*2.-1.;p.y=-p.y;float c=cos(vA),s=sin(vA);p=vec2(c*p.x-s*p.y,s*p.x+c*p.y);'+
    'float px=2./vS;float w=.62*px;float l=1.-smoothstep(w,w+px*.9,abs(tri(p)));'+
    'if(vT>.5){float d=min(seg(p,vec2(0.,.9)),min(seg(p,vec2(-.78,-.45)),seg(p,vec2(.78,-.45))));l=max(l,(1.-smoothstep(w,w+px*.9,d))*.8);}'+
    'float a=l*vC.a;if(a<.02)discard;gl_FragColor=vec4(vC.rgb,a);}');
  var pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){document.documentElement.classList.add('no-gl');return}
  gl.useProgram(pr);
  var aP=gl.getAttribLocation(pr,'aP'),aC=gl.getAttribLocation(pr,'aC'),aT=gl.getAttribLocation(pr,'aT');
  var uR=gl.getUniformLocation(pr,'uR'),uD=gl.getUniformLocation(pr,'uD'),uMax=gl.getUniformLocation(pr,'uMax');
  var maxPt=gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1]||64;
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0,0,0,1);

  /* ---------- utilidades ---------- */
  var seed=1234567;function rnd(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
  function gauss(){return (rnd()+rnd()+rnd()+rnd()-2)/2}
  function clamp(x,a,b){return x<a?a:x>b?b:x}
  function sstep(a,b,x){x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x)}
  function hash(x,y,z){var h=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return h-Math.floor(h)}
  function vn(x,y,z){var xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi;
    xf=xf*xf*(3-2*xf);yf=yf*yf*(3-2*yf);zf=zf*zf*(3-2*zf);
    function L(a,b,t){return a+(b-a)*t}
    return L(L(L(hash(xi,yi,zi),hash(xi+1,yi,zi),xf),L(hash(xi,yi+1,zi),hash(xi+1,yi+1,zi),xf),yf),
             L(L(hash(xi,yi,zi+1),hash(xi+1,yi,zi+1),xf),L(hash(xi,yi+1,zi+1),hash(xi+1,yi+1,zi+1),xf),yf),zf)}
  function hex(h){return[parseInt(h.substr(1,2),16)/255,parseInt(h.substr(3,2),16)/255,parseInt(h.substr(5,2),16)/255]}
  function mix(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}
  function pick(arr){return arr[(rnd()*arr.length)|0]}

  /* paleta ciano */
  var K={ice:hex('#ecfeff'),pale:hex('#cffafe'),sky:hex('#a5f3fc'),hi:hex('#67e8f9'),cy:hex('#22d3ee'),vivid:hex('#00e5ff'),deep:hex('#06b6d4'),
         teal:hex('#2dd4bf'),mint:hex('#5eead4'),blue:hex('#38bdf8'),navy:hex('#0e7490'),ink:hex('#155e75'),white:hex('#ffffff'),royal:hex('#0ea5e9')};

  var narrow=window.innerWidth<900;
  var N=narrow?3200:6200;
  var P={}; // formas: {p:Float32Array(N*3), c:Float32Array(N*3)}
  function mk(){return{p:new Float32Array(N*3),c:new Float32Array(N*3)}}
  function put(S,i,x,y,z,col){var k=i*3;S.p[k]=x;S.p[k+1]=y;S.p[k+2]=z;S.c[k]=col[0];S.c[k+1]=col[1];S.c[k+2]=col[2]}
  function sph(){var u=rnd()*2-1,t=rnd()*TAU,s=Math.sqrt(1-u*u);return[s*Math.cos(t),u,s*Math.sin(t)]}

  /* cérebro (vista lateral) */
  function genBrain(){
    var S=mk();
    for(var i=0;i<N;i++){
      var r=rnd(),x,y,z,col;
      if(r<.06){ // tronco
        var a=rnd()*TAU,rr=.1*Math.sqrt(rnd());
        x=-.05+Math.cos(a)*rr;z=Math.sin(a)*rr;y=-.7-rnd()*.5;
        col=mix(K.teal,K.sky,rnd());
      }else if(r<.17){ // cerebelo
        var d=sph();x=-.6+d[0]*.42;y=-.6+d[1]*.22;z=d[2]*.4;
        col=rnd()<.5?K.cy:K.hi;
      }else{
        var d=sph(),dx=d[0],dy=d[1],dz=d[2];
        if(dy<0)dy*=.72;
        var fold=1+.05*Math.sin(dx*9+dy*7)*Math.cos(dz*8)+.05*(vn(dx*3+5,dy*3,dz*3)-.5);
        if(dy>.25)fold*=1-.1*Math.exp(-dz*dz/.012)*sstep(.25,.8,dy);
        var inner=rnd()<.13, depth=inner?Math.cbrt(rnd()):1-Math.pow(rnd(),2)*.11;
        var rad=fold*depth;
        x=dx*1.3*rad;y=dy*1.0*rad+.12;z=dz*.85*rad;
        var rim=sstep(-.05,-.75,y)*(inner?0:1);
        var q=rnd();
        if(inner)col=q<.2?K.white:q<.4?K.pale:q<.7?K.hi:q<.9?K.cy:K.teal;
        else if(q<rim*.85)col=pick([K.vivid,K.cy,K.cy,K.hi]);
        else if(q<.12+rim*.5)col=mix(K.blue,K.teal,rnd());
        else col=q<.3?K.pale:q<.6?K.hi:q<.85?K.cy:K.white;
        if(!inner&&x<-.4&&y>-.1&&rnd()<.35)col=K.white;
      }
      put(S,i,x,y,z,col);
    }
    return S;
  }
  /* lâmpada */
  function genBulb(){
    var S=mk(),tilt=-.28,ct=Math.cos(tilt),st=Math.sin(tilt);
    for(var i=0;i<N;i++){
      var x,y,z;
      if(rnd()<.74){var d=sph(),sh=1-Math.pow(rnd(),2)*.1;x=d[0]*.82*sh;y=d[1]*.82*sh+.35;z=d[2]*.82*sh}
      else{var t=rnd(),a=rnd()*TAU,rr=(.5-.3*t)*(1-Math.pow(rnd(),3)*.08);x=Math.cos(a)*rr;z=Math.sin(a)*rr;y=-.45-t*.7}
      var g=clamp((y+1.12)/2.0,0,1); // 0 base, 1 topo
      var col;
      if(g>.62)col=mix(K.sky,K.ice,(g-.62)/.38*(.5+.5*rnd()));
      else if(g>.3)col=mix(K.cy,K.sky,(g-.3)/.32+(rnd()-.5)*.4);
      else col=mix(rnd()<.5?K.navy:K.royal,K.teal,g/.3*rnd());
      if(rnd()<.05)col=K.white;
      var xr=x*ct-y*st,yr=x*st+y*ct;
      put(S,i,xr,yr,z,col);
    }
    return S;
  }
  /* globo com continentes */
  function genGlobe(){
    var S=mk(),hl=[-.5,.25,.82],hn=Math.hypot(hl[0],hl[1],hl[2]);hl=[hl[0]/hn,hl[1]/hn,hl[2]/hn];
    for(var i=0;i<N;i++){
      var d=sph(),dep=1-Math.pow(rnd(),3)*.06,x=d[0]*dep,y=d[1]*dep,z=d[2]*dep;
      var n=vn(d[0]*2.1+3,d[1]*2.1,d[2]*2.1)+.5*vn(d[0]*5,d[1]*5,d[2]*5);
      var land=n>.78,col,q=rnd();
      if(land)col=q<.5?K.hi:q<.82?K.sky:K.cy;
      else col=q<.4?K.deep:q<.7?K.navy:q<.88?K.teal:K.royal;
      var dot=d[0]*hl[0]+d[1]*hl[1]+d[2]*hl[2];
      if(dot>.93&&rnd()<.75)col=K.white;
      put(S,i,x,y,z,col);
    }
    return S;
  }
  /* nuvem dispersa */
  function genScatter(){
    var S=mk();
    for(var i=0;i<N;i++){
      var x,y,z;
      if(rnd()<.3){x=gauss()*1.2;y=gauss()*.8;z=gauss()*.8}else{x=(rnd()*2-1)*2.7;y=(rnd()*2-1)*1.6;z=(rnd()*2-1)*1.3}
      var q=rnd(),col=q<.3?K.hi:q<.52?K.cy:q<.7?K.sky:q<.82?K.teal:q<.92?K.pale:K.blue;
      put(S,i,x,y,z,col);
    }
    return S;
  }
  /* forma final abstrata (leque + aleta + lobo) */
  function genCTA(){
    var S=mk();
    for(var i=0;i<N;i++){
      var r=rnd(),x,y,z,col;
      if(r<.5){ // leque
        var u=Math.sqrt(rnd()),v=rnd(),A=[-.05,-.1],B=[.95,-.5],C=[.5,-.98];
        var bx=A[0]+(B[0]-A[0])*u*(1-v)+(C[0]-A[0])*u*v, by=A[1]+(B[1]-A[1])*u*(1-v)+(C[1]-A[1])*u*v;
        x=bx;y=by;z=.35*Math.sin(u*Math.PI)*(v-.5)+(rnd()-.5)*.05;
        col=mix(K.ice,rnd()<.6?K.cy:K.hi,u*(.6+.5*rnd()));if(u>.85)col=mix(K.cy,K.navy,(u-.85)*5);
      }else if(r<.8){ // aleta
        var t=rnd(),w=rnd();x=-.4+w*.45;y=-.1+t*1.2;z=.3*Math.sin(t*2.4)+(rnd()-.5)*.04;
        col=mix(K.teal,K.mint,rnd());if(rnd()<.2)col=K.cy;
      }else{ // lobo
        var d=sph();x=-.36+d[0]*.55;y=-.12+d[1]*.5;z=d[2]*.42;if(x>-.2)x=-.2-(x+.2)*.1;
        col=mix(K.royal,K.blue,rnd());if(rnd()<.25)col=K.navy;
      }
      put(S,i,x,y,z,col);
    }
    return S;
  }
  P.brain=genBrain();P.bulb=genBulb();P.globe=genGlobe();P.scatter=genScatter();P.cta=genCTA();

  /* atributos por partícula */
  var NF=narrow?26:46, TOT=N+NF, STR=9, buf=new Float32Array(TOT*STR);
  var dl=new Float32Array(N),ph=new Float32Array(N),bs=new Float32Array(N),an=new Float32Array(N),sp=new Float32Array(N),
      sx=new Float32Array(N),sy=new Float32Array(N),sz=new Float32Array(N);
  for(var i=0;i<N;i++){dl[i]=rnd();ph[i]=rnd()*TAU;bs[i]=(rnd()<.06?11+rnd()*5:5.5+rnd()*5);an[i]=rnd()*TAU;sp[i]=(rnd()-.5)*.8;sx[i]=gauss()*1.4;sy[i]=gauss()*1.4;sz[i]=gauss()*1.4}
  /* flutuantes grandes (parallax) */
  var fl=[];for(var f=0;f<NF;f++){var big=f<(narrow?8:16);var c=pick([K.cy,K.hi,K.teal,K.sky,K.blue,K.mint]);
    fl.push({x:rnd(),y:rnd(),sp:.06+rnd()*.5,size:big?24+rnd()*44:9+rnd()*8,a0:rnd()*TAU,w:(rnd()-.5)*.9,col:c,t:big?1:0,ph:rnd()*TAU,al:big?.8:.55})}

  var vbuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vbuf);gl.bufferData(gl.ARRAY_BUFFER,buf.byteLength,gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(aP);gl.vertexAttribPointer(aP,4,gl.FLOAT,false,STR*4,0);
  gl.enableVertexAttribArray(aC);gl.vertexAttribPointer(aC,4,gl.FLOAT,false,STR*4,16);
  gl.enableVertexAttribArray(aT);gl.vertexAttribPointer(aT,1,gl.FLOAT,false,STR*4,32);

  /* ---------- palco: cada seção [data-stage] define forma + posição ---------- */
  var STAGES=[
    {id:'inicio',       shape:'brain',   cx:.70,cy:.50,s:1.00,rot:0,   a:1},
    {id:'sobre',        shape:'brain',   cx:.22,cy:.56,s:1.60,rot:.30, a:1},
    {id:'como-funciona',shape:'scatter', cx:.50,cy:.50,s:1.50,rot:0,   a:.5},
    {id:'diferenciais', shape:'bulb',    cx:.27,cy:.50,s:1.10,rot:.10, a:1},
    {id:'servicos',     shape:'globe',   cx:.75,cy:.55,s:1.50,rot:-.3, a:1},
    {id:'sites',        shape:'scatter', cx:.50,cy:.50,s:1.50,rot:.1,  a:.4},
    {id:'equipe',       shape:'scatter', cx:.50,cy:.50,s:1.50,rot:0,   a:.5},
    {id:'solucoes',     shape:'scatter', cx:.50,cy:.50,s:1.50,rot:.2,  a:.55},
    {id:'parceiros',    shape:'scatter', cx:.50,cy:.50,s:1.50,rot:.4,  a:.45},
    {id:'faq',          shape:'scatter', cx:.50,cy:.50,s:1.50,rot:.6,  a:.4},
    {id:'contato',      shape:'cta',     cx:.50,cy:.44,s:1.05,rot:0,   a:.4}
  ];
  var secs=[],tops=[],W=0,H=0,DPR=1;
  function layout(){
    W=window.innerWidth;H=window.innerHeight;DPR=Math.min(window.devicePixelRatio||1,2);narrow=W<900;
    cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);gl.viewport(0,0,cv.width,cv.height);
    secs=STAGES.map(function(s){return document.getElementById(s.id)});
    tops=secs.map(function(el){return el?el.getBoundingClientRect().top+window.scrollY:0});
  }
  layout();
  window.addEventListener('resize',layout);
  window.addEventListener('load',layout);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);
  if('ResizeObserver' in window)new ResizeObserver(function(){var t=secs.map(function(el){return el?el.getBoundingClientRect().top+window.scrollY:0});for(var i=0;i<t.length;i++)tops[i]=t[i]}).observe(document.querySelector('main'));

  function params(st){
    if(!narrow)return st;
    var hero=st.id==='inicio';
    return{id:st.id,shape:st.shape,cx:.5,cy:hero?.76:.5,s:st.s*(hero?.62:.7),rot:st.rot,a:st.a*(hero?1:.3)};
  }

  var mx=.5,my=.5,smx=.5,smy=.5;
  window.addEventListener('pointermove',function(e){mx=e.clientX/W;my=e.clientY/H},{passive:true});

  var sY=window.scrollY,last=0,running=true,t0=performance.now();
  document.addEventListener('visibilitychange',function(){running=!document.hidden;if(running)requestAnimationFrame(frame)});

  function frame(now){
    if(!running)return;
    requestAnimationFrame(frame);
    var t=reduce?0:(now-t0)/1000;
    sY+=(window.scrollY-sY)*(reduce?1:.13);
    smx+=(mx-smx)*.05;smy+=(my-smy)*.05;

    /* estado atual */
    var j=0,tm=0;
    for(var k=STAGES.length-1;k>=1;k--){var start=tops[k]-.85*H;if(sY>start){j=k;tm=clamp((sY-start)/(1.0*H),0,1);break}}
    var A=params(STAGES[j>0?j-1:0]),B=params(STAGES[j]);
    if(j===0){B=A;tm=0}
    var e=tm*tm*(3-2*tm);
    var cx=(A.cx+(B.cx-A.cx)*e)*W, cy=(A.cy+(B.cy-A.cy)*e)*H;
    var unit=(narrow?Math.min(W*.30,H*.27):Math.min(W*.19,H*.31))*(A.s+(B.s-A.s)*e);
    var al=A.a+(B.a-A.a)*e, rot=A.rot+(B.rot-A.rot)*e;
    var SA=P[A.shape],SB=P[B.shape],morph=A.shape!==B.shape&&tm>0;
    var scat=(A.shape==='scatter'?1-e:0)+(B.shape==='scatter'?e:0);
    var amp=.012+scat*.05;
    var ry=rot+(reduce?0:Math.sin(t*.27)*.32+t*.018*scat)+sY*.00035+(smx-.5)*.3;
    var ca=Math.cos(ry),sa=Math.sin(ry);
    var pxo=(smx-.5)*-18,pyo=(smy-.5)*-12;

    var o=0;
    for(var i=0;i<N;i++){
      var i3=i*3,x,y,z,r,g,b;
      if(morph){
        var u=clamp(tm*1.7-dl[i]*.7,0,1);u=u*u*(3-2*u);
        x=SA.p[i3];y=SA.p[i3+1];z=SA.p[i3+2];
        var swp=Math.sin(u*Math.PI)*.45;
        x+=(SB.p[i3]-x)*u+sx[i]*swp;y+=(SB.p[i3+1]-y)*u+sy[i]*swp;z+=(SB.p[i3+2]-z)*u+sz[i]*swp;
        r=SA.c[i3]+(SB.c[i3]-SA.c[i3])*u;g=SA.c[i3+1]+(SB.c[i3+1]-SA.c[i3+1])*u;b=SA.c[i3+2]+(SB.c[i3+2]-SA.c[i3+2])*u;
      }else{
        var S=tm>=1?SB:SA;
        x=S.p[i3];y=S.p[i3+1];z=S.p[i3+2];r=S.c[i3];g=S.c[i3+1];b=S.c[i3+2];
      }
      var pp=ph[i];
      x+=Math.sin(t*.5+pp)*amp;y+=Math.cos(t*.43+pp*1.3)*amp;z+=Math.sin(t*.37+pp*.7)*amp;
      var xr=x*ca+z*sa,zr=-x*sa+z*ca,pf=1/(1-zr*.16);
      var X=cx+xr*unit*pf+pxo*zr,Y=cy-y*unit*pf+pyo*zr;
      var dA=.4+.6*clamp((zr+1.3)/2.6,0,1);
      var tw=.82+.18*Math.sin(t*1.6+pp*3);
      buf[o]=X;buf[o+1]=Y;buf[o+2]=bs[i]*pf*(narrow?.8:1);buf[o+3]=an[i]+t*sp[i];
      buf[o+4]=r;buf[o+5]=g;buf[o+6]=b;buf[o+7]=al*dA*tw;buf[o+8]=0;
      o+=STR;
    }
    for(var f=0;f<NF;f++){
      var F=fl[f],span=H*1.5;
      var yy=((F.y*span-sY*F.sp)%span+span)%span-H*.25;
      var xx=F.x*W+Math.sin(t*.2+F.ph)*14+(smx-.5)*-40*F.sp;
      buf[o]=xx;buf[o+1]=yy;buf[o+2]=F.size*(narrow?.7:1);buf[o+3]=F.a0+t*F.w;
      buf[o+4]=F.col[0];buf[o+5]=F.col[1];buf[o+6]=F.col[2];buf[o+7]=F.al*(.7+.3*Math.sin(t*.8+F.ph));buf[o+8]=F.t;
      o+=STR;
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uR,W,H);gl.uniform1f(uD,DPR);gl.uniform1f(uMax,maxPt);
    gl.bufferSubData(gl.ARRAY_BUFFER,0,buf);
    gl.drawArrays(gl.POINTS,0,TOT);
  }
  requestAnimationFrame(frame);
  window.__fxDebug=function(){return{sY:sY,tops:tops,W:W,H:H}};
})();

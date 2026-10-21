/* =====================================================================
   TWOS: WORLD OF COLOURS — Sampa Games
   Orijinal TWOS (Unity) oyununun renkleri, müziği ve sesleriyle
   three.js üzerinde baştan yazıldı. Kendi rengini it, başka renge dokunma!
   ===================================================================== */
'use strict';
(function(){
const $=id=>document.getElementById(id);
const SAVE='twos2-save';
/* ------------------------------ DİL ------------------------------ */
const L={
tr:{sub:'RENKLER DÜNYASI',play:'BÖLÜM',shop:'Toplar',daily:'Günlük',go:'Hadi!',paused:'Mola',resume:'Devam',restart:'Baştan',home:'Ana menü',complete:'TAMAM!',triple:'Ödülü 3 katına çıkar',next:'Sonraki bölüm',oops:'PATLADI!',revive:'Kaldığın yerden devam',retry:'Tekrar dene',close:'Kapat',free:'Ücretsiz 150 altın',dailyT:'Günlük hediye',claim:'Al',dailyAd:'Reklamla +120',
 hint:'Sürükle ve kendi rengini it!',pushed:'itildi',gate:'RENK DEĞİŞTİ!',dayN:'Gün',claimed:'Bugünün hediyesi alındı',streak:'Seri',use:'Kullan',inUse:'Seçili',worldDone:'dünyası renklendi!',lang:'Türkçe',best:'En iyi',
 w0:'Şeker Vadisi',w1:'Gece Bahçesi',w2:'Lav Diyarı',w3:'Buz Ülkesi',w4:'Neon Şehir',
 story:'Renkler Dünyası rengârenkti... ta ki Gri Sis gelene kadar.\n\nSis her şeyi birbirine kattı. Artık her renk kendi yerini arıyor.\n\nSen sihirli topsun: <b>kendi rengindeki</b> şekilleri yoldan it, <b>başka renklere</b> sakın dokunma! Renk kapılarından geçince rengin değişir.\n\nBeş dünyayı yeniden renklendir!'},
en:{sub:'WORLD OF COLOURS',play:'LEVEL',shop:'Balls',daily:'Daily',go:'Let\'s go!',paused:'Paused',resume:'Resume',restart:'Restart',home:'Home',complete:'COMPLETE!',triple:'Triple the reward',next:'Next level',oops:'BOOM!',revive:'Continue from here',retry:'Try again',close:'Close',free:'Free 150 coins',dailyT:'Daily gift',claim:'Claim',dailyAd:'+120 with an ad',
 hint:'Drag and push your own colour!',pushed:'pushed',gate:'COLOUR SWAP!',dayN:'Day',claimed:'Today\'s gift claimed',streak:'Streak',use:'Use',inUse:'Selected',worldDone:'is colourful again!',lang:'English',best:'Best',
 w0:'Candy Valley',w1:'Night Garden',w2:'Lava Land',w3:'Ice Country',w4:'Neon City',
 story:'The World of Colours was bright and happy... until the Grey Fog came.\n\nThe fog mixed everything up. Now every colour is looking for its place.\n\nYou are the magic ball: push shapes of <b>your own colour</b> off the road and never touch <b>other colours</b>! Colour gates change your colour.\n\nBring colour back to five worlds!'},
es:{sub:'MUNDO DE COLORES',play:'NIVEL',shop:'Bolas',daily:'Diario',go:'¡Vamos!',paused:'Pausa',resume:'Seguir',restart:'Reiniciar',home:'Inicio',complete:'¡LISTO!',triple:'Triplicar premio',next:'Siguiente',oops:'¡BUM!',revive:'Seguir desde aquí',retry:'Reintentar',close:'Cerrar',free:'150 monedas gratis',dailyT:'Regalo diario',claim:'Tomar',dailyAd:'+120 con anuncio',
 hint:'¡Arrastra y empuja tu color!',pushed:'empujados',gate:'¡CAMBIO DE COLOR!',dayN:'Día',claimed:'Regalo de hoy tomado',streak:'Racha',use:'Usar',inUse:'Elegida',worldDone:'¡tiene color otra vez!',lang:'Español',best:'Récord',
 w0:'Valle Dulce',w1:'Jardín Nocturno',w2:'Tierra de Lava',w3:'País de Hielo',w4:'Ciudad Neón',
 story:'El Mundo de Colores era alegre... hasta que llegó la Niebla Gris.\n\nEres la bola mágica: empuja las formas de <b>tu color</b> y no toques <b>otros colores</b>. Las puertas cambian tu color.\n\n¡Devuelve el color a cinco mundos!'},
pt:{sub:'MUNDO DAS CORES',play:'FASE',shop:'Bolas',daily:'Diário',go:'Vamos!',paused:'Pausa',resume:'Continuar',restart:'Reiniciar',home:'Início',complete:'CONCLUÍDO!',triple:'Triplicar prêmio',next:'Próxima fase',oops:'BUM!',revive:'Continuar daqui',retry:'Tentar de novo',close:'Fechar',free:'150 moedas grátis',dailyT:'Presente diário',claim:'Pegar',dailyAd:'+120 com anúncio',
 hint:'Arraste e empurre sua cor!',pushed:'empurrados',gate:'TROCA DE COR!',dayN:'Dia',claimed:'Presente de hoje coletado',streak:'Sequência',use:'Usar',inUse:'Escolhida',worldDone:'ganhou cor de novo!',lang:'Português',best:'Recorde',
 w0:'Vale Doce',w1:'Jardim Noturno',w2:'Terra de Lava',w3:'País de Gelo',w4:'Cidade Neon',
 story:'O Mundo das Cores era alegre... até a Névoa Cinza chegar.\n\nVocê é a bola mágica: empurre as formas da <b>sua cor</b> e nunca toque <b>outras cores</b>. Os portais mudam sua cor.\n\nDevolva a cor a cinco mundos!'}};
/* yetenekli toplar, görevler, oyuncu seviyesi */
const L2={
tr:{openChest:'Sandığı aç',missions:'Görevler',lvS:'Sv.',chest:'Sandık',chestT:'Hazine Sandığı',tapOpen:'Açmak için dokun!',chestCoins:'{n} altın kazandın!',chestUp:'{b} bir seviye güçlendi!',chestBall:'Yeni top: {b}!',great:'Harika!',
 buy:'Satın al',upgrade:'Geliştir',max:'MAKS',need:'Altının yetmiyor',adOpen:'Reklamla aç',unlocked:'{b} artık senin!',upgraded:'{b} güçlendi!',
 b_klasik:'Klasik',b_ziplayan:'Zıplayan',b_miknatis:'Mıknatıs',b_kalkan:'Kalkan',b_dev:'Dev',b_turbo:'Turbo',b_hayalet:'Hayalet',b_gokkusagi:'Gökkuşağı',
 d_none:'Özel gücü yok. Sadece sen ve becerin!',d_jump:'Butona bas, zıpla! Havadayken hiçbir şey sana dokunamaz.',d_magnet:'Yakındaki altınları ve kendi rengindeki şekilleri kendine çeker.',d_shield:'Bölüme kalkanla başlar. Yanlış renge çarparsan kalkan patlar, sen kurtulursun.',d_giant:'Kocaman gövde: daha çok şekil iter ama yana biraz ağır döner.',d_turbo:'Butona bas, ileri fırla! Ezdiğin her şekil fazladan altın getirir.',d_ghost:'Butona bas, hayalet ol: yanlış renklerin içinden geçip gidersin.',d_luck:'Şans topu: her bölüm sonunda fazladan altın kazandırır.',
 s_jump:'{v} sn bekleme',s_magnet:'{v} m çekim alanı',s_shield:'{v} kalkan',s_shieldR:'{v} kalkan, {w} sn\'de yenilenir',s_giant:'%{v} boyut',s_turbo:'{v} sn bekleme, şekil başı +{w} altın',s_ghost:'{v} sn hayalet',s_luck:'+%{v} altın',nxt:'Sonra',
 m_push:'{n} şekli yoldan it',m_win:'{n} bölüm bitir',m_coin:'Oyunda {n} altın topla',m_ab:'Özel gücünü {n} kez kullan',m_star:'{n} bölümü 3 yıldızla bitir',m_gate:'{n} renk kapısından geç',
 mNew:'Yeni görevler',allDone:'Bugünkü görevler bitti, yarın yenileri gelecek!',hh:'sa',mm:'dk',shieldHit:'Kalkan seni korudu!',lvUp:'SEVİYE {n}! +{c} altın',chestWon:'Sandık kazandın!',plv:'Seviye'},
en:{openChest:'Open chest',missions:'Missions',lvS:'Lv.',chest:'Chest',chestT:'Treasure Chest',tapOpen:'Tap to open!',chestCoins:'You won {n} coins!',chestUp:'{b} levelled up!',chestBall:'New ball: {b}!',great:'Great!',
 buy:'Buy',upgrade:'Upgrade',max:'MAX',need:'Not enough coins',adOpen:'Unlock with ads',unlocked:'{b} is yours!',upgraded:'{b} upgraded!',
 b_klasik:'Classic',b_ziplayan:'Bouncy',b_miknatis:'Magnet',b_kalkan:'Shield',b_dev:'Giant',b_turbo:'Turbo',b_hayalet:'Ghost',b_gokkusagi:'Rainbow',
 d_none:'No special power. Just you and your skill!',d_jump:'Tap the button to jump! Nothing can touch you in the air.',d_magnet:'Pulls nearby coins and shapes of your colour towards you.',d_shield:'Starts each level with a shield. Hit a wrong colour and the shield pops instead of you.',d_giant:'Huge body: pushes more shapes but steers a bit slower.',d_turbo:'Tap to dash forward! Every shape you smash gives extra coins.',d_ghost:'Tap to turn into a ghost and pass right through wrong colours.',d_luck:'Lucky ball: earns extra coins at the end of every level.',
 s_jump:'{v}s cooldown',s_magnet:'{v}m pull range',s_shield:'{v} shield(s)',s_shieldR:'{v} shield(s), refills in {w}s',s_giant:'{v}% size',s_turbo:'{v}s cooldown, +{w} coins per shape',s_ghost:'{v}s ghost',s_luck:'+{v}% coins',nxt:'Next',
 m_push:'Push {n} shapes off the road',m_win:'Finish {n} levels',m_coin:'Collect {n} coins in play',m_ab:'Use your power {n} times',m_star:'Get 3 stars on {n} levels',m_gate:'Pass {n} colour gates',
 mNew:'New missions in',allDone:'All done for today, new missions tomorrow!',hh:'h',mm:'m',shieldHit:'Shield saved you!',lvUp:'LEVEL {n}! +{c} coins',chestWon:'You won a chest!',plv:'Level'},
es:{openChest:'Abrir cofre',missions:'Misiones',lvS:'Nv.',chest:'Cofre',chestT:'Cofre del tesoro',tapOpen:'¡Toca para abrir!',chestCoins:'¡Ganaste {n} monedas!',chestUp:'¡{b} subió de nivel!',chestBall:'¡Nueva bola: {b}!',great:'¡Genial!',
 buy:'Comprar',upgrade:'Mejorar',max:'MÁX',need:'No tienes monedas suficientes',adOpen:'Desbloquear con anuncios',unlocked:'¡{b} es tuya!',upgraded:'¡{b} mejorada!',
 b_klasik:'Clásica',b_ziplayan:'Saltarina',b_miknatis:'Imán',b_kalkan:'Escudo',b_dev:'Gigante',b_turbo:'Turbo',b_hayalet:'Fantasma',b_gokkusagi:'Arcoíris',
 d_none:'Sin poder especial. ¡Solo tú y tu habilidad!',d_jump:'¡Pulsa el botón para saltar! En el aire nada puede tocarte.',d_magnet:'Atrae las monedas cercanas y las formas de tu color.',d_shield:'Empieza cada nivel con escudo. Si tocas otro color, el escudo se rompe y tú te salvas.',d_giant:'Cuerpo enorme: empuja más formas pero gira un poco más lento.',d_turbo:'¡Pulsa para acelerar! Cada forma que aplastas da monedas extra.',d_ghost:'Pulsa para volverte fantasma y atravesar los otros colores.',d_luck:'Bola de la suerte: gana monedas extra al final de cada nivel.',
 s_jump:'{v} s de espera',s_magnet:'{v} m de atracción',s_shield:'{v} escudo(s)',s_shieldR:'{v} escudo(s), se recarga en {w} s',s_giant:'{v}% de tamaño',s_turbo:'{v} s de espera, +{w} monedas por forma',s_ghost:'{v} s fantasma',s_luck:'+{v}% monedas',nxt:'Luego',
 m_push:'Empuja {n} formas fuera',m_win:'Completa {n} niveles',m_coin:'Recoge {n} monedas jugando',m_ab:'Usa tu poder {n} veces',m_star:'Consigue 3 estrellas en {n} niveles',m_gate:'Cruza {n} puertas de color',
 mNew:'Nuevas misiones en',allDone:'¡Todo listo por hoy, mañana hay más!',hh:'h',mm:'min',shieldHit:'¡El escudo te salvó!',lvUp:'¡NIVEL {n}! +{c} monedas',chestWon:'¡Ganaste un cofre!',plv:'Nivel'},
pt:{openChest:'Abrir baú',missions:'Missões',lvS:'Nv.',chest:'Baú',chestT:'Baú do tesouro',tapOpen:'Toque para abrir!',chestCoins:'Você ganhou {n} moedas!',chestUp:'{b} subiu de nível!',chestBall:'Nova bola: {b}!',great:'Ótimo!',
 buy:'Comprar',upgrade:'Melhorar',max:'MÁX',need:'Moedas insuficientes',adOpen:'Liberar com anúncios',unlocked:'{b} é sua!',upgraded:'{b} melhorou!',
 b_klasik:'Clássica',b_ziplayan:'Saltitante',b_miknatis:'Ímã',b_kalkan:'Escudo',b_dev:'Gigante',b_turbo:'Turbo',b_hayalet:'Fantasma',b_gokkusagi:'Arco-íris',
 d_none:'Sem poder especial. Só você e sua habilidade!',d_jump:'Toque no botão para pular! No ar nada pode te tocar.',d_magnet:'Puxa moedas próximas e formas da sua cor.',d_shield:'Começa cada fase com escudo. Se tocar outra cor, o escudo estoura no seu lugar.',d_giant:'Corpo enorme: empurra mais formas, mas vira um pouco mais devagar.',d_turbo:'Toque para disparar! Cada forma esmagada dá moedas extras.',d_ghost:'Toque para virar fantasma e atravessar as outras cores.',d_luck:'Bola da sorte: ganha moedas extras no fim de cada fase.',
 s_jump:'{v} s de espera',s_magnet:'{v} m de atração',s_shield:'{v} escudo(s)',s_shieldR:'{v} escudo(s), recarrega em {w} s',s_giant:'{v}% de tamanho',s_turbo:'{v} s de espera, +{w} moedas por forma',s_ghost:'{v} s fantasma',s_luck:'+{v}% moedas',nxt:'Depois',
 m_push:'Empurre {n} formas para fora',m_win:'Complete {n} fases',m_coin:'Colete {n} moedas jogando',m_ab:'Use seu poder {n} vezes',m_star:'Faça 3 estrelas em {n} fases',m_gate:'Passe por {n} portais de cor',
 mNew:'Novas missões em',allDone:'Tudo feito hoje, amanhã tem mais!',hh:'h',mm:'min',shieldHit:'O escudo te salvou!',lvUp:'NÍVEL {n}! +{c} moedas',chestWon:'Você ganhou um baú!',plv:'Nível'}};
for(const k in L2)Object.assign(L[k],L2[k]);
/* ------------------------------ KAYIT ------------------------------ */
let S={coins:0,level:1,skin:0,owned:[0],sound:true,vib:true,lang:null,daily:{last:'',streak:0},storySeen:false,adC:{d:'',n:0},stars:{},
  ball:'klasik',bl:{klasik:1},xp:0,plv:1,chests:0,ms:{d:'',list:[]},adU:{}};
try{const d=JSON.parse(localStorage.getItem(SAVE)||'{}');S=Object.assign(S,d);S.daily=Object.assign({last:'',streak:0},d.daily||{});S.adC=d.adC||{d:'',n:0};S.stars=d.stars||{};
  // eski kayıt: kozmetik top dizinleri -> yetenekli toplar (aynı görünüm aynı yerde)
  const OLD=['klasik','gokkusagi','miknatis','ziplayan','hayalet','dev','kalkan','turbo'];
  if(!d.bl||typeof d.bl!=='object'){S.bl={klasik:1};(Array.isArray(d.owned)?d.owned:[]).forEach(i=>{if(OLD[i])S.bl[OLD[i]]=1;});S.ball=OLD[d.skin]||'klasik';}
  S.bl.klasik=1;if(!S.bl[S.ball])S.ball='klasik';
  S.xp=+S.xp||0;S.plv=Math.max(1,+S.plv||1);S.chests=Math.max(0,+S.chests||0);
  if(!S.ms||!Array.isArray(S.ms.list))S.ms={d:'',list:[]};if(!S.adU||typeof S.adU!=='object')S.adU={};}catch(e){}
const save=()=>{try{localStorage.setItem(SAVE,JSON.stringify(S));}catch(e){}};
let lang=S.lang||(navigator.language||'en').slice(0,2);if(!L[lang])lang='en';
const t=k=>L[lang][k]!=null?L[lang][k]:(L.en[k]!=null?L.en[k]:k);

/* ------------------------------ RENKLER (orijinal malzemelerden) ------------------------------ */
const C={cyan:0x00CFE8,yellow:0xE4CF00,red:0xF90000,green:0x15D300,dgreen:0x0A6300,magenta:0xFF00ED,blue:0x0028FF,purple:0x8E00FF,pink:0xFF6270,black:0x1a1a1a,white:0xF4F4F4,teal:0x62B29A,plum:0x824E9F,sky:0x9BE5FF,lime:0x39D555,gold:0xFFFB00};
const WORLDS=[
 {sky:[0x8fd3ff,0xffd6ec],ground:0x4a3a66,edge:0xff7cc0,pairs:[['cyan','red'],['yellow','purple'],['pink','blue']],lane:4},
 {sky:[0x1b1446,0x5b2bd1],ground:0x2a2260,edge:0x8e7cff,pairs:[['lime','magenta'],['sky','pink'],['gold','plum']],lane:3.4},
 {sky:[0x3a0a0a,0xff7a2f],ground:0x3a2a2a,edge:0xff5a2a,pairs:[['gold','blue'],['white','red'],['cyan','magenta']],lane:4.6},
 {sky:[0x6fb6ff,0xe8f6ff],ground:0x2f4a6e,edge:0x3d9bff,pairs:[['blue','pink'],['teal','red'],['purple','yellow']],lane:3.8},
 {sky:[0x0a0820,0x2a0a4a],ground:0x161030,edge:0x00ffd5,pairs:[['magenta','lime'],['cyan','gold'],['pink','sky']],lane:5}];
/* Toplar: görünüm + yetenek. v/w = 1..5. seviye değerleri */
const BALLS=[
 {id:'klasik',c:null,p:0,ab:null,ic:'⚪'},
 {id:'ziplayan',c:0xff5fa8,p:400,ab:'jump',ic:'🦘',act:1,tr:[0xff5fa8,0xffffff],v:[6,5.2,4.4,3.6,3]},
 {id:'miknatis',c:0xffd84a,p:700,ab:'magnet',ic:'🧲',ad:3,tr:[0xffd84a,0xffffff],v:[2.6,3.1,3.6,4.1,4.7]},
 {id:'kalkan',c:0xbfe8ff,p:1000,ab:'shield',ic:'🛡️',tr:[0xffffff,0x7cc7ff],v:[1,2,2,3,3],w:[0,0,12,12,8]},
 {id:'dev',c:0xff5a2a,p:1600,ab:'giant',ic:'🐘',tr:[0xff5a2a,0xffd84a],v:[125,132,139,146,153]},
 {id:'turbo',c:0x00ffd5,p:2400,ab:'turbo',ic:'🚀',act:1,tr:[0xff00ed,0x00ffd5],v:[8,7,6,5.2,4.5],w:[1,1,2,2,3]},
 {id:'hayalet',c:0x1b1446,p:3500,ab:'ghost',ic:'👻',act:1,tr:[0x8e7cff,0x00ffd5],v:[1.5,2,2.5,3,3.5]},
 {id:'gokkusagi',c:'rainbow',p:5000,ab:'luck',ic:'🍀',tr:[0xff0000,0xffff00,0x00ff00,0x0000ff],v:[20,30,40,50,60]}];
const BID={};BALLS.forEach(b=>BID[b.id]=b);
const curBall=()=>BID[S.ball]||BALLS[0];
const ballLv=b=>S.bl[b.id]||0;
const upCost=(b,lv)=>Math.round((100+b.p*.2)*lv/10)*10; // lv -> lv+1
const abVal=(b,lv,k)=>(b[k||'v']||[])[Math.max(0,Math.min(4,lv-1))];
const GHOST_CD=10;
function statTxt(b,lv){if(!b.ab)return '';let k='s_'+b.ab;const w=abVal(b,lv,'w');if(b.ab==='shield'&&w)k='s_shieldR';return t(k).replace('{v}',abVal(b,lv)).replace('{w}',w);}

/* ------------------------------ SES ------------------------------ */
let AC=null,master=null,musG=null,sfxG=null,musSrc=null;const BUF={};
function audioInit(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=S.sound?1:0;master.connect(AC.destination);musG=AC.createGain();musG.gain.value=.3;musG.connect(master);sfxG=AC.createGain();sfxG.connect(master);
 ['music','blowup','click','complete','hit','cash'].forEach(n=>fetch('snd/'+n+'.mp3').then(r=>r.arrayBuffer()).then(b=>AC.decodeAudioData(b)).then(d=>{BUF[n]=d;if(n==='music')startMusic();}).catch(()=>{}));}catch(e){}}
function startMusic(){if(!AC||!BUF.music||musSrc)return;musSrc=AC.createBufferSource();musSrc.buffer=BUF.music;musSrc.loop=true;musSrc.connect(musG);musSrc.start();}
function snd(n,v,r){if(!AC||!BUF[n])return;const s=AC.createBufferSource();s.buffer=BUF[n];s.playbackRate.value=r||1;const g=AC.createGain();g.gain.value=v==null?1:v;s.connect(g);g.connect(sfxG);s.start();}
function pop(f){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(f,AC.currentTime);o.frequency.exponentialRampToValueAtTime(f*1.8,AC.currentTime+.08);g.gain.setValueAtTime(.08,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.12);o.connect(g);g.connect(sfxG);o.start();o.stop(AC.currentTime+.13);}
function vib(ms){if(!S.vib)return;try{navigator.vibrate&&navigator.vibrate(ms);}catch(e){}}

/* ------------------------------ THREE ------------------------------ */
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(60,1,.3,400);
const hemi=new THREE.HemisphereLight(0xffffff,0x4a4a66,.62);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xFFF4D6,.7);sun.position.set(-6,14,-8);scene.add(sun);
scene.add(sun.target);
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.fov=camera.aspect<.6?64:58;camera.updateProjectionMatrix();}
addEventListener('resize',resize);resize();
// gökyüzü
const skyGeo=new THREE.SphereGeometry(300,24,12);const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{a:{value:new THREE.Color()},b:{value:new THREE.Color()}},vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform vec3 a;uniform vec3 b;varying float h;void main(){gl_FragColor=vec4(mix(b,a,clamp(h*1.4+.25,0.,1.)),1.);}'});
const sky=new THREE.Mesh(skyGeo,skyMat);scene.add(sky);
// paylaşılan geometriler
const GEO={cube:new THREE.BoxGeometry(1,1,1),cyl:new THREE.CylinderGeometry(.5,.5,1,16),sph:new THREE.SphereGeometry(.5,16,12),pyr:new THREE.ConeGeometry(.62,1,4),small:new THREE.SphereGeometry(.28,10,8),coin:new THREE.CylinderGeometry(.32,.32,.08,18),shard:new THREE.TetrahedronGeometry(.22)};
GEO.pyr.rotateY(Math.PI/4);
const MATS={};function mat(hex,opts){const k=hex+(opts?JSON.stringify(opts):'');if(!MATS[k])MATS[k]=new THREE.MeshStandardMaterial(Object.assign({color:hex,roughness:.35,metalness:.05},opts||{}));return MATS[k];}
// snow / confetti particles
const ptsGeo=new THREE.BufferGeometry();const NP=220;const pPos=new Float32Array(NP*3);for(let i=0;i<NP;i++){pPos[i*3]=(Math.random()-.5)*40;pPos[i*3+1]=Math.random()*25;pPos[i*3+2]=Math.random()*60-10;}
ptsGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));const pts=new THREE.Points(ptsGeo,new THREE.PointsMaterial({color:0xffffff,size:.18,transparent:true,opacity:.8}));scene.add(pts);

/* ------------------------------ BÖLÜM ÜRETİCİ ------------------------------ */
function rng(seed){let s=seed*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
let LV=null;
function buildLevel(n){
  const wi=Math.floor((n-1)/12)%5,W=WORLDS[wi],inW=(n-1)%12;const R=rng(n*77+13);
  const pair=W.pairs[Math.floor((n-1)/4)%3];
  const lane=W.lane*(n%7===0?0.75:1);
  const len=Math.min(420,90+n*6);const speed=Math.min(12,7.5+n*.06);
  const lv={n,wi,W,lane,len,speed,objs:[],coins:[],gates:[],movers:[],colorA:pair[0],colorB:pair[1],totalPush:0};
  let col=pair[0],oth=pair[1];
  const add=(shape,x,z,c,danger,sc)=>{const o={shape,x,z,y:0,vx:0,vz:0,vy:0,c,danger,r:shape==='sph'?.5:shape==='cube'?.62:.55,sc:sc||1,alive:true,falling:false,rot:new THREE.Euler(),spin:0,sleep:true};o.r*=o.sc;lv.objs.push(o);if(!danger)lv.totalPush++;return o;};
  let z=14;
  const shapes=['cube','cyl','pyr','sph'];
  const diff=Math.min(1,n/40);
  while(z<len-14){
    const r=z<30?0:R();let used=8;
    if(r<.22){// itilecek yığın
      const rows=3+Math.floor(R()*4),sh=shapes[Math.floor(R()*4)];
      for(let i=0;i<rows;i++)for(let x=-lane+1;x<=lane-1;x+=1.3)if(R()<.75)add(sh,x+(R()-.5)*.3,z+i*1.3,col,false);
      used=rows*1.3+4;}
    else if(r<.42){// engel duvarı, açıklık
      const gapW=Math.max(2.2,3.6-diff*1.2),gx=(R()*2-1)*(lane-gapW/2-.6);
      for(let x=-lane+.5;x<=lane-.5;x+=1.05)if(Math.abs(x-gx)>gapW/2)add('cube',x,z,oth,true);
      // açıklıkta kendi rengin
      for(let i=0;i<3;i++)add('cyl',gx+(R()-.5)*.8,z+1.4+i*1.2,col,false);
      used=7;}
    else if(r<.55&&n>3){// hareketli engeller
      const k=1+Math.floor(R()*2+diff);for(let i=0;i<k;i++){const o=add('cube',(R()*2-1)*lane*.6,z+i*3,oth,true,1.15);o.mover={amp:lane-1.2,sp:1+R()*1.2+diff,ph:R()*6};}
      used=k*3+4;}
    else if(r<.66){// karışık saha
      const cnt=10+Math.floor(diff*12);for(let i=0;i<cnt;i++){const d=R()<.35+diff*.15;add(shapes[Math.floor(R()*4)],(R()*2-1)*(lane-.7),z+R()*10,d?oth:col,d);}
      used=13;}
    else if(r<.76&&n>2){// top havuzu
      const rows=4+Math.floor(R()*3);for(let i=0;i<rows;i++)for(let x=-lane+.6;x<=lane-.6;x+=.95)add('sph',x+(R()-.5)*.2,z+i*.95,col,false,.8);
      used=rows+5;}
    else if(r<.86&&n>4){// renk kapısı
      lv.gates.push({z:z+2,from:col,to:oth});const tmp=col;col=oth;oth=tmp;
      for(let x=-lane+1;x<=lane-1;x+=1.4)add('pyr',x,z+5,col,false);
      used=8;}
    else{// slalom
      for(let i=0;i<5;i++){const s=i%2?1:-1;add('cyl',s*(lane*.45),z+i*2.4,oth,true,1.1);add('cube',-s*(lane*.45),z+i*2.4,col,false);}
      used=14;}
    // altınlar
    if(R()<.6){const cx=(R()*2-1)*(lane-1);for(let i=0;i<4;i++)lv.coins.push({x:cx,z:z+used*.5+i*1.2,got:false});}
    z+=used+4+R()*3;}
  // bitiş duvarı: kendi rengin
  for(let i=0;i<3;i++)for(let x=-lane+.6;x<=lane-.6;x+=1.05)add('cube',x,len-8+i*1.05,col,false);
  lv.finalColor=col;
  return lv;}

/* ------------------------------ SAHNE KURULUMU ------------------------------ */
let world=new THREE.Group();scene.add(world);
let ball=null,ballMat=null,trail=[];
function clearWorld(){scene.remove(world);world.traverse(o=>{if(o.geometry&&!Object.values(GEO).includes(o.geometry))o.geometry.dispose();});world=new THREE.Group();scene.add(world);}
function setupScene(lv){
  clearWorld();const W=lv.W;
  skyMat.uniforms.a.value.setHex(W.sky[0]);skyMat.uniforms.b.value.setHex(W.sky[1]);
  scene.fog=new THREE.Fog(W.sky[1],40,110);
  pts.material.color.setHex(lv.wi===2?0xffb070:lv.wi===4?0x00ffd5:0xffffff);
  // zemin
  const g=new THREE.Mesh(new THREE.BoxGeometry(lv.lane*2,.4,lv.len+20),mat(W.ground,{roughness:.95,metalness:0}));g.position.set(0,-.7,lv.len/2-5);world.add(g);
  for(const s of [-1,1]){const e=new THREE.Mesh(new THREE.BoxGeometry(.12,.42,lv.len+20),mat(W.edge,{emissive:W.edge,emissiveIntensity:.4}));e.position.set(s*lv.lane,-.68,lv.len/2-5);world.add(e);}
  // şeritler
  for(let z=0;z<lv.len;z+=6){const st=new THREE.Mesh(new THREE.BoxGeometry(.18,.02,2),mat(W.edge,{transparent:true,opacity:.35}));st.position.set(0,-.49,z);world.add(st);}
  // bitiş çizgisi
  const fin=new THREE.Group();for(let i=0;i<Math.ceil(lv.lane*2/0.5);i++)for(let j=0;j<2;j++){const q=new THREE.Mesh(new THREE.BoxGeometry(.5,.03,.5),mat((i+j)%2?0x111111:0xffffff));q.position.set(-lv.lane+.25+i*.5,-.48,lv.len-2+j*.5);fin.add(q);}world.add(fin);
  // nesneler
  for(const o of lv.objs){const m=new THREE.Mesh(GEO[o.shape],mat(C[o.c]));m.scale.setScalar(o.sc);m.position.set(o.x,-.5+.5*o.sc,o.z);o.mesh=m;world.add(m);
    if(o.danger){const ring=new THREE.Mesh(new THREE.TorusGeometry(.62*o.sc,.05,6,20),mat(0x000000,{transparent:true,opacity:.35}));ring.rotation.x=Math.PI/2;ring.position.y=-.5*o.sc+.02;m.add(ring);}}
  for(const c of lv.coins){const m=new THREE.Mesh(GEO.coin,mat(0xffd84a,{metalness:.6,roughness:.25,emissive:0x664400,emissiveIntensity:.3}));m.rotation.x=Math.PI/2;m.position.set(c.x,.2,c.z);c.mesh=m;world.add(m);}
  for(const gt of lv.gates){const grp=new THREE.Group();const m=new THREE.Mesh(new THREE.BoxGeometry(lv.lane*2,2.6,.15),mat(C[gt.to],{transparent:true,opacity:.35,emissive:C[gt.to],emissiveIntensity:.5}));m.position.y=.8;grp.add(m);
    for(const s of [-1,1]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,3,10),mat(C[gt.to],{emissive:C[gt.to],emissiveIntensity:.6}));p.position.set(s*lv.lane,1,0);grp.add(p);}grp.position.z=gt.z;gt.mesh=grp;world.add(grp);}
  // top
  const sk=curBall();
  ballMat=new THREE.MeshStandardMaterial({color:C[lv.colorA],roughness:.15,metalness:.15,emissive:C[lv.colorA],emissiveIntensity:.12});
  ball=new THREE.Mesh(new THREE.SphereGeometry(.5,28,20),ballMat);ball.position.set(0,0,2);world.add(ball);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.56,.06,8,28),new THREE.MeshStandardMaterial({color:sk.c==='rainbow'?0xffffff:(sk.c||0xffffff),emissive:sk.c==='rainbow'?0xff66cc:(sk.c||0x444444),emissiveIntensity:.5}));ring.rotation.x=Math.PI/2;ball.add(ring);ball.userData.ring=ring;
  // kalkan balonu
  const bub=new THREE.Mesh(new THREE.SphereGeometry(.78,24,16),new THREE.MeshStandardMaterial({color:0x9fe6ff,emissive:0x3fb8ff,emissiveIntensity:.5,transparent:true,opacity:.28,depthWrite:false}));bub.visible=false;ball.add(bub);ball.userData.bub=bub;
  // gölge (zıplarken yeri gösterir) ve mıknatıs alanı
  const shd=new THREE.Mesh(new THREE.CircleGeometry(.5,20),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.3,depthWrite:false}));shd.rotation.x=-Math.PI/2;shd.visible=false;world.add(shd);ball.userData.shd=shd;
  const mr=new THREE.Mesh(new THREE.RingGeometry(.94,1,40),new THREE.MeshBasicMaterial({color:0xffd84a,transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false}));mr.rotation.x=-Math.PI/2;mr.visible=false;world.add(mr);ball.userData.mr=mr;
  trail.forEach(t=>world.remove(t));trail=[];
  const trCols=sk.tr||[0xffffff];for(let i=0;i<14;i++){const tm=new THREE.Mesh(new THREE.SphereGeometry(.3*(1-i/16),8,6),new THREE.MeshBasicMaterial({color:trCols[i%trCols.length],transparent:true,opacity:.45*(1-i/14)}));world.add(tm);trail.push(tm);}
}

/* ------------------------------ OYUN ------------------------------ */
let G={st:'menu'};
const IN={down:false,lx:0,dx:0,ly:0,dy:0};
function startLevel(n){
  audioInit();
  LV=buildLevel(n);setupScene(LV);
  G={st:'ready',n,z:2,b:2,zo:0,tzo:0,x:0,tx:0,color:LV.colorA,pushed:0,coins:0,cg:0,rp:0,rc:0,time:0,shield:0,revived:false,slow:1,deadT:0,shards:[],tok:Math.random(),
    ab:null,abL:0,cd:0,cdMax:0,air:0,airT:.95,jy:0,ghost:0,dash:0,charges:0,maxCh:0,regenT:0,regen:0,R:1,steer:1,mR:0,tbB:0,luck:0};
  const B=curBall(),bl=Math.max(1,ballLv(B));G.ab=B.ab;G.abL=bl;
  if(B.ab==='jump')G.cdMax=abVal(B,bl);
  if(B.ab==='turbo'){G.cdMax=abVal(B,bl);G.tbB=abVal(B,bl,'w');}
  if(B.ab==='ghost')G.cdMax=GHOST_CD;
  if(B.ab==='magnet')G.mR=abVal(B,bl);
  if(B.ab==='shield'){G.charges=G.maxCh=abVal(B,bl);G.regenT=abVal(B,bl,'w');}
  if(B.ab==='giant'){G.R=abVal(B,bl)/100;G.steer=.62;}
  if(B.ab==='luck')G.luck=abVal(B,bl)/100;
  ball.scale.setScalar(G.R);ball.position.set(0,(G.R-1)*.5,2);
  $('hint').style.display='block';$('hintT').textContent=t('hint');
  show(null);hud(true);updHud();updAbUI(true);camSnap();}
function hud(on){$('hud').classList.toggle('on',on);$('prog').classList.toggle('on',on);$('topMenu').style.display=on?'none':'flex';$('abB').classList.toggle('on',on&&!!G.ab&&!!(BID[S.ball]||{}).act);$('hAb').style.display=on&&G.ab==='shield'?'inline-flex':'none';}
/* yetenek butonu */
function useAb(){
  if(G.st==='ready'){G.st='play';$('hint').style.display='none';}
  if(G.st!=='play'||!G.ab||!curBall().act||G.cd>0)return false;
  G.cd=G.cdMax;
  if(G.ab==='jump'){G.air=G.airT;pop(380);snd('click',.5,1.3);vib(20);}
  else if(G.ab==='ghost'){G.ghost=abVal(curBall(),G.abL);ballMat.transparent=true;ballMat.opacity=.38;ballMat.depthWrite=false;snd('complete',.35,1.8);vib(20);}
  else if(G.ab==='turbo'){G.dash=.6;snd('hit',.6,.7);vib(35);shakeT=.12;}
  G.uses=(G.uses||0)+1;mAdd('ab',1);updAbUI(true);return true;}
let abLast='';
function updAbUI(force){const b=$('abB');if(!b)return;
  if(G.ab==='shield'){const s=$('hAb');const txt='🛡️ '+G.charges;if(s.textContent!==txt)s.textContent=txt;}
  if(!G.ab||!curBall().act)return;
  const f=G.cdMax?Math.max(0,G.cd)/G.cdMax:0;const key=f.toFixed(2)+'|'+(G.cd>0?Math.ceil(G.cd):'');if(!force&&key===abLast)return;abLast=key;
  b.querySelector('.ic').textContent=curBall().ic;b.querySelector('.cdv').style.background='conic-gradient(rgba(10,6,30,.68) '+f+'turn,transparent 0)';
  b.querySelector('.ct').textContent=G.cd>0?Math.ceil(G.cd):'';b.classList.toggle('rdy',G.cd<=0);}
const abBtn=$('abB');abBtn.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();audioInit();useAb();});
function updHud(){const mc=$('myCol');if(mc)mc.style.background='#'+C[G.color].toString(16).padStart(6,'0');$('hLv').textContent=t('play')+' '+G.n;$('hCoins').textContent=G.coins;$('pA').textContent=G.n;$('pC').textContent=G.n+1;$('pB').style.width=Math.min(100,(G.z/LV.len)*100)+'%';}
// dokunma
const cvs=renderer.domElement;
function pdown(e){audioInit();if(AC&&AC.state==='suspended')AC.resume();if(IN.down&&IN.id!==e.pointerId)return;IN.down=true;IN.id=e.pointerId;IN.lx=e.clientX;IN.ly=e.clientY;if(G.st==='ready'){G.st='play';$('hint').style.display='none';}}
function pmove(e){if(!IN.down||e.pointerId!==IN.id)return;IN.dx+=e.clientX-IN.lx;IN.lx=e.clientX;IN.dy+=e.clientY-IN.ly;IN.ly=e.clientY;}
function pup(e){if(e&&e.pointerId!==IN.id)return;IN.down=false;IN.id=null;}
cvs.addEventListener('pointerdown',pdown);addEventListener('pointermove',pmove);addEventListener('pointerup',pup);addEventListener('pointercancel',pup);
addEventListener('keydown',e=>{if((e.code==='Space'||e.code==='KeyE')&&G.st==='play'){useAb();return;}if(e.code==='ArrowLeft')IN.k=-1;if(e.code==='ArrowRight')IN.k=1;if(e.code==='ArrowUp')IN.kz=1;if(e.code==='ArrowDown')IN.kz=-1;if(G.st==='ready'&&(e.code==='Space'||e.code.startsWith('Arrow'))){G.st='play';$('hint').style.display='none';}});
addEventListener('keyup',e=>{if(e.code==='ArrowLeft'||e.code==='ArrowRight')IN.k=0;if(e.code==='ArrowUp'||e.code==='ArrowDown')IN.kz=0;});

/* ------------------------------ FİZİK ------------------------------ */
const CELL=2;
function step(dt){
  const lv=LV;G.time+=dt;
  // hareket
  const lane=lv.lane-.5;
  // sürükleme: ekran genişliği şerit genişliğinin ~1.3 katı
  const perPx=(lane*2*1.35)/Math.max(320,innerWidth);
  G.tx=Math.max(-lane,Math.min(lane,G.tx-IN.dx*perPx-(IN.k||0)*dt*9));IN.dx=0;
  const oldX=G.x,oldZ=G.z;
  G.x+=(G.tx-G.x)*Math.min(1,dt*18*G.steer);
  // ileri-geri: parmağı yukarı çekince top öne, aşağı çekince geriye gider (ekran içinde)
  const perPxZ=9/Math.max(480,innerHeight);
  G.tzo=Math.max(-1.6,Math.min(5,G.tzo-IN.dy*perPxZ+(IN.kz||0)*dt*7));IN.dy=0;
  const oldZo=G.zo;G.zo+=(G.tzo-G.zo)*Math.min(1,dt*16);
  const spd=lv.speed*(G.dash>0?2.6:1);
  G.b+=spd*dt;G.z=G.b+G.zo;
  const bvx=(G.x-oldX)/dt,bvz=spd+(G.zo-oldZo)/dt;
  if(G.shield>0)G.shield-=dt;
  // yetenek zamanlayıcıları
  if(G.cd>0)G.cd-=dt;
  if(G.dash>0)G.dash-=dt;
  if(G.air>0){G.air-=dt;if(G.air<=0){G.air=0;G.jy=0;pop(260);vib(15);G.shield=Math.max(G.shield,.08);}else G.jy=Math.sin(Math.PI*(1-G.air/G.airT))*2.4;}
  if(G.ghost>0){G.ghost-=dt;if(G.ghost<=0){G.ghost=0;ballMat.opacity=1;ballMat.transparent=false;ballMat.depthWrite=true;}else if(G.ghost<.6)ballMat.opacity=.38+.4*((G.ghost*10|0)%2);}
  if(G.regenT&&G.charges<G.maxCh){G.regen+=dt;if(G.regen>=G.regenT){G.regen=0;G.charges++;pop(900);}}
  const br=.5*G.R;
  // hareketli engeller
  for(const o of lv.objs){if(o.mover&&o.alive&&!o.falling&&o.sleepM!==false){o.x=Math.sin(G.time*o.mover.sp+o.mover.ph)*o.mover.amp;o.vx=0;}}
  // aktif pencere
  const z0=G.z-6,z1=G.z+30;
  const act=[];const grid=new Map();
  for(const o of lv.objs){if(!o.alive)continue;if(o.z<z0-20){if(o.z<G.z-25){o.alive=false;o.mesh.visible=false;}continue;}if(o.z>z1)continue;act.push(o);
    if(!o.falling){const k=Math.floor(o.z/CELL);let a=grid.get(k);if(!a){a=[];grid.set(k,a);}a.push(o);}}
  // top - nesne
  // mıknatıs: altınları ve kendi rengindeki şekilleri çeker
  if(G.mR){const R=G.mR;for(const c of lv.coins){if(c.got)continue;const dx=G.x-c.x,dz=G.z-c.z;if(Math.abs(dz)>R||Math.abs(dx)>R)continue;const d=Math.hypot(dx,dz);if(d<R&&d>.01){const sp=Math.min(d,(9+(R-d)*5)*dt);c.x+=dx/d*sp;c.z+=dz/d*sp;c.mesh.position.x=c.x;c.mesh.position.z=c.z;}}
    for(const o of act){if(o.danger||o.falling||o.mover)continue;const dx=G.x-o.x,dz=G.z-o.z;if(Math.abs(dz)>R||Math.abs(dx)>R)continue;const d=Math.hypot(dx,dz);if(d<R&&d>br+o.r){o.vx+=dx/d*6*dt;o.vz+=dz/d*3*dt;}}}
  // top - nesne (havadayken çarpışma yok)
  if(G.air<=0)for(const o of act){if(o.falling)continue;const dx=o.x-G.x,dz=o.z-G.z;const rr=o.r+br;if(Math.abs(dz)>rr||Math.abs(dx)>rr)continue;const d=Math.hypot(dx,dz);if(d<rr&&d>0){
      if(o.danger){if(G.ghost>0)continue;if(G.shield>0){knockOff(o,dx/d,dz/d,9);continue;}
        if(G.charges>0){G.charges--;G.regen=0;G.shield=.9;knockOff(o,dx/d,dz/d,10);toast(t('shieldHit'));snd('hit',.8,.8);vib(60);flash(.35);shakeT=.15;updAbUI(true);continue;}
        die(o);return;}
      const nx=dx/d,nz=dz/d,pen=rr-d;o.x+=nx*pen;o.z+=nz*pen;
      const push=(Math.max(0,bvx*nx+bvz*nz)*1.15+1)*(G.dash>0?1.8:1);o.vx+=nx*push;o.vz+=nz*push;o.spin+=push*.6;if(G.dash>0){o.tb=1;o.vx+=(Math.sign(nx)||1)*4;}
      if(!o.hitSnd){o.hitSnd=true;G.hits=(G.hits||0)+1;if(G.hits%3===0)snd('hit',.35,1+Math.random()*.3);pop(500+Math.random()*400);}}}
  // nesne - nesne
  for(const o of act){if(o.falling)continue;const k=Math.floor(o.z/CELL);for(let kk=k-1;kk<=k+1;kk++){const a=grid.get(kk);if(!a)continue;for(const p of a){if(p===o||p.falling)continue;if(p.id&&o.id&&p.id<o.id)continue;
        const dx=p.x-o.x,dz=p.z-o.z,rr=o.r+p.r;if(Math.abs(dx)>rr||Math.abs(dz)>rr)continue;const d=Math.hypot(dx,dz)||.001;if(d<rr){const nx=dx/d,nz=dz/d,pen=(rr-d)/2;
          const om=o.mover?99:o.danger?1.5:1,pm=p.mover?99:p.danger?1.5:1;const wo=pm/(om+pm),wp=om/(om+pm);
          o.x-=nx*pen*2*wo;o.z-=nz*pen*2*wo;p.x+=nx*pen*2*wp;p.z+=nz*pen*2*wp;
          const rv=(p.vx-o.vx)*nx+(p.vz-o.vz)*nz;if(rv<0){const j=-rv*.9;o.vx-=nx*j*wo;o.vz-=nz*j*wo;p.vx+=nx*j*wp;p.vz+=nz*j*wp;}
          // itilen tehlike nesnesi topa çarpabilir (orijinal davranış)
        }}}}
  // entegrasyon
  const fr=Math.exp(-3.2*dt);
  for(const o of act){
    if(o.falling){o.vy-=28*dt;o.y+=o.vy*dt;o.x+=o.vx*dt;o.z+=o.vz*dt;o.mesh.rotation.x+=o.spin*dt;o.mesh.rotation.z+=o.spin*.7*dt;o.mesh.position.set(o.x,-.5+.5*o.sc+o.y,o.z);if(o.y<-30){o.alive=false;o.mesh.visible=false;}continue;}
    if(o.mover){o.mesh.position.set(o.x,-.5+.5*o.sc,o.z);}
    else{o.x+=o.vx*dt;o.z+=o.vz*dt;o.vx*=fr;o.vz*=fr;if(Math.abs(o.vx)+Math.abs(o.vz)>.3){o.mesh.rotation.y+=o.spin*dt*.5;o.spin*=fr;}o.mesh.position.set(o.x,-.5+.5*o.sc,o.z);}
    if(Math.abs(o.x)>lv.lane+o.r*.2||o.z>lv.len+10){o.falling=true;o.vy=1.5;o.spin=o.spin||4;if(!o.danger){G.pushed++;const cg=1+(o.tb?G.tbB:0);G.coins+=cg;G.cg+=cg;coinPop(o);} }
    o.hitSnd=o.hitSnd&&(Math.abs(o.x-G.x)<o.r+br+.1&&Math.abs(o.z-G.z)<o.r+br+.1);
  }
  // altın
  const cr=.3+br;
  for(const c of lv.coins){if(c.got)continue;c.mesh.rotation.z+=dt*4;if(Math.abs(c.z-G.z)<cr&&Math.abs(c.x-G.x)<cr&&G.jy<1.4){c.got=true;c.mesh.visible=false;G.coins+=3;G.cg+=3;pop(1200);}}
  // kapılar
  for(const gt of lv.gates){if(!gt.passed&&G.z>gt.z){gt.passed=true;mAdd('gate',1);G.color=gt.to;ballMat.color.setHex(C[gt.to]);ballMat.emissive.setHex(C[gt.to]);toast(t('gate'));snd('complete',.4,1.4);vib(25);flash(.25);}}
  // bitiş
  if(G.z>=lv.len-1){win();}
  updHud();
}
function knockOff(o,nx,nz,f){o.vx=nx*f;o.vz=nz*f;o.falling=true;o.vy=4;o.spin=8;}
function coinPop(o){/* küçük +1 baloncuğu */}
function die(o){if(G.st!=='play')return;G.st='dead';G.deadT=0;snd('blowup',.6);vib(120);flash(.8);ball.visible=false;trail.forEach(m=>m.visible=false);
  // parçalar
  for(let i=0;i<26;i++){const m=new THREE.Mesh(GEO.shard,ballMat);m.position.copy(ball.position);world.add(m);const a=Math.random()*6.28,u=Math.random()*1.2;G.shards.push({m,vx:Math.cos(a)*(3+Math.random()*5),vy:3+Math.random()*6,vz:Math.sin(a)*(3+Math.random()*5)+3,r:Math.random()*10});}
  shakeT=.25;const tok=G.tok;setTimeout(()=>{if(G.tok===tok&&G.st==='dead')showFail();},1100);}
function win(){if(G.st!=='play')return;G.st='won';snd('complete',.9);vib(40);
  const ratio=LV.totalPush?G.pushed/LV.totalPush:1;const stars=ratio>=.6?3:ratio>=.35?2:1;G.stars=stars;
  const earned=Math.round((G.coins+50+stars*20)*(1+G.luck));G.earned=earned;S.coins+=earned;S.stars[G.n]=Math.max(S.stars[G.n]||0,stars);if(S.level<=G.n)S.level=G.n+1;
  report();mAdd('win',1);if(stars===3)mAdd('star',1);
  G.xpG=20+stars*10;G.xp0={lv:S.plv,xp:S.xp};G.ups=addXP(G.xpG);save();
  confetti();const tok=G.tok;setTimeout(()=>{if(G.tok===tok)showWin(ratio);},1200);}
let flashT=0,shakeT=0;function flash(a){const f=$('flash');f.style.transition='none';f.style.opacity=a;requestAnimationFrame(()=>{f.style.transition='opacity .45s';f.style.opacity=0;});}
const confs=[];function confetti(){for(let i=0;i<60;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.18,.28),new THREE.MeshBasicMaterial({color:[0xff5fa8,0xffd84a,0x5fe39a,0x6cc6ff,0xb18cff][i%5],side:THREE.DoubleSide}));m.position.set(G.x+(Math.random()-.5)*2,1,G.z+1);world.add(m);confs.push({m,vx:(Math.random()-.5)*8,vy:6+Math.random()*7,vz:(Math.random())*4,r:Math.random()*8});}}
/* ------------------------------ KAMERA & DÖNGÜ ------------------------------ */
function camSnap(){const cz=G.b??G.z;camera.position.set(G.x*.35,10.5,cz-8.2);camera.lookAt(G.x*.25,0,cz+5);}
let last=performance.now();
function loop(now){
  let dt=Math.min(.05,(now-last)/1000);last=now;
  if(LV&&(G.st==='play')){let rem=dt;while(rem>0){const s=Math.min(1/90,rem);step(s);rem-=s;if(G.st!=='play')break;}}
  if(LV&&ball){
    if(G.st==='dead'){G.deadT+=dt;const sdt=dt*(G.deadT>.4?.4:1);for(const s of G.shards){s.vy-=18*sdt;s.m.position.x+=s.vx*sdt;s.m.position.y+=s.vy*sdt;s.m.position.z+=s.vz*sdt;s.m.rotation.x+=s.r*sdt;if(s.m.position.y<-.45&&s.vy<0){s.vy*=-.3;s.vx*=.7;s.vz*=.7;}}}
    const by=(G.R-1)*.5+(G.jy||0);
    ball.position.set(G.x,by,G.z);ball.rotation.x+=LV.speed*dt*(G.st==='play'?2:0)*(G.dash>0?2.5:1);
    if(ball.userData.ring)ball.userData.ring.rotation.z+=dt*2;
    const ud=ball.userData;
    if(ud.bub){ud.bub.visible=G.charges>0&&ball.visible;if(ud.bub.visible)ud.bub.material.opacity=.2+.1*Math.sin(now/180);}
    if(ud.shd){ud.shd.visible=G.jy>.05&&ball.visible;if(ud.shd.visible){const k=G.R*(1-G.jy/4);ud.shd.scale.setScalar(k);ud.shd.position.set(G.x,-.48,G.z);}}
    if(ud.mr){ud.mr.visible=!!G.mR&&ball.visible;if(ud.mr.visible){ud.mr.scale.setScalar(G.mR*(.96+.04*Math.sin(now/250)));ud.mr.position.set(G.x,-.47,G.z);}}
    if(G.st==='play'||G.st==='ready')updAbUI();
    // iz
    if(trail.length){for(let i=trail.length-1;i>0;i--)trail[i].position.copy(trail[i-1].position);trail[0].position.set(G.x,by,G.z-.3*G.R);}
    // kamera
    const cz=G.b??G.z;const tx=G.x*.35,tz=cz-8.2;camera.position.x+=(tx-camera.position.x)*Math.min(1,dt*6);camera.position.z=tz;camera.position.y=10.5;
    let sx=0,sy=0;if(shakeT>0){shakeT-=dt;sx=(Math.random()-.5)*.4;sy=(Math.random()-.5)*.4;}
    camera.position.x+=sx;camera.position.y+=sy;camera.lookAt(G.x*.25,0,cz+5);
    sky.position.copy(camera.position);
    sun.position.set(G.x-6,14,cz-8);sun.target.position.set(G.x,0,cz+4);
    for(let i=0;i<NP;i++){pPos[i*3+1]-=dt*1.5;if(pPos[i*3+1]<-1){pPos[i*3+1]=20;pPos[i*3+2]=G.z+Math.random()*50-5;pPos[i*3]=(Math.random()-.5)*30;}}
    ptsGeo.attributes.position.needsUpdate=true;
    for(const g2 of LV.gates)if(g2.mesh)g2.mesh.children[0].material.opacity=.25+.15*Math.sin(now/200);
    for(const c of confs){c.vy-=12*dt;c.m.position.x+=c.vx*dt;c.m.position.y+=c.vy*dt;c.m.position.z+=c.vz*dt;c.m.rotation.x+=c.r*dt;c.m.rotation.y+=c.r*dt;}
  }else menuSpin(dt,now);
  renderer.render(scene,camera);
  requestAnimationFrame(loop);}
let demo=null;
function menuSpin(dt,now){if(!demo){LV=null;const lv=buildLevel(Math.max(1,S.level));setupScene(lv);demo=lv;}
  const z=(now/1000*4)%(demo.len-20)+4;camera.position.set(Math.sin(now/3000)*2,13,z-9);camera.lookAt(0,0,z+9);sky.position.copy(camera.position);if(ball)ball.position.set(Math.sin(now/700)*demo.lane*.5,0,z);}

/* ------------------------------ EKRANLAR ------------------------------ */
const SCR=['sMenu','sStory','sPause','sWin','sFail','sShop','sDaily','sMis','sChest'];
function show(id){SCR.forEach(s=>$(s).classList.toggle('on',s===id));document.querySelectorAll('.coins').forEach(e=>e.textContent=S.coins);}
function applyLang(){document.querySelectorAll('[data-t]').forEach(e=>e.textContent=t(e.dataset.t));$('playT').textContent=t('play')+' '+S.level;const wi=Math.floor((S.level-1)/12)%5;$('mWorld').textContent=t('w'+wi);updMenu();}
let toastTm;function toast(s){const e=$('toast');e.textContent=s;e.style.opacity=1;clearTimeout(toastTm);toastTm=setTimeout(()=>e.style.opacity=0,1300);}
function goMenu(){LV=null;demo=null;G={st:'menu'};hud(false);applyLang();show('sMenu');}
$('playB').onclick=()=>{audioInit();snd('click',.6);if(!S.storySeen){$('storyT').innerHTML=t('story').replace(/\n/g,'<br>');show('sStory');}else startLevel(S.level);};
$('storyOk').onclick=()=>{S.storySeen=true;save();startLevel(S.level);};
$('pauseB').onclick=()=>{if(G.st==='play'||G.st==='ready'){G.prev=G.st;G.st='pause';show('sPause');}};
$('resB').onclick=()=>{show(null);G.st=G.prev||'play';last=performance.now();};
$('restB').onclick=()=>{report();startLevel(G.n);};
$('homeB').onclick=()=>{report();S.coins+=G.coins||0;save();goMenu();};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.st==='play'){G.prev='play';G.st='pause';show('sPause');}});
addEventListener('adkit:start',()=>{if(G.st==='play'){G.prev='play';G.st='pause';show('sPause');}});
function showWin(ratio){hud(false);$('hint').style.display='none';$('wInfo').textContent=G.pushed+' '+t('pushed')+' ('+Math.round(ratio*100)+'%)';$('wCoins').textContent=G.earned;
  $('wStars').querySelectorAll('span').forEach((s,i)=>{s.className='';if(i<G.stars)setTimeout(()=>{s.className='on';pop(700+i*250);},300+i*280);});
  const tb=$('wTriple');tb.disabled=false;tb.style.display=AdKit.left()>0?'inline-flex':'none';G.tripled=false;
  const need=xpNeed(S.plv);$('wLvB').textContent=t('lvS')+' '+S.plv;$('wXpI').style.width=Math.min(100,S.xp/need*100)+'%';$('wXpT').textContent='+'+G.xpG+' XP';
  const up=G.ups||[];$('wLvUp').textContent=up.length?t('lvUp').replace('{n}',up[up.length-1].lv).replace('{c}',up.reduce((a,u)=>a+u.c,0)):'';$('wLvUp').style.display=up.length?'block':'none';
  $('wChest').style.display=S.chests>0?'inline-flex':'none';if(up.length)setTimeout(()=>snd('complete',.5,1.25),1300);
  show('sWin');
  const wDone=G.n%12===0;if(wDone)setTimeout(()=>toast(t('w'+((G.n/12-1)%5))+' '+t('worldDone')),900);}
$('wTriple').onclick=()=>{if(G.tripled)return;AdKit.rewarded('triple').then(ok=>{if(ok){G.tripled=true;S.coins+=G.earned*2;save();$('wCoins').textContent=G.earned*3;$('wTriple').disabled=true;snd('cash',.6);}});};
$('wNext').onclick=()=>{snd('click',.6);AdKit.levelDone({reward:'+80 🪙'}).then(ok=>{if(ok){S.coins+=80;save();}startLevel(S.level);});};
function showFail(){hud(false);$('hint').style.display='none';report();S.coins+=G.coins;save();G.coins=0;$('fInfo').textContent=Math.round(Math.min(1,G.z/LV.len)*100)+'%';
  $('fRevive').style.display=!G.revived&&AdKit.left()>0?'inline-flex':'none';show('sFail');}
$('fRevive').onclick=()=>{AdKit.rewarded('revive').then(ok=>{if(ok)revive();});};
function revive(){G.revived=true;G.st='play';G.shield=2.5;G.air=0;G.jy=0;G.dash=0;if(G.ghost>0){G.ghost=0;ballMat.opacity=1;ballMat.transparent=false;ballMat.depthWrite=true;}ball.visible=true;trail.forEach(m=>m.visible=true);for(const s of G.shards)world.remove(s.m);G.shards=[];
  // yakındaki tehlikeleri temizle
  for(const o of LV.objs)if(o.alive&&o.danger&&!o.falling&&o.z>G.z-1&&o.z<G.z+6)knockOff(o,Math.sign(o.x-G.x)||1,.3,6);
  show(null);hud(true);last=performance.now();}
$('fRetry').onclick=()=>{const n=G.n;AdKit.breakpoint().then(()=>startLevel(n));};
$('fHome').onclick=()=>AdKit.breakpoint().then(goMenu);
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{snd('click',.5);show('sMenu');applyLang();});
$('shopB').onclick=()=>{audioInit();snd('click',.5);openShop();};
$('dailyB').onclick=()=>{audioInit();snd('click',.5);openDaily();};
$('sndB').onclick=()=>{S.sound=!S.sound;save();$('sndB').textContent=S.sound?'🔊':'🔇';audioInit();if(master)master.gain.value=S.sound?1:0;};
$('vibB').onclick=()=>{S.vib=!S.vib;save();$('vibB').style.opacity=S.vib?1:.4;vib(30);};
$('langB').onclick=()=>{const ls=['tr','en','es','pt'];lang=ls[(ls.indexOf(lang)+1)%4];S.lang=lang;save();applyLang();if($('sShop').classList.contains('on'))openShop(true);if($('sMis').classList.contains('on'))openMis();toast(t('lang'));};
function ballCss(b){if(b.c==='rainbow')return 'conic-gradient(#f33,#fd3,#3e6,#39f,#b6f,#f33)';const c=b.c==null?'#00CFE8':'#'+b.c.toString(16).padStart(6,'0');return 'radial-gradient(circle at 35% 30%,#fff8,'+c+' 45%)';}
const CI='<i class="coin" style="width:15px;height:15px"></i>';
function openShop(keep){const box=$('skins'),sc=box.scrollTop;let h='';
  BALLS.forEach(b=>{const lv=ballLv(b),own=lv>0,sel=S.ball===b.id;
    let pips='';if(b.ab)for(let i=1;i<=5;i++)pips+='<i'+(i<=lv?' class="on"':'')+'></i>';
    let st='';if(b.ab){st=statTxt(b,Math.max(1,lv));if(own&&lv<5)st+=' <span class="nx">➜ '+statTxt(b,lv+1)+'</span>';}
    let btn='';
    if(!own){if(b.ad)btn+='<button class="btn ghost xs" data-a="ad">▶ '+t('adOpen')+' '+(S.adU[b.id]||0)+'/'+b.ad+'</button>';btn+='<button class="btn y xs" data-a="buy">'+CI+' '+b.p+'</button>';}
    else{if(b.ab&&lv<5)btn+='<button class="btn xs" data-a="up">⬆ '+t('upgrade')+' '+CI+' '+upCost(b,lv)+'</button>';else if(b.ab)btn+='<span class="tag mx">'+t('max')+'</span>';
      btn+=sel?'<span class="tag sel">✓ '+t('inUse')+'</span>':'<button class="btn g xs" data-a="use">'+t('use')+'</button>';}
    h+='<div class="bc'+(sel?' sel':'')+(own?'':' lock')+'" data-id="'+b.id+'"><div class="bt"><div class="bv" style="background:'+ballCss(b)+'"><span>'+(own?b.ic:'🔒')+'</span></div><div class="bm"><div class="bn">'+t('b_'+b.id)+(b.ab?'<span class="pips">'+pips+'</span>':'')+'</div><div class="bd">'+t(b.ab?'d_'+b.ab:'d_none')+'</div>'+(st?'<div class="bs">'+st+'</div>':'')+'</div></div><div class="bb">'+btn+'</div></div>';});
  box.innerHTML=h;
  box.querySelectorAll('.bc button').forEach(e=>e.onclick=ev=>{ev.stopPropagation();shopAct(e.closest('.bc').dataset.id,e.dataset.a);});
  const td=today();if(S.adC.d!==td)S.adC={d:td,n:0};$('freeCoins').disabled=S.adC.n>=5;
  $('freeCoins').onclick=()=>AdKit.rewarded('shop').then(ok=>{if(ok){S.coins+=150;S.adC.n++;save();snd('cash',.6);}openShop(true);});
  show('sShop');box.scrollTop=keep?sc:0;}
function shopAct(id,a){const b=BID[id];if(!b)return;const lv=ballLv(b),nm=t('b_'+id);
  if(a==='use'){if(!lv)return;S.ball=id;save();snd('click',.5);}
  else if(a==='buy'){if(lv)return;if(S.coins<b.p){toast(t('need'));snd('hit',.4,.6);return;}S.coins-=b.p;S.bl[id]=1;S.ball=id;save();snd('cash',.6);vib(30);toast(t('unlocked').replace('{b}',nm));}
  else if(a==='up'){if(!lv||lv>=5||!b.ab)return;const c=upCost(b,lv);if(S.coins<c){toast(t('need'));snd('hit',.4,.6);return;}S.coins-=c;S.bl[id]=lv+1;save();snd('cash',.6);vib(30);toast(t('upgraded').replace('{b}',nm));}
  else if(a==='ad'){if(lv||!b.ad)return;AdKit.rewarded('ball').then(ok=>{if(ok&&!ballLv(b)){S.adU[id]=(S.adU[id]||0)+1;if(S.adU[id]>=b.ad){S.bl[id]=1;S.ball=id;toast(t('unlocked').replace('{b}',nm));}save();snd('cash',.6);}openShop(true);});return;}
  openShop(true);}
/* ------------------------------ GÖREVLER ------------------------------ */
const MT={push:[120,200,300],win:[2,3,5],coin:[80,150,250],ab:[6,10,15],star:[1,2,3],gate:[3,5,8]};const MR=[60,100,150];
function today(){return new Date().toDateString();}
function hashS(s){let h=7;for(const ch of s)h=(h*31+ch.charCodeAt(0))%233280;return h;}
function genMissions(){const td=today();if(S.ms.d===td&&S.ms.list.length)return;const R=rng(hashS(td));
  const pool=['push','win','coin','star','gate'];if(BALLS.some(b=>b.act&&ballLv(b)))pool.push('ab');
  const list=[];while(list.length<3&&pool.length){const k=pool.splice(Math.floor(R()*pool.length),1)[0];const tier=Math.min(2,Math.floor(R()*2)+(S.plv>=6?1:0));list.push({k,n:MT[k][tier],r:MR[tier],p:0,c:0});}
  S.ms={d:td,list};save();}
function mAdd(k,v){if(!(v>0))return;genMissions();let ch=false;for(const m of S.ms.list)if(m.k===k&&!m.c&&m.p<m.n){m.p=Math.min(m.n,m.p+v);ch=true;}if(ch)save();}
function mClaimable(){genMissions();return S.ms.list.filter(m=>!m.c&&m.p>=m.n).length;}
function report(){if(!G||!G.n||!LV)return;mAdd('push',G.pushed-(G.rp||0));G.rp=G.pushed;mAdd('coin',G.cg-(G.rc||0));G.rc=G.cg;}
function timeLeft(){const n=new Date(),m=new Date(n);m.setHours(24,0,0,0);const s=(m-n)/1000|0;return Math.floor(s/3600)+' '+t('hh')+' '+Math.floor(s%3600/60)+' '+t('mm');}
const MIC={push:'🟦',win:'🏁',coin:'🪙',ab:'⚡',star:'⭐',gate:'🌈'};
function openMis(){genMissions();let h='';
  S.ms.list.forEach((m,i)=>{const done=m.p>=m.n;h+='<div class="mc'+(m.c?' got':done?' done':'')+'"><div class="mi">'+MIC[m.k]+'</div><div class="mm"><div class="mt">'+t('m_'+m.k).replace('{n}',m.n)+'</div><div class="mr"><div class="b"><i style="width:'+Math.round(m.p/m.n*100)+'%"></i></div><span>'+m.p+'/'+m.n+'</span></div><div class="mw">'+CI+' '+m.r+'  ·  +15 XP</div></div>'+(m.c?'<span class="tag sel">✓</span>':'<button class="btn g xs" data-i="'+i+'"'+(done?'':' disabled')+'>'+t('claim')+'</button>')+'</div>';});
  $('mList').innerHTML=h;
  $('mList').querySelectorAll('button').forEach(e=>e.onclick=()=>{const m=S.ms.list[+e.dataset.i];if(!m||m.c||m.p<m.n)return;m.c=1;S.coins+=m.r;const ups=addXP(15);save();snd('cash',.6);vib(30);lvToasts(ups);openMis();});
  $('mMsg').textContent=S.ms.list.every(m=>m.c)?t('allDone'):t('mNew')+': '+timeLeft();
  show('sMis');}
/* ------------------------------ OYUNCU SEVİYESİ & SANDIK ------------------------------ */
const xpNeed=l=>80+l*40;
function addXP(n){const ups=[];S.xp+=n;while(S.xp>=xpNeed(S.plv)){S.xp-=xpNeed(S.plv);S.plv++;const c=40+S.plv*10;S.coins+=c;let ch=false;if(S.plv%3===0){S.chests++;ch=true;}ups.push({lv:S.plv,c,ch});}return ups;}
function lvToasts(ups){ups.forEach((u,i)=>setTimeout(()=>{toast(t('lvUp').replace('{n}',u.lv).replace('{c}',u.c)+(u.ch?' 🎁':''));snd('complete',.5,1.25);document.querySelectorAll('.coins').forEach(e=>e.textContent=S.coins);},i*1500));}
function rollChest(){if(S.chests<=0)return '';S.chests--;const r=Math.random();
  const ups=BALLS.filter(b=>b.ab&&ballLv(b)>0&&ballLv(b)<5),locked=BALLS.filter(b=>!ballLv(b)&&b.p<=2400);let msg;
  if(r<.1&&locked.length){const b=locked[0];S.bl[b.id]=1;msg=t('chestBall').replace('{b}',t('b_'+b.id));}
  else if(r<.5&&ups.length){const b=ups[Math.random()*ups.length|0];S.bl[b.id]++;msg=t('chestUp').replace('{b}',t('b_'+b.id))+' ('+t('lvS')+' '+S.bl[b.id]+')';}
  else{const n=Math.round((150+S.plv*25+Math.random()*150)/10)*10;S.coins+=n;msg=t('chestCoins').replace('{n}',n);}
  save();return msg;}
let chestRet='sMenu';
function openChest(ret){chestRet=ret||'sMenu';const bx=$('chBox');bx.classList.remove('open');$('chMsg').textContent=t('tapOpen');$('chOk').style.visibility='hidden';
  bx.onclick=()=>{if(bx.classList.contains('open')||S.chests<=0)return;const m=rollChest();bx.classList.add('open');snd('cash',.7);vib(60);flash(.4);$('chMsg').textContent=m;$('chOk').style.visibility='visible';document.querySelectorAll('.coins').forEach(e=>e.textContent=S.coins);};
  show('sChest');}
$('chOk').onclick=()=>{snd('click',.5);if(S.chests>0)return openChest(chestRet);if(chestRet==='sWin'){$('wChest').style.display='none';show('sWin');}else{show('sMenu');applyLang();}};
$('chestB').onclick=()=>{audioInit();snd('click',.5);openChest('sMenu');};
$('wChest').onclick=()=>{snd('click',.5);openChest('sWin');};
$('misB').onclick=()=>{audioInit();snd('click',.5);openMis();};
function dailyCan(){return S.daily.last!==today();}
function updMenu(){if(!$('mLv'))return;const need=xpNeed(S.plv);$('mLv').textContent=t('lvS')+' '+S.plv;$('mXp').style.width=Math.min(100,S.xp/need*100)+'%';$('mXpT').textContent=S.xp+'/'+need+' XP';
  $('chestB').style.display=S.chests>0?'inline-flex':'none';$('chestN').textContent=S.chests>1?'×'+S.chests:'';
  const mc=mClaimable();$('misBd').textContent=mc||'';$('misBd').style.display=mc?'flex':'none';
  const dc=dailyCan();$('dBd').textContent='!';$('dBd').style.display=dc?'flex':'none';}
const DAILY=[60,80,100,120,150,200,400];
function openDaily(){const td=new Date().toDateString(),yd=new Date(Date.now()-864e5).toDateString();let st=S.daily.streak;if(S.daily.last!==td&&S.daily.last!==yd)st=0;const can=S.daily.last!==td;const idx=can?st%7:(st-1+7)%7;
  $('dGrid').innerHTML=DAILY.map((v,i)=>'<div class="'+(i<idx||(!can&&i===idx)?'got':'')+(can&&i===idx?' now':'')+'">'+t('dayN')+' '+(i+1)+'<br><b>'+v+'</b></div>').join('');
  $('dMsg').textContent=can?t('streak')+': '+st:t('claimed');$('dClaim').disabled=!can;
  $('dClaim').onclick=()=>{if(!can)return;S.coins+=DAILY[idx];S.daily={last:td,streak:st+1,ad:S.daily.ad};save();snd('cash',.6);openDaily();};
  const ab=$('dAd');ab.style.display=can?'none':'inline-flex';ab.disabled=S.daily.ad===td;ab.onclick=()=>AdKit.rewarded('daily').then(ok=>{if(ok){S.coins+=120;S.daily.ad=td;save();snd('cash',.6);}openDaily();});
  show('sDaily');}
document.addEventListener('pointerdown',()=>{audioInit();if(AC&&AC.state==='suspended')AC.resume();},{passive:true});
$('sndB').textContent=S.sound?'🔊':'🔇';$('vibB').style.opacity=S.vib?1:.4;
applyLang();show('sMenu');requestAnimationFrame(t=>{last=t;loop(t);});
window.__twos={get G(){return G;},get LV(){return LV;},S,startLevel,IN,useAb,BALLS,openShop,openMis,openChest,genMissions,mAdd,addXP,save,curBall,xpNeed,shopAct};
})();

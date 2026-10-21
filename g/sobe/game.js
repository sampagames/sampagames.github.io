/* =====================================================================
   SOBE: KAYIP FENER v3 — Sampa Games
   Orijinal SOBE (Unity) projesinin karakter, düşman, zemin, arka plan,
   müzik ve ses dosyalarıyla HTML5 olarak baştan yazıldı.
   6 dünya (Bahar, Yaz, Sonbahar, Buzul Çağı, Mağaralar, Kemik Kale), 30 bölüm.
   ===================================================================== */
'use strict';
(function(){
const TS=64;                 // karo boyutu (mantıksal piksel)
const VIEW_H=TS*9;           // ekranda görünen yükseklik (9 karo)
const SAVE_KEY='sobe3-save';
const STEP=1/120;            // sabit fizik adımı

/* ------------------------------ FİZİK ------------------------------
   Tüm değerler piksel ve saniye. Bölüm üreticisinin doğrulayıcısı da
   (genlevels3.py) aynı değerleri kullanır. */
const PH={
  pw:30,ph:64,                         // oyuncu kutusu
  run:330,accG:5200,decG:6400,         // yerde: hızlanma / durma
  accA:3200,decA:1400,turnA:5200,      // havada
  iceRun:360,iceAcc:1500,iceDec:650,iceTurn:2100, // buzda
  jump:880,jump2:760,                  // zıplama, ikinci zıplama
  gUp:2400,gDown:3300,maxFall:1250,cut:.45,
  coyote:.1,buffer:.14,
  dashV:800,dashT:.15,
  spring:1380,stomp:660,
  climb:240
};

/* ------------------------------ DÜNYALAR ------------------------------ */
// tiles: hangi karo setinin kullanılacağı; tint: o setin renk filtresi
const WORLDS=[
 {id:'spring',tiles:'forest',bg:'forest',tint:'none',bgTint:'none',sky:['#8fd3ff','#e8f8ff'],music:'forest',weather:'petal',boss:'bigboar',light:1,
  fill:['#0d2b24','#1c6150','#2aa598','#33d1dd','#a6e7ff'],deco:['plant_1','plant_2','plant_3','sign','fence_1','scarecrow']},
 {id:'summer',tiles:'forest',bg:'forest',tint:'saturate(1.3) brightness(1.07)',bgTint:['hue-rotate(-62deg) saturate(1.35) brightness(1.08)','hue-rotate(-62deg) saturate(1.35) brightness(1.1)','hue-rotate(-58deg) saturate(1.3) brightness(1.12)','hue-rotate(-30deg) saturate(.9) brightness(1.1)','sepia(.35) saturate(1.5) hue-rotate(-8deg) brightness(1.1)'],sky:['#57c2f2','#ffe9b8'],music:'forest',weather:'sun',boss:'slimeking',springs:true,light:1,
  fill:['#2e3a14','#556b1f','#8a9a2e','#c9c55a','#ffe9b8'],deco:['plant_2','hay','fence_2','cart_1','scarecrow','plant_4']},
 {id:'autumn',tiles:'forest',bg:'forest',tint:'sepia(.55) saturate(1.5) hue-rotate(-14deg) brightness(.97)',bgTint:['hue-rotate(-148deg) saturate(1.5) brightness(.9)','hue-rotate(-140deg) saturate(1.6) brightness(1)','hue-rotate(-132deg) saturate(1.4) brightness(1.05)','sepia(.8) saturate(1.2) hue-rotate(-12deg) brightness(.95)','sepia(.7) saturate(1.8) hue-rotate(-22deg) brightness(1.05)'],sky:['#e8875e','#ffd9a2'],music:'forest',weather:'leaf',boss:'goblinchief',wind:true,light:1,
  fill:['#3a1a0e','#6b2f17','#a24a21','#d77a35','#ffd9a2'],deco:['hay','logs_1','sign_2','fence_1','barrel','plant_3']},
 {id:'ice',tiles:'snow',bg:'snow',tint:'none',bgTint:'none',sky:['#9fbde6','#e9f2ff'],music:'snow',weather:'snow',boss:'frostqueen',ice:true,blizzard:true,light:1,
  fill:['#4c6a9a','#6f8fbf','#9bb6dd','#c3d6ef','#e3edf9'],deco:['snowman','plant_4','sign_2','tent','fence_2','skull']},
 {id:'cave',tiles:'cave',bg:'cave',tint:'none',bgTint:'none',sky:['#140b10','#2a1720'],music:'cave',weather:'drip',boss:'spiderqueen',dark:.76,light:1,
  fill:['#1b1018','#2a1824','#3a2430','#4a3040','#5a3a4c'],deco:['skull','web_1','barrel','torch','box_2','mine']},
 {id:'castle',tiles:'cave',bg:'cave',tint:'grayscale(1) sepia(.3) hue-rotate(235deg) saturate(1.8) brightness(.9)',bgTint:'grayscale(1) sepia(.5) hue-rotate(240deg) saturate(2.4) brightness(.7)',sky:['#0c0a18','#251b38'],music:'cave',weather:'ember',boss:'boneking',dark:.6,light:1,
  fill:['#100c1c','#1b1530','#261d40','#33284f','#40335e'],deco:['skull','web_2','barrel','box_1','iron_crate','spider_den']}
];
const BGL={forest:['bg_forest_1','bg_forest_2','bg_forest_3','bg_forest_4','bg_forest_5'],cave:['bg_cave_1','bg_cave_2','bg_cave_3','bg_cave_4','bg_cave_5'],snow:['bg_snow_1','bg_snow_2','bg_snow_3','bg_snow_4','bg_snow_5']};

/* ------------------------------ GELİŞİM ------------------------------ */
const WPN={ // 10 seviye; görünüm aşaması: 3,5,7,10. seviyede değişir
 sword:{dmg:[1,1,2,2,2,3,3,4,4,5],reach:[80,86,92,98,104,110,116,122,128,138],cd:[.36,.35,.34,.33,.32,.31,.3,.29,.28,.26],cost:[150,250,400,600,850,1150,1500,2000,2700]},
 bow:{cap:[10,12,14,16,18,20,22,24,26,30],dmg:[1,1,1,2,2,2,3,3,3,4],pierce:[0,0,0,0,1,1,1,1,1,1],triple:[0,0,0,0,0,0,0,1,1,1],cost:[150,250,400,600,850,1150,1500,2000,2700]},
 spear:{cap:[3,3,4,4,5,5,6,6,7,8],dmg:[2,2,3,3,4,4,5,5,6,7],cost:[200,320,500,750,1000,1350,1750,2300,3000]},
 dash:{cd:[.9,.84,.78,.72,.66,.6,.55,.5,.45,.4],hit:[0,0,1,1,1,2,2,2,3,3],cost:[150,250,400,600,850,1150,1500,2000,2700]}
};
const WMAX=10;
const wtier=l=>l>=10?4:l>=7?3:l>=5?2:l>=3?1:0;           // parıltı aşaması
const TIERC=['#ffffff','#bfe8ff','#4fd2ff','#c77dff','#ffc93a']; // aşama renkleri
const UPG={heart:[400,900,1800],magnet:[250,600,1200]};
// Kostümler: her birinin görünür bir aksesuarı ve 3 seviyeli gerçek bir avantajı var
const COSTUMES=[
 {id:'classic',f:null,price:0,acc:null,st:{}},
 {id:'forest',f:'hue-rotate(78deg) saturate(1.15)',price:600,acc:'leaves',st:{spd:[.08,.11,.14],magnet:[120,180,240]}},
 {id:'frost',f:'hue-rotate(165deg) saturate(1.25) brightness(1.08)',price:1000,acc:'ice',st:{grip:[1,1,1],jump:[.05,.08,.11]}},
 {id:'wind',f:'hue-rotate(120deg) saturate(.9) brightness(1.15)',price:1400,acc:'scarf',st:{spd:[.15,.19,.24],dashcd:[.15,.2,.28]}},
 {id:'wolf',f:'grayscale(1) brightness(1.45) contrast(.9)',price:1800,acc:'ears',st:{jump:[.12,.16,.21]}},
 {id:'night',f:'hue-rotate(232deg) saturate(1.1) brightness(.85)',price:2200,acc:'horns',st:{sight:[160,230,320],dashcd:[.25,.33,.42]}},
 {id:'crimson',f:'hue-rotate(-22deg) saturate(1.7) brightness(.95)',price:2800,acc:'plume',st:{dmg:[1,1,2],stomp:[1,1,2]}},
 {id:'gold',f:'sepia(.7) saturate(2.6) hue-rotate(2deg) brightness(1.18)',price:4000,acc:'crown',st:{gold:[.25,.35,.5],heart:[1,1,2]}}
];
const cupCost=c=>[Math.round(c.price*.6/10)*10,Math.round(c.price*1.2/10)*10];

/* ------------------------------ DİL ------------------------------ */
const L={
tr:{sub:'KAYIP FENER',play:'OYNA',shop:'Dükkân',daily:'Günlük',story:'Hikâye',next:'Devam',skip:'Geç',paused:'Mola',resume:'Devam et',restart:'Baştan başla',quit:'Haritaya dön',double:'Altınları 2 katına çıkar',menu:'Harita',retry:'Tekrar',dailyT:'Günlük Hediye',close:'Kapat',claim:'Al',dailyAd:'Reklamla +80',
 w_spring:'Bahar Ormanı',w_summer:'Yaz Tepeleri',w_autumn:'Sonbahar Vadisi',w_ice:'Buzul Çağı',w_cave:'Kemik Mağaraları',w_castle:'Kemik Kale',
 wx_spring:'Ormanın ilk ışığı',wx_summer:'Zıplatan mantarlar',wx_autumn:'Sert rüzgârlar',wx_ice:'Kaygan buz, tipi',wx_cave:'Zifiri karanlık',wx_castle:'Tuzaklar ve iskeletler',
 locked:'Önce önceki bölümü bitir',win:'FENER YANDI!',fail:'SOBE YENİLDİ',lvl:'Bölüm',
 revT:'Pes etme Sobe!',revX:'Kontrol noktasından tam canla devam et.',revPotion:'İksir kullan',revAd:'Reklam izle',giveup:'Vazgeç',
 sword:'Kılıç',bow:'Yay',spear:'Mızrak',dash:'Atılma',
 gotSword:'KILIÇ BULDUN!',gotSwordX:'⚔ tuşuyla saldır. Düşmanların üstüne zıplamak da işe yarar.',gotBow:'YAY BULDUN!',gotBowX:'Uzaktan ok at. Okların sınırlı: ok demetlerini topla. ⇄ ile silah değiştir.',gotSpear:'MIZRAK BULDUN!',gotSpearX:'Mızrak düşmanların içinden geçer ve kalkanları deler!',
 keyGot:'Anahtar alındı! Kilitli kapıyı aç.',needKey:'Bu kapı kilitli. Anahtarı bul!',checkpoint:'Kontrol noktası',chickGot:'Civciv kurtarıldı!',lanternLocked:'Önce canavarı yen!',
 tabW:'Silahlar',tabC:'Kostümler',tabI:'Eşyalar',lv:'Sv.',upgrade:'Geliştir',buy:'Satın al',use:'Giy',inUse:'Giyili',needFind:'Önce bölümlerde bul',
 d_sword:'Hasar, menzil ve hız artar. Her aşamada daha çok parlar',d_bow:'Daha çok ok; 3. sv. çift hasar, 4. sv. delici ok, 5. sv. üçlü atış',d_spear:'Daha çok mızrak ve daha çok hasar',d_dash:'Daha sık atıl; 3. sv.den itibaren atılırken düşmana vur',
 u_heart:'Ekstra kalp',u_heartX:'Maksimum can +1',u_magnet:'Altın mıknatısı',u_magnetX:'Altınları uzaktan çeker',
 potion:'Hayat iksiri',potionX:'Yenilince kaldığın yerden devam et',owned:'Elinde',freeG:'Ücretsiz altın',freeGX:'Reklam izle, 100 altın kazan',max:'MAKS',
 c_classic:'Klasik Pelerin',c_forest:'Orman Avcısı',c_frost:'Buz Gezgini',c_night:'Gece Gölgesi',c_crimson:'Kızıl Savaşçı',c_snow:'Kar Kurdu',c_gold:'Altın Kahraman',
 p_none:'Sobe\'nin ilk pelerini',p_magnet:'Altınları uzaktan çeker',p_grip:'Buzda hiç kaymaz',p_sight:'Karanlıkta daha geniş görür',p_stomp:'Üstten zıplama 2 hasar verir',p_dash:'Atılma daha sık dolar',p_gold:'Her altın %25 fazla',
 coins:'altın',time:'Süre',chicksL:'civciv',bossDead:'Canavar yenildi! Fenere koş!',wind:'RÜZGÂR',
 dayN:'Gün',claimed:'Bugünün hediyesi alındı. Yarın gel!',streak:'Seri',rot:'Daha iyi oynamak için telefonu yan çevir',langName:'Türkçe',
 tut:'◀ ▶ ile yürü, ⤒ ile zıpla. Havadayken bir kez daha zıplayabilirsin.\nDüşmanların üstüne zıplayarak onları yen. Civcivleri kurtar ve bölüm sonundaki feneri yak!',
 tutDash:'YENİ: ⇢ tuşuyla ileri atıl! Atılırken hasar almazsın, uzun boşlukları da geçersin.',
 tutSpring:'Kırmızı mantarlara bas: seni gökyüzüne fırlatırlar!',tutWind:'Rüzgâr esince seni iter. Ok işaretine dikkat et!',tutIce:'Buz kaygandır: erken fren yap. Tavandaki sarkıtlardan kaç!',tutDark:'Karanlıkta meşaleler ve kamp ateşleri yolunu aydınlatır.',tutCastle:'Kalede arbaletler ateş eder ve bazı tahtalar çöker. Hızlı ol!',cLv:'Kostüm Sv.',st_spd:'Hız',st_jump:'Zıplama',st_magnet:'Mıknatıs',st_grip:'Buzda kaymaz',st_dashcd:'Atılma dolumu',st_sight:'Karanlıkta görüş',st_dmg:'Hasar',st_stomp:'Ezme hasarı',st_gold:'Altın',st_heart:'Kalp',tierN:'aşamasında parlar',nextLv:'Sonraki',power:'Güç',dmgL:'Hasar',reachL:'Menzil',capL:'Mermi',cdL:'Bekleme',c_wind:'Rüzgâr Ruhu',c_wolf:'Kar Kurdu'},
en:{sub:'THE LOST LANTERN',play:'PLAY',shop:'Shop',daily:'Daily',story:'Story',next:'Next',skip:'Skip',paused:'Paused',resume:'Resume',restart:'Restart',quit:'Back to map',double:'Double the gold',menu:'Map',retry:'Retry',dailyT:'Daily Gift',close:'Close',claim:'Claim',dailyAd:'+80 with an ad',
 w_spring:'Spring Forest',w_summer:'Summer Hills',w_autumn:'Autumn Valley',w_ice:'Ice Age',w_cave:'Bone Caves',w_castle:'Bone Castle',
 wx_spring:'The forest\'s first light',wx_summer:'Bouncy mushrooms',wx_autumn:'Strong winds',wx_ice:'Slippery ice, blizzards',wx_cave:'Pitch darkness',wx_castle:'Traps and skeletons',
 locked:'Finish the previous level first',win:'LANTERN LIT!',fail:'SOBE FELL',lvl:'Level',
 revT:'Don\'t give up, Sobe!',revX:'Continue from your checkpoint with full health.',revPotion:'Use potion',revAd:'Watch ad',giveup:'Give up',
 sword:'Sword',bow:'Bow',spear:'Spear',dash:'Dash',
 gotSword:'YOU FOUND A SWORD!',gotSwordX:'Attack with ⚔. Jumping on enemies still works too.',gotBow:'YOU FOUND A BOW!',gotBowX:'Shoot from afar. Arrows are limited: collect quivers. Switch weapons with ⇄.',gotSpear:'YOU FOUND A SPEAR!',gotSpearX:'Spears fly through enemies and pierce shields!',
 keyGot:'Key collected! Open the locked gate.',needKey:'This gate is locked. Find the key!',checkpoint:'Checkpoint',chickGot:'Chick rescued!',lanternLocked:'Defeat the monster first!',
 tabW:'Weapons',tabC:'Costumes',tabI:'Items',lv:'Lv.',upgrade:'Upgrade',buy:'Buy',use:'Wear',inUse:'Wearing',needFind:'Find it in the levels first',
 d_sword:'More damage, reach and speed',d_bow:'More arrows; lv3 double damage, lv4 piercing, lv5 triple shot',d_spear:'More spears and more damage',d_dash:'Dash more often; from lv3 dashing hits enemies',
 u_heart:'Extra heart',u_heartX:'Max health +1',u_magnet:'Gold magnet',u_magnetX:'Pulls gold from afar',
 potion:'Life potion',potionX:'Continue where you fell',owned:'Owned',freeG:'Free gold',freeGX:'Watch an ad, get 100 gold',max:'MAX',
 c_classic:'Classic Cloak',c_forest:'Forest Hunter',c_frost:'Frost Walker',c_night:'Night Shadow',c_crimson:'Crimson Warrior',c_snow:'Snow Wolf',c_gold:'Golden Hero',
 p_none:'Sobe\'s very first cloak',p_magnet:'Pulls gold from afar',p_grip:'Never slips on ice',p_sight:'Sees further in the dark',p_stomp:'Stomps deal 2 damage',p_dash:'Dash recharges faster',p_gold:'+25% gold',
 coins:'gold',time:'Time',chicksL:'chicks',bossDead:'Monster defeated! Run to the lantern!',wind:'WIND',
 dayN:'Day',claimed:'Today\'s gift claimed. Come back tomorrow!',streak:'Streak',rot:'Turn your phone sideways to play',langName:'English',
 tut:'Walk with ◀ ▶ and jump with ⤒. You can jump once more in the air.\nJump on enemies to defeat them. Rescue the chicks and light the lantern at the end!',
 tutDash:'NEW: dash forward with ⇢! You can\'t be hurt while dashing and you cross long gaps.',
 tutSpring:'Step on red mushrooms: they launch you into the sky!',tutWind:'Gusts push you around. Watch the arrow!',tutIce:'Ice is slippery: brake early. Beware of falling icicles!',tutDark:'In the dark, torches and campfires light your way.',tutCastle:'Crossbows fire in the castle and some planks collapse. Be quick!',cLv:'Costume Lv.',st_spd:'Speed',st_jump:'Jump',st_magnet:'Magnet',st_grip:'No slip on ice',st_dashcd:'Dash recharge',st_sight:'Dark vision',st_dmg:'Damage',st_stomp:'Stomp damage',st_gold:'Gold',st_heart:'Hearts',tierN:'glow stage',nextLv:'Next',power:'Power',dmgL:'Damage',reachL:'Reach',capL:'Ammo',cdL:'Cooldown',c_wind:'Wind Spirit',c_wolf:'Snow Wolf'},
es:{sub:'EL FAROL PERDIDO',play:'JUGAR',shop:'Tienda',daily:'Diario',story:'Historia',next:'Seguir',skip:'Saltar',paused:'Pausa',resume:'Seguir',restart:'Reiniciar',quit:'Al mapa',double:'Duplicar oro',menu:'Mapa',retry:'Reintentar',dailyT:'Regalo diario',close:'Cerrar',claim:'Tomar',dailyAd:'+80 con anuncio',
 w_spring:'Bosque de Primavera',w_summer:'Colinas de Verano',w_autumn:'Valle de Otoño',w_ice:'Edad de Hielo',w_cave:'Cuevas de Hueso',w_castle:'Castillo de Hueso',
 wx_spring:'La primera luz del bosque',wx_summer:'Hongos saltarines',wx_autumn:'Vientos fuertes',wx_ice:'Hielo y ventiscas',wx_cave:'Oscuridad total',wx_castle:'Trampas y esqueletos',
 locked:'Termina el nivel anterior',win:'¡FAROL ENCENDIDO!',fail:'SOBE CAYÓ',lvl:'Nivel',
 revT:'¡No te rindas, Sobe!',revX:'Sigue desde el punto de control con toda la vida.',revPotion:'Usar poción',revAd:'Ver anuncio',giveup:'Rendirse',
 sword:'Espada',bow:'Arco',spear:'Lanza',dash:'Impulso',
 gotSword:'¡ENCONTRASTE UNA ESPADA!',gotSwordX:'Ataca con ⚔. Saltar sobre enemigos también sirve.',gotBow:'¡ENCONTRASTE UN ARCO!',gotBowX:'Dispara de lejos. Las flechas son limitadas. Cambia de arma con ⇄.',gotSpear:'¡ENCONTRASTE UNA LANZA!',gotSpearX:'¡Atraviesa enemigos y escudos!',
 keyGot:'¡Llave! Abre la puerta.',needKey:'Puerta cerrada. ¡Busca la llave!',checkpoint:'Punto de control',chickGot:'¡Pollito rescatado!',lanternLocked:'¡Primero vence al monstruo!',
 tabW:'Armas',tabC:'Trajes',tabI:'Objetos',lv:'Nv.',upgrade:'Mejorar',buy:'Comprar',use:'Vestir',inUse:'Puesto',needFind:'Encuéntrala primero',
 d_sword:'Más daño, alcance y velocidad',d_bow:'Más flechas; nv3 doble daño, nv4 perforante, nv5 triple',d_spear:'Más lanzas y más daño',d_dash:'Impulso más frecuente; desde nv3 golpea',
 u_heart:'Corazón extra',u_heartX:'Vida máxima +1',u_magnet:'Imán de oro',u_magnetX:'Atrae el oro',
 potion:'Poción de vida',potionX:'Sigue donde caíste',owned:'Tienes',freeG:'Oro gratis',freeGX:'Mira un anuncio: 100 de oro',max:'MÁX',
 c_classic:'Capa clásica',c_forest:'Cazador del bosque',c_frost:'Caminante helado',c_night:'Sombra nocturna',c_crimson:'Guerrero carmesí',c_snow:'Lobo de nieve',c_gold:'Héroe dorado',
 p_none:'La primera capa de Sobe',p_magnet:'Atrae el oro',p_grip:'No resbala en el hielo',p_sight:'Ve más en la oscuridad',p_stomp:'Los pisotones hacen 2 de daño',p_dash:'El impulso carga más rápido',p_gold:'+25% de oro',
 coins:'oro',time:'Tiempo',chicksL:'pollitos',bossDead:'¡Monstruo vencido! ¡Corre al farol!',wind:'VIENTO',
 dayN:'Día',claimed:'Regalo de hoy tomado. ¡Vuelve mañana!',streak:'Racha',rot:'Gira el teléfono para jugar',langName:'Español',
 tut:'Camina con ◀ ▶ y salta con ⤒. Puedes saltar otra vez en el aire.\nSalta sobre los enemigos. ¡Rescata pollitos y enciende el farol!',
 tutDash:'NUEVO: ¡impúlsate con ⇢! No recibes daño y cruzas huecos largos.',tutSpring:'¡Pisa los hongos rojos: te lanzan al cielo!',tutWind:'El viento te empuja. ¡Mira la flecha!',tutIce:'El hielo resbala: frena antes. ¡Cuidado con los carámbanos!',tutDark:'En la oscuridad, antorchas y fogatas iluminan el camino.',tutCastle:'Las ballestas disparan y algunas tablas se caen. ¡Rápido!',cLv:'Traje Nv.',st_spd:'Velocidad',st_jump:'Salto',st_magnet:'Imán',st_grip:'No resbala',st_dashcd:'Recarga impulso',st_sight:'Visión nocturna',st_dmg:'Daño',st_stomp:'Daño de pisotón',st_gold:'Oro',st_heart:'Corazones',tierN:'fase de brillo',nextLv:'Siguiente',power:'Poder',dmgL:'Daño',reachL:'Alcance',capL:'Munición',cdL:'Recarga',c_wind:'Espíritu del viento',c_wolf:'Lobo de nieve'},
pt:{sub:'A LANTERNA PERDIDA',play:'JOGAR',shop:'Loja',daily:'Diário',story:'História',next:'Avançar',skip:'Pular',paused:'Pausa',resume:'Continuar',restart:'Reiniciar',quit:'Ao mapa',double:'Dobrar ouro',menu:'Mapa',retry:'Tentar de novo',dailyT:'Presente diário',close:'Fechar',claim:'Pegar',dailyAd:'+80 com anúncio',
 w_spring:'Floresta da Primavera',w_summer:'Colinas do Verão',w_autumn:'Vale do Outono',w_ice:'Era do Gelo',w_cave:'Cavernas de Osso',w_castle:'Castelo de Osso',
 wx_spring:'A primeira luz da floresta',wx_summer:'Cogumelos saltitantes',wx_autumn:'Ventos fortes',wx_ice:'Gelo e nevascas',wx_cave:'Escuridão total',wx_castle:'Armadilhas e esqueletos',
 locked:'Termine a fase anterior',win:'LANTERNA ACESA!',fail:'SOBE CAIU',lvl:'Fase',
 revT:'Não desista, Sobe!',revX:'Continue do checkpoint com vida cheia.',revPotion:'Usar poção',revAd:'Ver anúncio',giveup:'Desistir',
 sword:'Espada',bow:'Arco',spear:'Lança',dash:'Investida',
 gotSword:'VOCÊ ACHOU UMA ESPADA!',gotSwordX:'Ataque com ⚔. Pular nos inimigos também funciona.',gotBow:'VOCÊ ACHOU UM ARCO!',gotBowX:'Atire de longe. Flechas são limitadas. Troque de arma com ⇄.',gotSpear:'VOCÊ ACHOU UMA LANÇA!',gotSpearX:'Atravessa inimigos e escudos!',
 keyGot:'Chave! Abra o portão.',needKey:'Portão trancado. Ache a chave!',checkpoint:'Checkpoint',chickGot:'Pintinho salvo!',lanternLocked:'Vença o monstro primeiro!',
 tabW:'Armas',tabC:'Roupas',tabI:'Itens',lv:'Nv.',upgrade:'Melhorar',buy:'Comprar',use:'Vestir',inUse:'Vestindo',needFind:'Encontre nas fases primeiro',
 d_sword:'Mais dano, alcance e velocidade',d_bow:'Mais flechas; nv3 dano dobrado, nv4 perfurante, nv5 tiro triplo',d_spear:'Mais lanças e mais dano',d_dash:'Investida mais frequente; a partir do nv3 acerta inimigos',
 u_heart:'Coração extra',u_heartX:'Vida máxima +1',u_magnet:'Ímã de ouro',u_magnetX:'Puxa o ouro',
 potion:'Poção de vida',potionX:'Continue onde caiu',owned:'Você tem',freeG:'Ouro grátis',freeGX:'Veja um anúncio: 100 de ouro',max:'MÁX',
 c_classic:'Capa clássica',c_forest:'Caçador da floresta',c_frost:'Andarilho do gelo',c_night:'Sombra noturna',c_crimson:'Guerreiro carmesim',c_snow:'Lobo da neve',c_gold:'Herói dourado',
 p_none:'A primeira capa de Sobe',p_magnet:'Puxa o ouro',p_grip:'Não escorrega no gelo',p_sight:'Enxerga mais no escuro',p_stomp:'Pisões causam 2 de dano',p_dash:'Investida recarrega mais rápido',p_gold:'+25% de ouro',
 coins:'ouro',time:'Tempo',chicksL:'pintinhos',bossDead:'Monstro vencido! Corra para a lanterna!',wind:'VENTO',
 dayN:'Dia',claimed:'Presente de hoje coletado. Volte amanhã!',streak:'Sequência',rot:'Vire o celular para jogar',langName:'Português',
 tut:'Ande com ◀ ▶ e pule com ⤒. Dá para pular de novo no ar.\nPule nos inimigos. Salve os pintinhos e acenda a lanterna!',
 tutDash:'NOVO: avance com ⇢! Você não leva dano e cruza buracos longos.',tutSpring:'Pise nos cogumelos vermelhos: eles te lançam para o céu!',tutWind:'O vento te empurra. Olhe a seta!',tutIce:'O gelo escorrega: freie antes. Cuidado com as estalactites!',tutDark:'No escuro, tochas e fogueiras iluminam o caminho.',tutCastle:'Bestas atiram no castelo e algumas tábuas caem. Seja rápido!',cLv:'Roupa Nv.',st_spd:'Velocidade',st_jump:'Pulo',st_magnet:'Ímã',st_grip:'Não escorrega',st_dashcd:'Recarga investida',st_sight:'Visão no escuro',st_dmg:'Dano',st_stomp:'Dano de pisão',st_gold:'Ouro',st_heart:'Corações',tierN:'fase de brilho',nextLv:'Próximo',power:'Poder',dmgL:'Dano',reachL:'Alcance',capL:'Munição',cdL:'Recarga',c_wind:'Espírito do vento',c_wolf:'Lobo da neve'}};

/* ------------------------------ HİKÂYE ------------------------------
   Yüzler: sobe, piril (civciv rehber), king (Kemik Kral), goblin, boar, spider, slime, bee */
const STORY={
tr:{
 intro:[['sobe','SOBE','Sobe köyünün ortasında yüz yıldır sönmeyen bir fener yanardı: Kayıp Fener. Işığı dört mevsimi düzenler, canavarları ormandan uzak tutardı.'],
  ['king','KEMİK KRAL','Bir gece dağların ardındaki kaleden Kemik Kral geldi. Feneri altı parçaya böldü ve her parçayı bir canavarına emanet etti.'],
  ['king','KEMİK KRAL','"Işık yoksa mevsim de yok! Bundan sonra yalnızca soğuk ve karanlık olacak!"'],
  ['piril','PIRIL','Cik! Ben Pırıl. Goblinler bütün kardeşlerimi kaçırdı... Sobe, bize sen yardım edebilir misin?'],
  ['sobe','SOBE','Kapüşonlu küçük Sobe korkuyordu. Ama köyde ondan başka cesur kimse kalmamıştı.\n\nFener parçalarını topla, civcivleri kurtar, mevsimleri geri getir!']],
 spring:[['piril','PIRIL','Bahar Ormanı eskiden çiçek kokardı. Şimdi Dev Yaban Domuzu ağaçları deviriyor.\n\nSobe, üstlerine zıplayarak balçıkları ezebilirsin!']],
 summer:[['sobe','SOBE','İlk fener parçası bende! Bahar geri döndü.'],['piril','PIRIL','Yaz Tepeleri\'nde güneş hiç batmıyor ve dev mantarlar her yeri sardı. Kırmızı mantarlara basarsan seni gökyüzüne fırlatırlar!\n\nBalçık Kral bu tepelerin hâkimi. Dikkat et, zıpladığında yer sallanıyor.']],
 autumn:[['piril','PIRIL','Sonbahar Vadisi\'nde rüzgâr hiç dinmiyor. Goblin Şefi rüzgârı kontrol ediyor ve kardeşlerimi çuvallara doldurmuş!'],['sobe','SOBE','Rüzgâr esince sabit dur. Ok işaretini takip edeceğim.']],
 ice:[['sobe','SOBE','Üç parça tamam! Ama hava neden bu kadar soğudu?'],['piril','PIRIL','Kemik Kral kışı bırakmıyor. Buzul Çağı başladı! Buz Kraliçesi arıları dondurup ordusuna kattı.\n\nBuz kaygandır Sobe, erken fren yap. Tavandan sarkıtlar düşebilir!']],
 cave:[['piril','PIRIL','Kemik Mağaraları... Burası çok karanlık. Ben senin pelerinine sığınayım.'],['sobe','SOBE','Meşaleler ve kamp ateşleri bize yol gösterecek. Örümcek Ana\'nın ağlarına dikkat!']],
 castle:[['king','KEMİK KRAL','Demek beş parçayı topladın, küçük pelerinli... Kaleme hoş geldin. Buradan kimse çıkamaz!'],['sobe','SOBE','Arbaletler, çöken tahtalar, iskelet ordusu... Ama son parça burada. Pırıl, sıkı tutun!']],
 bossdone:{
  spring:[['piril','PIRIL','Dev Yaban Domuzu kaçtı! Fenerin ilk parçası parlıyor. Teşekkürler Sobe!']],
  summer:[['sobe','SOBE','Balçık Kral eriyip gitti. İkinci parça! Tepelerde çiçekler yeniden açıyor.']],
  autumn:[['piril','PIRIL','Goblin Şefi yenildi, rüzgâr durdu! Kardeşlerimin yarısı evine döndü.']],
  ice:[['sobe','SOBE','Buz Kraliçesi dağıldı! Dördüncü parça elimde, buzlar çözülüyor.']],
  cave:[['piril','PIRIL','Örümcek Ana\'nın ağları yırtıldı. Beşinci parça! Mağaranın sonunda bir kale görünüyor...']]},
 end:[['king','KEMİK KRAL','Hayır... ışık... çok parlak...'],['piril','PIRIL','Başardın Sobe! Bütün kardeşlerim evde. Fener yeniden yanıyor!'],['sobe','SOBE','Mevsimler geri döndü. Sobe köyü bütün gece bayram etti.\n\nEksik civciv kaldıysa geri dön: her bölümde 3 civciv saklı!']]},
en:{
 intro:[['sobe','SOBE','In the heart of Sobe village burned a lantern that had not gone out for a hundred years: the Lost Lantern. Its light kept the four seasons turning and the monsters away.'],
  ['king','BONE KING','One night the Bone King came from his castle beyond the mountains. He broke the lantern into six shards and gave each one to one of his monsters.'],
  ['king','BONE KING','"No light, no seasons! From now on there will be only cold and darkness!"'],
  ['piril','PIRIL','Cheep! I\'m Piril. The goblins took all my brothers and sisters... Sobe, will you help us?'],
  ['sobe','SOBE','Little hooded Sobe was scared. But no one braver was left in the village.\n\nCollect the lantern shards, rescue the chicks, bring the seasons back!']],
 spring:[['piril','PIRIL','The Spring Forest used to smell of flowers. Now the Giant Boar knocks the trees down.\n\nSobe, you can squash slimes by jumping on them!']],
 summer:[['sobe','SOBE','The first shard is mine! Spring is back.'],['piril','PIRIL','On the Summer Hills the sun never sets and giant mushrooms cover everything. Step on the red ones to fly into the sky!\n\nThe Slime King rules these hills. Careful, the ground shakes when he jumps.']],
 autumn:[['piril','PIRIL','The wind never stops in the Autumn Valley. The Goblin Chief controls it and he stuffed my siblings into sacks!'],['sobe','SOBE','When it blows I\'ll stand firm and follow the arrow.']],
 ice:[['sobe','SOBE','Three shards! But why is it getting so cold?'],['piril','PIRIL','The Bone King won\'t let winter go. The Ice Age has begun! The Frost Queen froze the bees and made them her army.\n\nIce is slippery, Sobe, brake early. Icicles may fall from above!']],
 cave:[['piril','PIRIL','The Bone Caves... It\'s so dark. Let me hide in your cloak.'],['sobe','SOBE','Torches and campfires will guide us. Watch out for the Spider Queen\'s webs!']],
 castle:[['king','BONE KING','So you gathered five shards, little cloak... Welcome to my castle. No one ever leaves!'],['sobe','SOBE','Crossbows, crumbling planks, a skeleton army... But the last shard is here. Hold on tight, Piril!']],
 bossdone:{
  spring:[['piril','PIRIL','The Giant Boar ran away! The first shard is glowing. Thank you, Sobe!']],
  summer:[['sobe','SOBE','The Slime King melted away. Second shard! Flowers bloom on the hills again.']],
  autumn:[['piril','PIRIL','The Goblin Chief is beaten and the wind has stopped! Half of my siblings are home.']],
  ice:[['sobe','SOBE','The Frost Queen shattered! Fourth shard, and the ice is melting.']],
  cave:[['piril','PIRIL','The Spider Queen\'s webs are torn. Fifth shard! There\'s a castle at the end of the cave...']]},
 end:[['king','BONE KING','No... the light... too bright...'],['piril','PIRIL','You did it, Sobe! All my siblings are home. The lantern shines again!'],['sobe','SOBE','The seasons are back. Sobe village celebrated all night long.\n\nMissed some chicks? Every level hides 3 of them!']]}};
STORY.es={intro:[['sobe','SOBE','En el corazón de la aldea de Sobe ardía un farol que no se apagaba hacía cien años: el Farol Perdido. Su luz movía las cuatro estaciones.'],['king','REY DE HUESO','Una noche el Rey de Hueso rompió el farol en seis fragmentos y se los dio a sus monstruos.'],['piril','PIRIL','¡Pío! Soy Piril. Los goblins se llevaron a mis hermanos... Sobe, ¿nos ayudas?'],['sobe','SOBE','¡Reúne los fragmentos, rescata a los pollitos y trae de vuelta las estaciones!']],
 spring:[['piril','PIRIL','El Jabalí Gigante está derribando el Bosque de Primavera. ¡Salta sobre los slimes!']],summer:[['piril','PIRIL','En las Colinas de Verano, los hongos rojos te lanzan al cielo. ¡Cuidado con el Rey Slime!']],autumn:[['piril','PIRIL','El Jefe Goblin controla el viento del Valle de Otoño. ¡Sigue la flecha!']],ice:[['piril','PIRIL','¡Empezó la Edad de Hielo! La Reina Helada congeló a las abejas. Frena antes en el hielo.']],cave:[['piril','PIRIL','Las Cuevas de Hueso están oscuras. Las antorchas nos guiarán.']],castle:[['king','REY DE HUESO','Bienvenido a mi castillo. ¡Nadie sale de aquí!']],
 bossdone:{spring:[['piril','PIRIL','¡El primer fragmento brilla! Gracias, Sobe.']],summer:[['sobe','SOBE','¡Segundo fragmento!']],autumn:[['piril','PIRIL','¡El viento paró!']],ice:[['sobe','SOBE','¡Cuarto fragmento, el hielo se derrite!']],cave:[['piril','PIRIL','¡Quinto fragmento! Al final de la cueva hay un castillo...']]},
 end:[['king','REY DE HUESO','No... la luz...'],['piril','PIRIL','¡Lo lograste, Sobe! Todos están en casa.'],['sobe','SOBE','Las estaciones volvieron. Cada nivel esconde 3 pollitos.']]};
STORY.pt={intro:[['sobe','SOBE','No coração da vila de Sobe brilhava uma lanterna acesa há cem anos: a Lanterna Perdida. Sua luz movia as quatro estações.'],['king','REI DOS OSSOS','Uma noite o Rei dos Ossos quebrou a lanterna em seis fragmentos e deu cada um a um monstro.'],['piril','PIRIL','Piu! Eu sou a Piril. Os goblins levaram meus irmãos... Sobe, você ajuda?'],['sobe','SOBE','Junte os fragmentos, salve os pintinhos e traga as estações de volta!']],
 spring:[['piril','PIRIL','O Javali Gigante está derrubando a Floresta da Primavera. Pule nos slimes!']],summer:[['piril','PIRIL','Nas Colinas do Verão, os cogumelos vermelhos te lançam para o céu. Cuidado com o Rei Slime!']],autumn:[['piril','PIRIL','O Chefe Goblin controla o vento do Vale do Outono. Siga a seta!']],ice:[['piril','PIRIL','A Era do Gelo começou! A Rainha do Gelo congelou as abelhas. Freie antes no gelo.']],cave:[['piril','PIRIL','As Cavernas de Osso estão escuras. As tochas vão nos guiar.']],castle:[['king','REI DOS OSSOS','Bem-vindo ao meu castelo. Ninguém sai daqui!']],
 bossdone:{spring:[['piril','PIRIL','O primeiro fragmento brilha! Obrigada, Sobe.']],summer:[['sobe','SOBE','Segundo fragmento!']],autumn:[['piril','PIRIL','O vento parou!']],ice:[['sobe','SOBE','Quarto fragmento, o gelo está derretendo!']],cave:[['piril','PIRIL','Quinto fragmento! No fim da caverna há um castelo...']]},
 end:[['king','REI DOS OSSOS','Não... a luz...'],['piril','PIRIL','Você conseguiu, Sobe! Todos estão em casa.'],['sobe','SOBE','As estações voltaram. Cada fase esconde 3 pintinhos.']]};
const BOSSNAME={bigboar:{tr:'DEV YABAN DOMUZU',en:'GIANT BOAR',es:'JABALÍ GIGANTE',pt:'JAVALI GIGANTE'},slimeking:{tr:'BALÇIK KRAL',en:'SLIME KING',es:'REY SLIME',pt:'REI SLIME'},goblinchief:{tr:'GOBLİN ŞEFİ',en:'GOBLIN CHIEF',es:'JEFE GOBLIN',pt:'CHEFE GOBLIN'},frostqueen:{tr:'BUZ KRALİÇESİ',en:'FROST QUEEN',es:'REINA HELADA',pt:'RAINHA DO GELO'},spiderqueen:{tr:'ÖRÜMCEK ANA',en:'SPIDER QUEEN',es:'REINA ARAÑA',pt:'RAINHA ARANHA'},boneking:{tr:'KEMİK KRAL',en:'BONE KING',es:'REY DE HUESO',pt:'REI DOS OSSOS'}};
// bölüm içi tabelalar (levels.js 'S' karakterleri sırasıyla bu listeden metin alır)
const SIGNS={
tr:['Civcivler bazen yüksekte saklanır. Yukarı bak!','İkinci zıplama havada da işe yarar.','Kamp ateşi kontrol noktasıdır ve canını doldurur.','Sandıkları kır, içinden altın çıkar!','Kırmızı mantar = süper zıplama!','Rüzgâr ters eserken atılmak işe yarar.','Buzda koşarken fren mesafesi uzar.','Sarkıtlar titrerse hemen kaç!','Anahtarı bulmadan kapı açılmaz.','Meşaleler karanlıkta yolu gösterir.','Arbalet okları kılıçla geri çevrilebilir.','Çatırdayan tahtada uzun durma!','Atılırken hasar almazsın.','Merdivende ▲ ▼ tuşlarını kullan.','Dükkândan silahını geliştir!'],
en:['Chicks sometimes hide up high. Look up!','The second jump works in mid-air too.','Campfires are checkpoints and restore your health.','Break crates for gold!','Red mushroom = super jump!','Dashing helps against a headwind.','On ice your braking distance is longer.','If an icicle shakes, run!','The gate won\'t open without the key.','Torches show the way in the dark.','Crossbow bolts can be knocked back with the sword.','Don\'t stand on creaking planks for long!','You can\'t be hurt while dashing.','Use ▲ ▼ on ladders.','Upgrade your weapons in the shop!'],
es:['A veces los pollitos se esconden arriba.','El segundo salto funciona en el aire.','Las fogatas guardan y curan.','¡Rompe cajas para conseguir oro!','¡Hongo rojo = súper salto!','El impulso ayuda contra el viento.','En el hielo frenas tarde.','¡Si un carámbano tiembla, corre!','La puerta necesita llave.','Las antorchas muestran el camino.','La espada devuelve las flechas.','¡No te quedes en tablas que crujen!','No recibes daño al impulsarte.','Usa ▲ ▼ en las escaleras.','¡Mejora tus armas en la tienda!'],
pt:['Às vezes os pintinhos se escondem no alto.','O segundo pulo funciona no ar.','Fogueiras salvam e curam.','Quebre caixas para ganhar ouro!','Cogumelo vermelho = super pulo!','A investida ajuda contra o vento.','No gelo você freia tarde.','Se a estalactite tremer, corra!','O portão precisa da chave.','Tochas mostram o caminho.','A espada rebate as flechas.','Não fique em tábuas que rangem!','Você não leva dano na investida.','Use ▲ ▼ nas escadas.','Melhore suas armas na loja!']};

/* ------------------------------ KAYIT ------------------------------ */
const S0=()=>({coins:0,unlocked:0,stars:{},weapons:[],wl:{sword:1,bow:1,spear:1,dash:1},up:{heart:0,magnet:0},potions:1,costume:'classic',owned:['classic'],clv:{},lang:null,sound:true,daily:{last:'',streak:0},storySeen:false,seen:{},adG:{d:'',n:0},best:{},dash:false});
let S=S0();
try{const d=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
  if(d){S=Object.assign(S0(),d);S.wl=Object.assign(S0().wl,d.wl||{});S.up=Object.assign(S0().up,d.up||{});S.daily=Object.assign({last:'',streak:0},d.daily||{});S.seen=d.seen||{};S.adG=d.adG||{d:'',n:0};if(!S.owned.includes('classic'))S.owned.unshift('classic');S.owned=S.owned.map(o=>o==='snow'?'wolf':o);if(S.costume==='snow')S.costume='wolf';S.clv=d.clv||{};}
  else{// eski sürümden (v2) altın, iksir ve geliştirmeleri taşı
    const o=JSON.parse(localStorage.getItem('sobe2-save')||'null');
    if(o){S.coins=(o.coins||0)+300;S.potions=Math.max(1,o.potions||1);S.lang=o.lang||null;S.sound=o.sound!==false;if(o.up){S.up.heart=Math.min(3,o.up.heart||0);S.up.magnet=Math.min(3,o.up.magnet||0);}}}
}catch(e){}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}}
let lang=S.lang||(navigator.language||'en').slice(0,2);if(!L[lang])lang='en';
const t=k=>(L[lang][k]!=null?L[lang][k]:(L.en[k]!=null?L.en[k]:k));
const $=id=>document.getElementById(id);
const costume=()=>COSTUMES.find(c=>c.id===S.costume)||COSTUMES[0];
// kostüm avantajı (seviyeye göre); yoksa 0
const clvl=id=>Math.max(1,Math.min(3,(S.clv&&S.clv[id])||1));
const cst=k=>{const c=costume();const a=c.st&&c.st[k];return a?a[clvl(c.id)-1]:0;};

/* ------------------------------ SES ------------------------------ */
let AC=null,master=null,mus=null,sfx=null;const BUF={};let musSrc=null,curMus='';
function audioInit(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=S.sound?1:0;master.connect(AC.destination);mus=AC.createGain();mus.gain.value=.42;mus.connect(master);sfx=AC.createGain();sfx.gain.value=.8;sfx.connect(master);
 ['menu','forest','cave','snow','canAlma','dusmanYaralama','iskeletOlme','karakterDarbeAlma','kilic','mizrak','mucevherToplama','okAtma','saglikToplama','sandikKirma'].forEach(n=>fetch('snd/'+n+'.mp3').then(r=>r.arrayBuffer()).then(b=>AC.decodeAudioData(b)).then(d=>{BUF[n]=d;if(n===curMus){const m=curMus;curMus='';music(m);}}).catch(()=>{}));}catch(e){}}
function play(n,v,r){if(!AC||!BUF[n])return;const s=AC.createBufferSource();s.buffer=BUF[n];s.playbackRate.value=r||1;const g=AC.createGain();g.gain.value=v==null?1:v;s.connect(g);g.connect(sfx);s.start();}
function music(n){if(!AC){curMus=n;return;}if(curMus===n&&musSrc)return;curMus=n;if(musSrc){try{musSrc.stop();}catch(e){}musSrc=null;}if(!BUF[n])return;musSrc=AC.createBufferSource();musSrc.buffer=BUF[n];musSrc.loop=true;musSrc.connect(mus);musSrc.start();}
function beep(f,d,ty,v){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=ty||'square';o.frequency.setValueAtTime(f,AC.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(50,f*1.6),AC.currentTime+d);g.gain.setValueAtTime(v||.12,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(g);g.connect(sfx);o.start();o.stop(AC.currentTime+d);}
function boing(){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(180,AC.currentTime);o.frequency.exponentialRampToValueAtTime(900,AC.currentTime+.22);g.gain.setValueAtTime(.16,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.25);o.connect(g);g.connect(sfx);o.start();o.stop(AC.currentTime+.26);}
function whoosh(){if(!AC)return;const n=AC.createBufferSource();const b=AC.createBuffer(1,AC.sampleRate*.2,AC.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);n.buffer=b;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=1200;const g=AC.createGain();g.gain.value=.25;n.connect(f);f.connect(g);g.connect(sfx);n.start();}
function vib(ms){try{navigator.vibrate&&navigator.vibrate(ms);}catch(e){}}

/* ------------------------------ VARLIKLAR ------------------------------ */
let SPR=null;const IMG={};
function loadImg(n,src){return new Promise(r=>{const i=new Image();i.onload=()=>{IMG[n]=i;r(i);};i.onerror=()=>{console.warn('img fail',src);r(null);};i.src=src;});}
// renk filtresi uygulanmış kopya (bir kez üretilir, her karede filtre maliyeti olmaz)
const TINT={};
function tinted(name,filter){if(!filter||filter==='none')return IMG[name];const k=name+'|'+filter;if(TINT[k])return TINT[k];const im=IMG[name];if(!im)return null;
  const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.filter=filter;g.drawImage(im,0,0);TINT[k]=c;return c;}

/* ------------------------------ TUVAL ------------------------------ */
const cv=$('cv'),cx=cv.getContext('2d');
let W=0,H=0,DPR=1,SC=1,VW=0;
function resize(){DPR=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);SC=H/VIEW_H;VW=W/SC;$('rotate').classList.toggle('need',H>W);}
addEventListener('resize',resize);

/* ------------------------------ SPRITE ------------------------------ */
function charOf(ch,name){return ch==='fx'?SPR.fx[name]:SPR.chars[ch];}
function drawFrame(ch,name,fi,x,y,flip,scale,alpha,filter,imgOverride){
  const c=charOf(ch,name);if(!c)return;const a=c.anims[name]||c.anims[Object.keys(c.anims)[0]];const f=a[Math.floor(fi)%a.length];const img=imgOverride||IMG[c.img];if(!img)return;
  const s=(scale||1)*c.s;const w=c.w*s,h=c.h*s;
  let ax=c.ax;if(c.axp){const v=c.axp[name.slice(0,2)];if(v!=null)ax=v;}
  cx.save();cx.translate(x,y);if(flip)cx.scale(-1,1);if(alpha!=null)cx.globalAlpha=Math.max(0,alpha);
  if(filter)cx.filter=filter;
  cx.drawImage(img,f[0],f[1],c.w,c.h,-ax*s,-c.ay*s,w,h);cx.restore();}
function frameCount(ch,name){const c=charOf(ch,name);const a=c&&c.anims[name];return a?a.length:1;}

/* ------------------------------ BÖLÜM ------------------------------ */
let LV=null;
const ESTAT={s:{ch:'slime',hp:1,sp:60,coins:2},b:{ch:'boar',hp:2,sp:75,coins:3},f:{ch:'boar',hp:3,sp:95,coins:4,tint:'hue-rotate(185deg) saturate(.8) brightness(1.2)'},
 v:{ch:'bat',hp:1,sp:160,coins:3,fly:true},e:{ch:'bee',hp:1,sp:80,coins:3,fly:true},i:{ch:'bee',hp:2,sp:95,coins:4,fly:true,tint:'hue-rotate(150deg) saturate(.6) brightness(1.3)'},
 x:{ch:'spider',hp:2,sp:95,coins:4},g:{ch:'goblin',hp:2,sp:85,coins:4},k:{ch:'skel',hp:3,sp:75,coins:5},A:{ch:'archer',hp:2,sp:0,coins:5},h:{ch:'shield',hp:3,sp:65,coins:6}};
function parseLevel(idx){
  const def=window.SOBE_LEVELS[idx];const WD=WORLDS[def.wi];
  const rows=def.map.slice();const Hh=rows.length;const Ww=Math.max(...rows.map(r=>r.length));
  const g=rows.map(r=>(r+'.'.repeat(Ww-r.length)).split(''));
  const lv={idx,def,WD,wi:def.wi,W:Ww,H:Hh,g,enemies:[],items:[],plats:[],decos:[],proj:[],parts:[],floats:[],fx:[],traps:[],signs:[],lights:[],start:{x:0,y:0},exit:null,boss:null,chicksTotal:0,crumbles:{}};
  let signN=0;
  for(let y=0;y<Hh;y++)for(let x=0;x<Ww;x++){const ch=g[y][x];const px=x*TS+TS/2,py=(y+1)*TS;
    const clear=()=>{g[y][x]='.';};
    switch(ch){
      case 'P':lv.start={x:px,y:py};clear();break;
      case 'E':lv.exit={x:px,y:py,lit:false};clear();break;
      case 'F':lv.items.push({k:'fire',x:px,y:py,lit:false,t:0});clear();break;
      case 'c':lv.items.push({k:'coin',x:px,y:py-TS/2,t:Math.random()*8});clear();break;
      case 'C':lv.items.push({k:'chick',x:px,y:py,t:Math.random()*8});lv.chicksTotal++;clear();break;
      case 'o':lv.items.push({k:'potion',x:px,y:py-TS/2,t:0});clear();break;
      case 'a':lv.items.push({k:'arrows',x:px,y:py-TS/2,t:0});clear();break;
      case 'r':lv.items.push({k:'spears',x:px,y:py-TS/2,t:0});clear();break;
      case 'K':lv.items.push({k:'key',x:px,y:py-TS/2,t:0});clear();break;
      case 'W':lv.items.push({k:'weapon',x:px,y:py-TS/2,t:0,wpn:def.weapon});clear();break;
      case 'G':lv.items.push({k:'dashorb',x:px,y:py-TS/2,t:0});clear();break;
      case 'B':lv.items.push({k:'crate',x:px,y:py,hp:1,t:0,solidBox:true});clear();break;
      case 'T':lv.items.push({k:'chest',x:px,y:py,hp:2,t:0,open:false});clear();break;
      case 'U':lv.items.push({k:'barrel',x:px,y:py,hp:1,t:0,solidBox:true});clear();break;
      case 'm':lv.plats.push({x:x*TS,y:y*TS+8,w:TS*2,ax:x*TS,ay:y*TS+8,dx:TS*3,dy:0,sp:.75,ph:0,vx:0,vy:0});clear();break;
      case 'n':lv.plats.push({x:x*TS,y:y*TS+8,w:TS*2,ax:x*TS,ay:y*TS+8,dx:0,dy:-TS*3,sp:.6,ph:0,vx:0,vy:0});clear();break;
      case 'J':lv.traps.push({k:'spring',x:px,y:py,sq:0});g[y][x]='j';break; // mantar (katı)
      case 'X':g[y][x]='X';lv.crumbles[x+','+y]={t:0,st:0,gone:0};break;   // çöken tahta (tek yönlü)
      case 'L':lv.traps.push({k:'icicle',x:px,y:y*TS+4,oy:y*TS+4,vy:0,st:'hang',t:0});clear();break;
      case 'Y':{const left=g[y][x+1]==='#';lv.traps.push({k:'crossbow',x:px,y:py,dir:left?-1:1,t:Math.random()*2,fi:0});clear();break;}
      case 'O':lv.lights.push({x:px,y:py-70,r:230,k:'firebowl'});lv.decos.push({fx:'firebowl',x:px,y:py});clear();break;
      case 't':lv.lights.push({x:px,y:py-58,r:200,k:'torch'});lv.decos.push({fx:'torch',x:px,y:py-6});clear();break;
      case 'S':lv.signs.push({x:px,y:py,n:(def.signs&&def.signs[signN])!=null?def.signs[signN]:signN,show:0});signN++;clear();break;
      case 'M':lv.bossSpawn={x:px,y:py};clear();break;
      case 'R':lv.decos.push({fx:'crow',x:px,y:py-6,ph:Math.random()*6});clear();break;
      default:
        if(ESTAT[ch]){spawnEnemy(lv,ch,px,py);clear();}
        else if(ch>='1'&&ch<='6'){lv.decos.push({n:WD.deco[+ch-1],x:px,y:py});clear();}
    }}
  const solidAt=(x,y)=>y>=Hh||y<0?false:(x<0||x>=Ww?true:(g[y][x]==='#'||g[y][x]==='I'));
  lv.groundY=(()=>{const sx=Math.floor(lv.start.x/TS);for(let y=Math.floor(lv.start.y/TS);y<Hh;y++)if(solidAt(sx,y))return y*TS;return Hh*TS;})();
  lv.cell=g.map((r,y)=>r.map((ch,x)=>{
    if(ch!=='#'&&ch!=='I')return null;
    const top=!solidAt(x,y-1),bot=!solidAt(x,y+1)&&y<Hh-1,l=!solidAt(x-1,y),rr=!solidAt(x+1,y);
    if(top)return l?'TL':(rr?'TR':(x%2?'T2':'T1'));
    if(bot)return l?'BL':(rr?'BR':(x%2?'B2':'B1'));
    if(l)return y%2?'L1':'L2';if(rr)return y%2?'R1':'R2';return 'C'+(y%2+1)+(x%2+1);}));
  return lv;}
function spawnEnemy(lv,ch,x,y){const st=ESTAT[ch];const e={type:ch,ch:st.ch,x,y,vx:0,vy:0,dir:-1,hp:st.hp,maxHp:st.hp,st:'idle',t:Math.random()*2,fi:Math.random()*5,onG:false,hurt:0,dead:false,w:40,h:50,ox:x,oy:y,cd:Math.random()*2,tint:st.tint||null};
  if(ch==='v'){e.st='hang';e.y=startCeil(lv,x,y);}
  if(ch==='x'){e.st='hang';e.y=startCeil(lv,x,y)+10;e.anchorY=e.y;}
  if(ch==='e'||ch==='i'){e.y=y-TS*.7;e.oy=e.y;}
  if(ch==='b'||ch==='f')e.w=56,e.h=44;if(ch==='k'||ch==='h'||ch==='g'||ch==='A')e.w=36,e.h=70;if(ch==='s')e.w=44,e.h=34;if(ch==='e'||ch==='i')e.w=44,e.h=44;if(ch==='v')e.w=44,e.h=36;
  lv.enemies.push(e);return e;}
function startCeil(lv,x,y){let ty=Math.floor((y-1)/TS);const tx=Math.floor(x/TS);while(ty>0&&lv.g[ty-1][tx]!=='#'&&lv.g[ty-1][tx]!=='I')ty--;return ty*TS+34;}

/* ------------------------------ ÇARPIŞMA ------------------------------ */
function tileAt(tx,ty){if(ty<0||ty>=LV.H)return '.';if(tx<0||tx>=LV.W)return '#';return LV.g[ty][tx];}
function isSolid(tx,ty){const c=tileAt(tx,ty);return c==='#'||c==='I'||c==='D'||c==='j';}
function isOneWay(tx,ty){const c=tileAt(tx,ty);if(c==='=')return true;if(c==='H')return tileAt(tx,ty-1)!=='H';if(c==='X'){const cr=LV.crumbles[tx+','+ty];return cr&&!cr.gone;}return false;}
function boxHitsSolid(l,t,r,b){for(let ty=Math.floor(t/TS);ty<=Math.floor((b-.01)/TS);ty++)for(let tx=Math.floor(l/TS);tx<=Math.floor((r-.01)/TS);tx++)if(isSolid(tx,ty))return true;
  for(const it of LV.items)if(it.solidBox&&!it.gone){if(r>it.x-26&&l<it.x+26&&b>it.y-52&&t<it.y)return true;}return false;}
// x: orta, y: ayak. Hızlı hareketlerde kaçırmamak için alt adımlara bölünür.
function move(o,dt,opts){
  const dx=o.vx*dt,dy=o.vy*dt;const n=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/10));
  const wasG=o.onG;o.onG=false;o.plat=null;o.hitWall=0;o.ground='';
  for(let i=0;i<n;i++){moveX(o,dx/n);if(moveY(o,dy/n,opts||{}))break;}
  if(!o.onG&&wasG&&o.vy>=0){// yerde duruyorsa zemini koru
    const hw=o.w/2;if(boxHitsSolid(o.x-hw,o.y-o.h,o.x+hw,o.y+1)){o.onG=true;o.ground=groundKind(o);}}
}
function moveX(o,d){if(!d)return;const hw=o.w/2;let nx=o.x+d;
  if(boxHitsSolid(nx-hw,o.y-o.h,nx+hw,o.y-1)){
    if(d>0){nx=Math.floor((nx+hw)/TS)*TS-hw-.01;o.hitWall=1;}else{nx=Math.ceil((nx-hw)/TS)*TS+hw+.01;o.hitWall=-1;}
    if(boxHitsSolid(nx-hw,o.y-o.h,nx+hw,o.y-1))nx=o.x;o.vx=0;}
  o.x=nx;}
function moveY(o,d,opts){if(!d)return false;const hw=o.w/2;let ny=o.y+d;
  if(d>0){
    if(boxHitsSolid(o.x-hw,ny-o.h,o.x+hw,ny)){ny=Math.floor(ny/TS)*TS;
      if(boxHitsSolid(o.x-hw,ny-o.h,o.x+hw,ny-.01)){for(const it of LV.items)if(it.solidBox&&!it.gone&&o.x+hw>it.x-26&&o.x-hw<it.x+26&&o.y<=it.y-52+2){ny=it.y-52;}}
      o.y=ny;o.vy=0;o.onG=true;o.ground=groundKind(o);return true;}
    if(!opts.noOneWay&&!o.dropT){
      const ty=Math.floor(ny/TS);
      if(o.y<=ty*TS+.5&&ny>=ty*TS){for(let tx=Math.floor((o.x-hw)/TS);tx<=Math.floor((o.x+hw-.01)/TS);tx++){if(isOneWay(tx,ty)){o.y=ty*TS;o.vy=0;o.onG=true;o.ground=tileAt(tx,ty)==='X'?'X':'=';o.oneTx=tx;o.oneTy=ty;return true;}}}
      for(const p of LV.plats){if(o.x+hw>p.x+2&&o.x-hw<p.x+p.w-2&&o.y<=p.y+2&&ny>=p.y){o.y=p.y;o.vy=0;o.onG=true;o.plat=p;o.ground='p';return true;}}
      for(const it of LV.items)if(it.solidBox&&!it.gone&&o.x+hw>it.x-26&&o.x-hw<it.x+26&&o.y<=it.y-52+1&&ny>=it.y-52){o.y=it.y-52;o.vy=0;o.onG=true;o.ground='#';return true;}
    }
  }else{if(boxHitsSolid(o.x-hw,ny-o.h,o.x+hw,ny-1)){ny=Math.ceil((ny-o.h)/TS)*TS+o.h;o.y=ny;o.vy=0;o.bonk=1;return true;}}
  o.y=ny;return false;}
function groundKind(o){const ty=Math.floor((o.y+2)/TS);const hw=o.w/2-2;let k='';for(const x of [o.x-hw,o.x,o.x+hw]){const c=tileAt(Math.floor(x/TS),ty);if(c==='#'||c==='D')return '#';if(c==='I')k='I';if(c==='j')k=k||'j';}return k||'#';}
function groundAhead(o,dir){const tx=Math.floor((o.x+dir*(o.w/2+4))/TS),ty=Math.floor((o.y+4)/TS);const c=tileAt(tx,ty);return c==='#'||c==='I'||c==='='||c==='D'||c==='X';}
function wallAhead(o,dir){const tx=Math.floor((o.x+dir*(o.w/2+4))/TS),ty=Math.floor((o.y-10)/TS);return isSolid(tx,ty);}
function hazardAhead(o,dir){const tx=Math.floor((o.x+dir*(o.w/2+4))/TS),ty=Math.floor((o.y-10)/TS);return tileAt(tx,ty)==='^'||tileAt(tx,ty+1)==='^';}
const overlap=(a,b)=>a.l<b.r&&a.r>b.l&&a.t<b.b&&a.b>b.t;
const rectOf=o=>({l:o.x-o.w/2,r:o.x+o.w/2,t:o.y-o.h,b:o.y});

/* ------------------------------ OYUNCU ------------------------------ */
let P=null;
const IN={l:0,r:0,u:0,d:0,j:0,a:0,s:0,jp:0,ap:0,wp:0,sp:0,jr:0};
function maxHearts(){return 3+S.up.heart+cst('heart');}
const wl=w=>Math.max(1,Math.min(WMAX,S.wl[w]||1))-1;
const wt=w=>wtier(wl(w)+1);
function newPlayer(){const st=LV.start;return {x:st.x,y:st.y,vx:0,vy:0,w:PH.pw,h:PH.ph,dir:1,onG:false,ground:'',hp:maxHearts(),inv:0,coy:0,jbuf:0,jumps:0,atk:0,atkCd:0,anim:'idle',fi:0,dead:false,climb:false,
  safe:{x:st.x,y:st.y},cp:{x:st.x,y:st.y},wpn:curWeapon(),arrows:WPN.bow.cap[wl('bow')],spears:WPN.spear.cap[wl('spear')],hasKey:false,dropT:0,deadT:0,knock:0,dashT:0,dashCd:0,airDash:true,squash:0,cutDone:false};}
function curWeapon(){const d=LV.def.weapon;const ws=S.weapons;if(d&&ws.includes(d))return d;return ws.length?ws[ws.length-1]:null;}
function form(){return P.wpn==='sword'?'sw':P.wpn==='bow'?'bw':P.wpn==='spear'?'sp':'pl';}
function hurtPlayer(dmg,fromX,hazard){
  if(P.dead||G.state!=='play')return;
  if(P.dashT>0&&!hazard)return;
  if(P.inv>0){if(hazard){P.x=P.safe.x;P.y=P.safe.y;P.vx=0;P.vy=0;}return;}
  P.hp-=dmg;P.inv=1.4;play('karakterDarbeAlma',.9);vib(60);shake=8;flash=.25;
  P.vx=(P.x<fromX?-1:1)*230;P.vy=-420;P.knock=.16;
  floatTxt(P.x,P.y-80,'-'+dmg,'#ff6b5e');
  if(P.hp<=0)killPlayer();
  else if(hazard){P.x=P.safe.x;P.y=P.safe.y;P.vx=0;P.vy=0;P.knock=0;updateCam(0,true);}
  updHud();}
function killPlayer(){P.dead=true;P.deadT=0;P.anim='die';P.fi=0;P.vx=0;music('');play('iskeletOlme',.6,.8);const tok=G.tok;setTimeout(()=>{if(G.tok===tok&&G.state==='play')offerRevive();},1300);}
let nearLadder=false;
function updatePlayer(dt){
  const p=P;
  if(p.dead){p.deadT+=dt;p.fi+=dt*12;p.vy+=PH.gDown*dt;if(p.vy>PH.maxFall)p.vy=PH.maxFall;move(p,dt);return;}
  if(p.inv>0)p.inv-=dt;if(p.atkCd>0)p.atkCd-=dt;if(p.knock>0)p.knock-=dt;if(p.dropT>0)p.dropT-=dt;if(p.dashCd>0)p.dashCd-=dt;if(p.squash>0)p.squash-=dt;
  const want=(IN.r?1:0)-(IN.l?1:0);
  // ---- merdiven
  const tx=Math.floor(p.x/TS),tyM=Math.floor((p.y-30)/TS),tyF=Math.floor((p.y+2)/TS);
  const onLadder=tileAt(tx,tyM)==='H'||tileAt(tx,Math.floor((p.y-60)/TS))==='H';
  const ladderBelow=tileAt(tx,tyF)==='H';
  nearLadder=onLadder||ladderBelow;
  if(!p.climb&&p.dashT<=0&&((IN.u&&onLadder)||(IN.d&&ladderBelow&&p.onG))){p.climb=true;p.x=tx*TS+TS/2;p.vx=0;p.vy=0;if(IN.d&&ladderBelow&&p.onG)p.y+=6;}
  if(p.climb){
    p.vy=((IN.d?1:0)-(IN.u?1:0))*PH.climb;p.vx=want*130;p.anim='climb';if(p.vy||p.vx)p.fi+=dt*12;
    const ny=p.y+p.vy*dt;
    const still=tileAt(Math.floor(p.x/TS),Math.floor((ny-30)/TS))==='H'||tileAt(Math.floor(p.x/TS),Math.floor((ny-5)/TS))==='H';
    if(!still){p.climb=false;if(p.vy<0)p.vy=-320;}
    if(IN.jp){p.climb=false;p.vy=-PH.jump*.85;p.jumps=1;p.vx=want*PH.run*.6;}
    else{move(p,dt,{noOneWay:true});if(p.onG&&IN.d)p.climb=false;}
    p.airDash=true;
    if(p.climb)return;}
  // ---- atılma
  if(IN.sp&&S.dash&&p.dashCd<=0&&p.dashT<=0&&(p.onG||p.airDash)){
    if(want)p.dir=want;p.dashT=PH.dashT;p.dashCd=WPN.dash.cd[wl('dash')]*(1-cst('dashcd'));if(!p.onG)p.airDash=false;p.vy=0;p.vx=p.dir*PH.dashV;p.dashHit=new Set();whoosh();
    for(let i=0;i<6;i++)LV.parts.push({x:p.x,y:p.y-30-Math.random()*30,vx:-p.dir*(100+Math.random()*150),vy:(Math.random()-.5)*60,t:0,life:.3,c:'#fff8',s:6});}
  if(p.dashT>0){
    p.dashT-=dt;p.vy=0;p.vx=p.dir*PH.dashV;
    if(Math.random()<.7)LV.trail.push({x:p.x,y:p.y,dir:p.dir,f:form(),fi:p.fi,t:0});
    move(p,dt);
    if(p.hitWall)p.dashT=0;
    if(p.dashT<=0)p.vx=p.dir*PH.run;
    afterMove(p,dt);return;}
  // ---- yatay hareket
  const onIce=p.onG&&p.ground==='I'&&!cst('grip');
  const spd=1+cst('spd');const maxV=(onIce?PH.iceRun:PH.run)*spd;
  if(p.knock<=0){
    if(p.onG){
      if(want){
        if(p.vx*want<0)p.vx=onIce?p.vx+want*PH.iceTurn*dt:0; // ters yöne basınca anında dön (buzda kayarak)
        p.vx+=want*(onIce?PH.iceAcc:PH.accG)*dt;if(Math.abs(p.vx)>maxV)p.vx=Math.sign(p.vx)*maxV;p.dir=want;}
      else{const s=Math.sign(p.vx),d=(onIce?PH.iceDec:PH.decG)*dt;p.vx=Math.abs(p.vx)<=d?0:p.vx-s*d;}
    }else{
      if(want){const before=Math.abs(p.vx);p.vx+=want*(p.vx*want<0?PH.turnA:PH.accA)*dt;
        if(Math.abs(p.vx)>PH.run*spd)p.vx=Math.sign(p.vx)*Math.max(PH.run*spd,Math.min(Math.abs(p.vx),before-PH.decA*dt));p.dir=want;}
      else{const s=Math.sign(p.vx),d=PH.decA*dt;p.vx=Math.abs(p.vx)<=d?0:p.vx-s*d;}
    }
  }
  // rüzgâr
  // ---- zıplama
  if(p.onG){p.coy=PH.coyote;p.jumps=0;p.airDash=true;}else p.coy-=dt;
  if(IN.jp)p.jbuf=PH.buffer;else p.jbuf-=dt;
  if(p.jbuf>0){
    if(IN.d&&p.onG&&(p.ground==='='||p.ground==='X')){p.dropT=.25;p.y+=3;p.jbuf=0;}
    else if(p.coy>0){p.vy=-PH.jump*(1+cst('jump'));p.coy=0;p.jbuf=0;p.jumps=1;p.cutDone=false;p.jt=0;play('okAtma',.22,1.8);dust(p.x,p.y,6);p.squash=.12;}
    else if(p.jumps<2){p.vy=-PH.jump2*(1+cst('jump'));p.jumps=2;p.jbuf=0;p.cutDone=false;p.jt=0;beep(520,.12,'triangle',.07);ring(p.x,p.y-10);}}
  p.jt=(p.jt||0)+dt;
  if(!IN.j&&p.vy<0&&!p.cutDone&&!p.springing&&p.jt>.07){p.vy*=PH.cut;p.cutDone=true;} // erken bırakınca kısa zıplama (en az ~1 karo)
  p.vy+=(p.vy<0?PH.gUp:PH.gDown)*dt;if(p.vy>PH.maxFall)p.vy=PH.maxFall;
  if(p.vy>=0)p.springing=false;
  const wasG=p.onG;p.py=p.y;
  move(p,dt);
  if(p.plat){p.x+=p.plat.vx*dt;p.y=p.plat.y;}
  if(G.wind&&!p.climb)moveX(p,G.wind*(p.onG?.25:.35)*dt);
  if(!wasG&&p.onG){dust(p.x,p.y,5);p.squash=.1;}
  afterMove(p,dt);
}
function afterMove(p,dt){
  // mantar zıplatıcı
  if(p.onG&&p.ground==='j'){p.vy=-PH.spring;p.onG=false;p.jumps=1;p.springing=true;p.airDash=true;boing();
    for(const tr of LV.traps)if(tr.k==='spring'&&Math.abs(tr.x-p.x)<TS)tr.sq=.25;}
  // çöken tahta
  if(p.onG&&p.ground==='X'){const cr=LV.crumbles[p.oneTx+','+p.oneTy];if(cr&&cr.st===0){cr.st=1;cr.t=0;beep(150,.15,'sawtooth',.05);}}
  // dikenler
  const hb=rectOf(p);
  for(let ty=Math.floor(hb.t/TS);ty<=Math.floor((hb.b-1)/TS);ty++)for(let tx2=Math.floor((hb.l+4)/TS);tx2<=Math.floor((hb.r-5)/TS);tx2++){if(tileAt(tx2,ty)==='^'){const top=ty*TS+TS*.5;if(hb.b>top+4){hurtPlayer(1,p.x-p.dir*10,true);return;}}}
  if(p.y>LV.H*TS+TS*2){// çukur
    if(p.hp>1||p.inv>0){p.inv=0;hurtPlayer(1,p.x,true);}else{p.hp=0;killPlayer();updHud();}return;}
  if(p.onG&&!p.plat&&p.ground!=='X'&&p.ground!=='j'){const ftx=Math.floor(p.x/TS),fty=Math.floor((p.y+2)/TS);if(isSolid(ftx,fty)&&isSolid(Math.floor((p.x-20)/TS),fty)&&isSolid(Math.floor((p.x+20)/TS),fty)&&tileAt(ftx,fty-1)!=='^')p.safe={x:p.x,y:p.y};}
  // saldırı ve silah
  if(IN.ap)attack();
  if(IN.wp)switchWeapon();
  // animasyon
  let a;
  if(p.atk>0){p.atk-=dt;a='attack';}
  else if(p.dashT>0)a='run';
  else if(!p.onG)a=p.vy<0?'rise':'fall';
  else if(Math.abs(p.vx)>20)a='run';else a='idle';
  if(a!==p.anim){p.anim=a;p.fi=0;}
  p.fi+=dt*(a==='run'?16*Math.max(.5,Math.abs(p.vx)/PH.run):a==='attack'?P.atkFps||20:10);
}
function attack(){
  const p=P;if(p.atkCd>0||p.climb||!p.wpn)return;
  if(p.wpn==='sword'){const L_=wl('sword');p.atk=.32;p.atkCd=WPN.sword.cd[L_];p.anim='attack';p.fi=0;P.atkFps=24;play('kilic',.7,1+Math.random()*.15);
    const reach=WPN.sword.reach[L_],dmg=WPN.sword.dmg[L_]+cst('dmg'),tier=wtier(L_+1);
    setTimeout(()=>{if(!P||P.dead||!LV)return;const r={l:P.dir>0?P.x-10:P.x-reach,r:P.dir>0?P.x+reach:P.x+10,t:P.y-84,b:P.y-2};
      slashFx(P.x+P.dir*reach*.55,P.y-44,P.dir,tier,reach);hitArea(r,dmg,'sword');
      // ok savuşturma
      for(const pr of LV.proj)if(pr.own==='e'&&overlap(r,{l:pr.x-14,r:pr.x+14,t:pr.y-8,b:pr.y+8})){pr.own='p';pr.vx=-pr.vx*1.3;pr.dmg=2;pr.life=1.2;spark(pr.x,pr.y,'#9fd8ff');beep(1400,.06,'square',.06);}},80);}
  else if(p.wpn==='bow'){if(p.arrows<=0){toast('🏹 0');beep(200,.1);return;}const L_=wl('bow');p.arrows--;p.atk=.38;p.atkCd=.42;p.anim='attack';p.fi=0;P.atkFps=38;
    setTimeout(()=>{if(!P||P.dead||!LV)return;play('okAtma',.8);const dmg=WPN.bow.dmg[L_]+cst('dmg'),pierce=!!WPN.bow.pierce[L_],tier=wtier(L_+1);
      const mk=vy=>LV.proj.push({k:'arrow',x:P.x+P.dir*30,y:P.y-44,vx:P.dir*950,vy,dmg,own:'p',life:1.1,pierce,hit:new Set(),tier});
      mk(0);if(WPN.bow.triple[L_]){mk(-160);mk(160);}},200);}
  else if(p.wpn==='spear'){if(p.spears<=0){toast('🔱 0');beep(200,.1);return;}const L_=wl('spear');p.spears--;p.atk=.4;p.atkCd=.48;p.anim='attack';p.fi=0;P.atkFps=30;
    setTimeout(()=>{if(!P||P.dead||!LV)return;play('mizrak',.8);LV.proj.push({k:'spear',x:P.x+P.dir*30,y:P.y-46,vx:P.dir*780,vy:-70,dmg:WPN.spear.dmg[L_]+cst('dmg'),own:'p',life:1.4,pierce:true,hit:new Set(),tier:wtier(L_+1)});},210);}
  updHud();}
function switchWeapon(){const ws=S.weapons;if(ws.length<2)return;const i=ws.indexOf(P.wpn);P.wpn=ws[(i+1)%ws.length];toast(t(P.wpn));beep(700,.08,'triangle',.08);updHud();}
function hitArea(r,dmg,src){
  let any=false;
  for(const e of LV.enemies){if(e.dead)continue;if(overlap(r,rectOf(e))){if(damageEnemy(e,dmg,src,P.x))any=true;}}
  if(LV.boss&&!LV.boss.dead&&overlap(r,bossRect())){damageBoss(dmg,src);any=true;}
  for(const it of LV.items){if((it.k==='crate'||it.k==='chest'||it.k==='barrel')&&!it.gone&&!it.open&&overlap(r,{l:it.x-30,r:it.x+30,t:it.y-56,b:it.y})){breakItem(it);any=true;}}
  if(any)hitstop=.045;
  return any;}
function damageEnemy(e,dmg,src,fromX){
  if(e.dead||e.hurt>0)return false;
  if(e.type==='h'&&src!=='spear'&&src!=='stomp'&&src!=='dash'){const front=(fromX<e.x?-1:1)===e.dir;if(front){spark(e.x+e.dir*20,e.y-40,'#cfd8ff');beep(900,.06,'square',.08);e.vx=-e.dir*120;return false;}}
  e.hp-=dmg;e.hurt=.25;spark(e.x,e.y-e.h/2,'#ffe28a');play('dusmanYaralama',.6);floatTxt(e.x,e.y-e.h-10,''+dmg,'#fff');
  if(e.hp<=0){e.dead=true;e.st='die';e.fi=0;e.t=0;play(e.type==='k'||e.type==='h'||e.type==='A'?'iskeletOlme':'dusmanYaralama',.7,.9);dropCoins(e.x,e.y-30,ESTAT[e.type].coins);G.kills++;}
  else{e.vx=(e.x<fromX?-1:1)*170;if(e.st==='hang')e.st='fly';}
  return true;}
function breakItem(it){
  if(it.k==='crate'||it.k==='barrel'){it.gone=true;it.breakT=0;play('sandikKirma',.8);dropCoins(it.x,it.y-30,1+Math.floor(Math.random()*3));if(Math.random()<.25)LV.items.push({k:Math.random()<.5?(S.weapons.includes('bow')?'arrows':'potion'):'potion',x:it.x,y:it.y-30,t:0,vy:-300,phys:true});}
  else if(it.k==='chest'){it.hp--;if(it.hp<=0){it.open=true;it.t=0;play('sandikKirma',.8);dropCoins(it.x,it.y-40,14);}else{beep(300,.08);}}}
function dropCoins(x,y,n){for(let i=0;i<n;i++)LV.items.push({k:'coin',x,y,t:Math.random()*8,vx:(Math.random()-.5)*300,vy:-300-Math.random()*250,phys:true,life:9});}

/* ------------------------------ DÜŞMANLAR ------------------------------ */
function updateEnemies(dt){
  for(const e of LV.enemies){
    if(e.dead){e.t+=dt;e.fi+=dt*12;continue;}
    if(e.hurt>0)e.hurt-=dt;
    const dx=P.x-e.x,dy=(P.y-35)-(e.y-e.h/2),near=Math.abs(dx)<TS*7&&Math.abs(dy)<TS*2.5&&!P.dead;
    e.t+=dt;e.cd-=dt;
    // ekrandan çok uzaktaki düşmanlar uyur
    if(Math.abs(dx)>VW*1.2&&e.st!=='fly'){continue;}
    switch(e.type){
      case 's':case 'b':case 'f':case 'g':case 'k':case 'h':{
        const st=ESTAT[e.type];let sp=st.sp;
        if(e.st==='attack'){e.vx=0;e.fi+=dt*18;const n=frameCount(e.ch,'attack');
          if(!e.hitDone&&e.fi>n*.45){e.hitDone=true;const r={l:e.dir>0?e.x:e.x-72,r:e.dir>0?e.x+72:e.x,t:e.y-70,b:e.y};if(overlap(r,rectOf(P)))hurtPlayer(1,e.x);}
          if(e.fi>=n){e.st='walk';e.cd=1.3;}}
        else{
          if((e.type==='b'||e.type==='f')&&near&&Math.abs(dy)<TS&&Math.sign(dx)===e.dir){sp=e.type==='f'?300:260;e.st='run';}else if(e.st==='run')e.st='walk';
          if((e.type==='g'||e.type==='k'||e.type==='h')&&near&&Math.abs(dx)<TS*1.3&&Math.abs(dy)<TS&&e.cd<=0){e.dir=Math.sign(dx)||e.dir;e.st='attack';e.fi=0;e.hitDone=false;break;}
          if((e.type==='k'||e.type==='h'||e.type==='g')&&near&&Math.abs(dy)<TS)e.dir=Math.sign(dx)||e.dir;
          if(e.onG&&(!groundAhead(e,e.dir)||wallAhead(e,e.dir)||hazardAhead(e,e.dir)))e.dir=-e.dir;
          if(e.hurt<=0)e.vx=e.dir*sp;else e.vx*=.9;
          if(e.st!=='run')e.st='walk';e.fi+=dt*(e.st==='run'?18:12);}
        e.vy+=2200*dt;move(e,dt,{});
        break;}
      case 'A':{e.vy+=2200*dt;move(e,dt,{});e.vx=0;
        if(near)e.dir=Math.sign(dx)||e.dir;
        if(e.st==='attack'){e.fi+=dt*16;const n=frameCount('archer','attack');if(!e.hitDone&&e.fi>n*.7){e.hitDone=true;LV.proj.push({k:'earrow',x:e.x+e.dir*28,y:e.y-44,vx:e.dir*430,vy:0,dmg:1,own:'e',life:3});play('okAtma',.4,.8);}if(e.fi>=n){e.st='idle';e.cd=2.4;}}
        else{e.fi+=dt*10;if(near&&Math.abs(dy)<TS*1.2&&e.cd<=0){e.st='attack';e.fi=0;e.hitDone=false;}}
        break;}
      case 'v':{
        if(e.st==='hang'){e.fi+=dt*8;if(Math.abs(dx)<TS*4&&dy>0&&!P.dead)e.st='fly';}
        else{e.fi+=dt*14;const tx=P.x,ty=P.y-50;const a=Math.atan2(ty-e.y,tx-e.x);e.vx+=(Math.cos(a)*ESTAT.v.sp-e.vx)*dt*2;e.vy+=(Math.sin(a)*ESTAT.v.sp-e.vy)*dt*2+Math.sin(e.t*6)*40*dt;
          if(e.hurt>0)e.vx*=.95;e.x+=e.vx*dt;e.y+=e.vy*dt;e.dir=e.vx>0?1:-1;}
        break;}
      case 'e':case 'i':{
        e.fi+=dt*14;e.x=e.ox+Math.sin(e.t*.9)*TS*2;e.y=e.oy+Math.sin(e.t*3)*14;e.dir=Math.cos(e.t*.9)>0?1:-1;
        if(e.type==='i'&&e.cd<=0&&near&&Math.abs(dx)<TS*5){e.cd=2.6;LV.proj.push({k:'ice',x:e.x,y:e.y-10,vx:Math.sign(dx)*360,vy:120,dmg:1,own:'e',life:2.5});beep(1200,.08,'triangle',.05);}
        break;}
      case 'x':{
        if(e.st==='hang'){e.fi+=dt*8;e.y=e.anchorY+Math.sin(e.t*2)*6;if(Math.abs(dx)<TS*1.6&&P.y>e.y&&!P.dead){e.st='drop';e.vy=0;}}
        else if(e.st==='drop'){e.vy+=1800*dt;move(e,dt,{});e.fi+=dt*10;if(e.onG)e.st='walk';}
        else{e.fi+=dt*14;if(near)e.dir=Math.sign(dx)||e.dir;if(e.onG&&(!groundAhead(e,e.dir)||wallAhead(e,e.dir)))e.dir=-e.dir;e.vx=e.hurt>0?e.vx*.9:e.dir*ESTAT.x.sp;e.vy+=2200*dt;move(e,dt,{});}
        break;}
    }
    if(e.y>LV.H*TS+200){e.dead=true;e.t=9;}
    // oyuncuyla temas
    if(!e.dead&&!P.dead&&e.st!=='hang'){
      const pr=rectOf(P),er=rectOf(e);
      const ix=e.w*.18,hr={l:er.l+ix,r:er.r-ix,t:er.t+e.h*.15,b:er.b};
      if(P.dashT>0&&WPN.dash.hit[wl('dash')]&&overlap(pr,er)&&!P.dashHit.has(e)){P.dashHit.add(e);damageEnemy(e,WPN.dash.hit[wl('dash')],'dash',P.x);continue;}
      const fromAbove=P.vy>0&&(P.py??P.y)<=er.t+e.h*.45&&P.y<=er.t+e.h*.6;
      if(overlap(pr,fromAbove?er:hr)){
        if(fromAbove){damageEnemy(e,1+cst('stomp'),'stomp',P.x);P.vy=-PH.stomp;P.jumps=1;P.cutDone=true;P.airDash=true;beep(420,.1,'square',.1);hitstop=.05;}
        else if(e.hurt<=0)hurtPlayer(1,e.x);}}
  }
  LV.enemies=LV.enemies.filter(e=>!(e.dead&&e.t>1.4));
}
function enemyAnim(e){
  const map={s:{walk:'run',idle:'idle'},b:{walk:'walk',run:'run',attack:'attack'},f:{walk:'walk',run:'run',attack:'attack'},g:{walk:'run',attack:'attack'},k:{walk:'run',attack:'attack'},h:{walk:'run',attack:'attack'},A:{idle:'idle',attack:'attack'},v:{hang:'hang',fly:'fly'},e:{idle:'idle'},i:{idle:'idle'},x:{hang:'idle',drop:'idle',walk:'run'}};
  const m=map[e.type];if(e.dead)return 'die';return m[e.st]||m.walk||m.idle||'idle';}

/* ------------------------------ TUZAKLAR ------------------------------ */
function updateTraps(dt){
  for(const tr of LV.traps){
    if(tr.k==='spring'){if(tr.sq>0)tr.sq-=dt;}
    else if(tr.k==='icicle'){
      tr.t+=dt;
      if(tr.st==='hang'){if(!P.dead&&Math.abs(P.x-tr.x)<TS*1.3&&P.y>tr.y&&P.y-tr.y<TS*7){tr.st='shake';tr.t=0;beep(1800,.05,'triangle',.04);}}
      else if(tr.st==='shake'){if(tr.t>.42){tr.st='fall';tr.vy=0;}}
      else if(tr.st==='fall'){tr.vy+=2600*dt;tr.y+=tr.vy*dt;
        if(!P.dead&&overlap({l:tr.x-12,r:tr.x+12,t:tr.y,b:tr.y+56},rectOf(P)))hurtPlayer(1,tr.x);
        if(isSolid(Math.floor(tr.x/TS),Math.floor((tr.y+56)/TS))||tr.y>LV.H*TS){tr.st='gone';tr.t=0;for(let i=0;i<8;i++)LV.parts.push({x:tr.x,y:tr.y+50,vx:(Math.random()-.5)*300,vy:-Math.random()*300,t:0,life:.5,c:'#dff4ff',s:6,g:1});beep(2200,.08,'triangle',.06);}}
      else if(tr.st==='gone'){if(tr.t>4){tr.st='hang';tr.y=tr.oy;tr.t=0;}}}
    else if(tr.k==='crossbow'){
      const dx=P.x-tr.x;tr.t+=dt;
      if(tr.fire>0){tr.fire-=dt;tr.fi+=dt*28;}
      if(tr.t>2.3&&Math.abs(dx)<VW*.7){tr.t=0;tr.fire=.5;tr.fi=0;
        LV.proj.push({k:'bolt',x:tr.x+tr.dir*36,y:tr.y-26,vx:tr.dir*520,vy:0,dmg:1,own:'e',life:3});play('okAtma',.35,.7);}}
  }
  // çöken tahtalar
  for(const k in LV.crumbles){const cr=LV.crumbles[k];if(cr.st===1){cr.t+=dt;if(cr.t>.5){cr.st=2;cr.t=0;cr.gone=1;const [x,y]=k.split(',').map(Number);for(let i=0;i<6;i++)LV.parts.push({x:x*TS+Math.random()*TS,y:y*TS+10,vx:(Math.random()-.5)*120,vy:-Math.random()*100,t:0,life:.7,c:'#8a5a2c',s:8,g:1});play('sandikKirma',.5,1.3);}}
    else if(cr.st===2){cr.t+=dt;if(cr.t>3){const [x,y]=k.split(',').map(Number);const r={l:x*TS,r:x*TS+TS,t:y*TS-70,b:y*TS+8};if(!overlap(r,rectOf(P))){cr.st=0;cr.gone=0;cr.t=0;}}}}
}

/* ------------------------------ BOSS ------------------------------ */
function spawnBoss(){
  const kind=LV.WD.boss,sp=LV.bossSpawn;if(!kind||!sp)return;
  const B={kind,x:sp.x,y:sp.y,vx:0,vy:0,dir:-1,hp:0,maxHp:0,st:'intro',t:0,fi:0,hurt:0,dead:false,w:120,h:110,onG:false,sc:1,tint:null,ch:'bigboar'};
  const set=(ch,hp,w,h,sc,tint)=>{B.ch=ch;B.hp=B.maxHp=hp;B.w=w;B.h=h;B.sc=sc;B.tint=tint||null;};
  if(kind==='bigboar')set('bigboar',14,150,110,1.7);
  if(kind==='slimeking'){set('slime',18,170,110,3,'hue-rotate(40deg) saturate(1.6) brightness(1.1)');}
  if(kind==='goblinchief'){set('goblin',20,80,140,2,'hue-rotate(-30deg) saturate(1.3)');}
  if(kind==='frostqueen'){set('bee',20,110,110,2.4,'hue-rotate(150deg) saturate(.7) brightness(1.3)');B.y=sp.y-TS*3.2;B.homeY=B.y;B.fly=true;}
  if(kind==='spiderqueen'){set('spider',22,150,100,2.4);B.y=2*TS+112;B.ceil=B.y;B.st='ceil';}
  if(kind==='boneking')set('boneking',30,90,150,1);
  LV.boss=B;$('bossbar').style.display='block';$('bossName').textContent=BOSSNAME[kind][lang]||BOSSNAME[kind].en;updBoss();}
function bossRect(){const B=LV.boss;return {l:B.x-B.w/2,r:B.x+B.w/2,t:B.y-B.h,b:B.y};}
function damageBoss(dmg,src){const B=LV.boss;if(B.dead||B.hurt>0||B.st==='intro')return;
  let m=1;if(B.st==='stun'||(B.kind==='spiderqueen'&&B.st==='ground')||(B.kind==='frostqueen'&&B.st==='tired'))m=2;
  B.hp-=dmg*m;B.hurt=.18;spark(B.x,B.y-B.h/2,'#ffe28a');play('dusmanYaralama',.8,.7);shake=Math.max(shake,4);floatTxt(B.x,B.y-B.h-10,''+(dmg*m),m>1?'#ffd96a':'#fff');
  if(B.hp<=0){B.dead=true;B.st='die';B.fi=0;B.t=0;play('iskeletOlme',1,.6);shake=16;hitstop=.25;dropCoins(B.x,B.y-60,30);toast(t('bossDead'));setTimeout(()=>{$('bossbar').style.display='none';},800);
    for(const e of LV.enemies)if(!e.dead){e.dead=true;e.st='die';e.fi=0;e.t=0;}}
  updBoss();}
function updBoss(){const B=LV.boss;if(!B)return;$('bossHp').style.width=Math.max(0,B.hp/B.maxHp*100)+'%';}
function updateBoss(dt){
  const B=LV.boss;if(!B)return;B.t+=dt;if(B.hurt>0)B.hurt-=dt;
  if(B.dead){B.fi+=dt*10;if(B.fly){B.vy+=1800*dt;B.y=Math.min(B.y+B.vy*dt,LV.bossSpawn.y);}return;}
  const dx=P.x-B.x;const rage=B.hp<B.maxHp/2;
  const ground=()=>{B.vy+=2200*dt;move(B,dt,{});};
  switch(B.kind){
  case 'bigboar':
    if(B.st==='intro'){B.fi+=dt*10;if(B.t>1.4){B.st='idle';B.t=0;}}
    else if(B.st==='idle'){B.fi+=dt*10;B.dir=Math.sign(dx)||B.dir;if(B.t>(rage?.7:1.2)){B.st='wind';B.t=0;}}
    else if(B.st==='wind'){B.fi+=dt*14;B.x+=Math.sin(B.t*60)*1.5;if(B.t>.6){B.st='charge';B.t=0;play('karakterDarbeAlma',.6,.5);}}
    else if(B.st==='charge'){B.fi+=dt*20;B.vx=B.dir*(rage?620:500);if(B.hitWall||(Math.abs(B.vx)<1&&B.t>.2)){B.st='stun';B.t=0;shake=14;play('sandikKirma',1,.6);dropCoins(B.x,B.y-120,2);if(rage)spawnEnemy(LV,'b',B.x-B.dir*200,B.y);}}
    else if(B.st==='stun'){B.fi+=dt*6;B.vx=0;if(B.t>(rage?1.5:2.1)){B.st='idle';B.t=0;}}
    if(B.st!=='charge')B.vx*=.8;ground();break;
  case 'slimeking':
    if(B.st==='intro'){B.fi+=dt*8;if(B.t>1.4){B.st='sit';B.t=0;}}
    else if(B.st==='sit'){B.fi+=dt*8;B.vx=0;if(B.t>(rage?.8:1.3)){B.st='hop';B.t=0;B.vy=-1050;B.dir=Math.sign(dx)||B.dir;B.vx=Math.max(-420,Math.min(420,dx*1.0));}}
    else if(B.st==='hop'){B.fi+=dt*12;if(B.onG&&B.t>.1){B.st='land';B.t=0;shake=12;play('sandikKirma',.9,.5);
        for(const s of [-1,1])LV.proj.push({k:'wave',x:B.x+s*70,y:B.y-12,vx:s*(rage?420:340),vy:0,dmg:1,own:'e',life:2.2,ground:true});
        if(rage&&LV.enemies.filter(e=>!e.dead).length<4)for(const s of [-1,1])spawnEnemy(LV,'s',B.x+s*110,B.y);}}
    else if(B.st==='land'){B.vx=0;B.fi+=dt*6;if(B.t>.7){B.st='stun';B.t=0;}}
    else if(B.st==='stun'){B.fi+=dt*4;if(B.t>(rage?.6:1.1)){B.st='sit';B.t=0;}}
    ground();break;
  case 'goblinchief':
    if(B.st==='intro'){B.fi+=dt*8;if(B.t>1.4){B.st='walk';B.t=0;}}
    else if(B.st==='walk'){B.fi+=dt*12;B.dir=Math.sign(dx)||B.dir;B.vx=B.dir*(rage?170:120);
      if(B.t>(rage?1.4:2)){B.st=Math.abs(dx)<TS*3?'stab':'throw';B.t=0;B.fi=0;B.done=false;B.vx=0;}}
    else if(B.st==='throw'){B.vx=0;B.fi+=dt*14;if(!B.done&&B.t>.45){B.done=true;const n=rage?4:3;for(let i=0;i<n;i++){const tx=P.x+(i-(n-1)/2)*TS*1.6;const tt=.9;LV.proj.push({k:'gspear',x:B.x,y:B.y-120,vx:(tx-B.x)/tt,vy:-600,g:1300,dmg:1,own:'e',life:3});}play('mizrak',.8,.8);}
      if(B.t>1.1){B.st='walk';B.t=0;if(rage&&LV.enemies.filter(e=>!e.dead).length<3)spawnEnemy(LV,'g',B.x-B.dir*220,B.y);}}
    else if(B.st==='stab'){B.fi+=dt*16;if(B.t<.5){B.vx=0;}else if(B.t<.9){B.vx=B.dir*620;if(!B.done){const r={l:B.dir>0?B.x:B.x-110,r:B.dir>0?B.x+110:B.x,t:B.y-120,b:B.y};if(overlap(r,rectOf(P))){hurtPlayer(1,B.x);B.done=true;}}if(B.hitWall){B.st='stun';B.t=0;shake=10;}}else{B.st='stun';B.t=0;}}
    else if(B.st==='stun'){B.vx=0;B.fi+=dt*5;if(B.t>1.4){B.st='walk';B.t=0;}}
    ground();break;
  case 'frostqueen':{
    const hy=B.homeY;
    if(B.st==='intro'){B.fi+=dt*12;B.y=hy+Math.sin(B.t*3)*10;if(B.t>1.4){B.st='hover';B.t=0;}}
    else if(B.st==='hover'){B.fi+=dt*14;const tx=P.x+Math.sin(B.t*.8)*TS*3;B.x+=(tx-B.x)*dt*1.2;B.y=hy+Math.sin(B.t*3)*14;B.dir=dx>0?1:-1;
      if(B.cd==null)B.cd=1.5;B.cd-=dt;
      if(B.cd<=0){B.cd=rage?1.4:2.1;for(const a of [-0.45,0,0.45]){const ang=Math.atan2(P.y-40-B.y,dx)+a;LV.proj.push({k:'ice',x:B.x,y:B.y-30,vx:Math.cos(ang)*380,vy:Math.sin(ang)*380,dmg:1,own:'e',life:3});}beep(1300,.1,'triangle',.06);}
      if(B.t>(rage?3.2:4.5)){B.st='aim';B.t=0;}}
    else if(B.st==='aim'){B.fi+=dt*20;B.x+=Math.sin(B.t*50)*2;if(B.t>.6){B.st='swoop';B.t=0;B.tx=P.x;B.sy=B.y;B.sx=B.x;}}
    else if(B.st==='swoop'){B.fi+=dt*18;const k=Math.min(1,B.t/.75);B.x=B.sx+(B.tx-B.sx)*k;B.y=B.sy+(LV.bossSpawn.y-10-B.sy)*Math.sin(k*Math.PI/2);if(k>=1){B.st='tired';B.t=0;shake=8;}}
    else if(B.st==='tired'){B.fi+=dt*5;if(B.t>1.6){B.st='rise';B.t=0;}}
    else if(B.st==='rise'){B.fi+=dt*12;B.y-=420*dt;if(B.y<=hy){B.y=hy;B.st='hover';B.t=0;}}
    break;}
  case 'spiderqueen':
    if(B.st==='ceil'){B.fi+=dt*10;B.vx=(P.x>B.x?1:-1)*(rage?190:140);B.x+=B.vx*dt;B.y=B.ceil+Math.sin(B.t*3)*8;B.dir=B.vx>0?1:-1;
      if(B.t>(rage?1.8:2.8)&&Math.abs(dx)<60){B.st='drop';B.t=0;B.vy=0;}
      if(rage&&B.t>1&&B.t-dt<=1)LV.proj.push({k:'web',x:B.x,y:B.y,vx:0,vy:420,dmg:1,own:'e',life:2});}
    else if(B.st==='drop'){B.vy+=2400*dt;B.vx=0;move(B,dt,{});if(B.onG){B.st='ground';B.t=0;shake=14;play('sandikKirma',1,.5);const s1=spawnEnemy(LV,'x',B.x-90,B.y);s1.st='walk';if(rage){const s2=spawnEnemy(LV,'x',B.x+90,B.y);s2.st='walk';}}}
    else if(B.st==='ground'){B.fi+=dt*8;if(B.t>2.6){B.st='up';B.t=0;}}
    else if(B.st==='up'){B.fi+=dt*10;B.y-=380*dt;if(B.y<=B.ceil){B.y=B.ceil;B.st='ceil';B.t=0;}}
    break;
  case 'boneking':
    if(B.st==='intro'){B.fi+=dt*10;if(B.t>1.5){B.st='walk';B.t=0;}}
    else if(B.st==='walk'){B.fi+=dt*12;B.dir=Math.sign(dx)||B.dir;B.vx=B.dir*(rage?150:105);
      if(Math.abs(dx)<120&&B.t>.6){B.st='attack';B.t=0;B.fi=0;B.hit=false;}
      else if(B.t>(rage?2.2:3.2)){B.st='dashw';B.t=0;B.fi=0;}}
    else if(B.st==='attack'){B.vx=0;B.fi+=dt*16;const n=frameCount('boneking','attack');if(!B.hit&&B.fi>n*.55){B.hit=true;shake=10;const r={l:B.dir>0?B.x:B.x-150,r:B.dir>0?B.x+150:B.x,t:B.y-150,b:B.y};if(overlap(r,rectOf(P)))hurtPlayer(1,B.x);
        if(rage)for(const s of [-1,1])LV.proj.push({k:'wave',x:B.x+s*60,y:B.y-12,vx:s*380,vy:0,dmg:1,own:'e',life:2,ground:true});}
      if(B.fi>=n){B.st='walk';B.t=0;}}
    else if(B.st==='dashw'){B.vx=0;B.fi+=dt*8;if(B.t>.7){B.st='dash';B.t=0;B.fi=0;}}
    else if(B.st==='dash'){B.fi+=dt*16;B.vx=B.dir*(rage?720:570);if(B.hitWall||B.t>1.2){B.st='stun';B.t=0;B.fi=0;shake=12;if(rage&&LV.enemies.filter(e=>!e.dead).length<3)for(let i=0;i<2;i++)spawnEnemy(LV,'k',B.x-B.dir*(150+i*80),B.y);}}
    else if(B.st==='stun'){B.vx=0;B.fi+=dt*10;if(B.t>1.8){B.st='walk';B.t=0;}}
    ground();break;
  }
  // temas
  if(!P.dead&&B.st!=='intro'&&overlap(rectOf(P),bossRect())){
    const top=bossRect().t;
    if(P.dashT>0&&WPN.dash.hit[wl('dash')]&&!P.dashHit.has(B)){P.dashHit.add(B);damageBoss(WPN.dash.hit[wl('dash')],'dash');}
    else if(P.vy>0&&(P.py??P.y)<=top+40){damageBoss(1+cst('stomp'),'stomp');P.vy=-PH.stomp-80;P.jumps=1;P.cutDone=true;P.airDash=true;hitstop=.06;}
    else hurtPlayer(1,B.x);}
}
function bossAnim(B){
  switch(B.kind){
    case 'bigboar':return B.dead?'die':B.st==='charge'?'run':B.st==='wind'?'attack':'idle';
    case 'slimeking':return B.dead?'die':B.st==='hop'?'run':'idle';
    case 'goblinchief':return B.dead?'die':B.st==='walk'?'run':(B.st==='throw'||B.st==='stab')?'attack':'idle';
    case 'frostqueen':return B.dead?'die':(B.st==='aim'||B.st==='swoop')?'attack':'idle';
    case 'spiderqueen':return B.dead?'die':B.st==='ground'?'attack':'idle';
    default:return B.dead?'die':B.st==='attack'?'attack':B.st==='dash'||B.st==='dashw'?'dash':B.st==='stun'?'stun':B.st==='walk'?'run':'idle';}}

/* ------------------------------ MERMİLER ------------------------------ */
function updateProj(dt){
  for(const p of LV.proj){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.k==='spear')p.vy+=200*dt;if(p.g)p.vy+=p.g*dt;
    if(p.ground){// yer dalgası: zemin üstünde kayar, duvara çarpınca söner
      if(isSolid(Math.floor((p.x+Math.sign(p.vx)*20)/TS),Math.floor((p.y-10)/TS))){p.life=0;continue;}
      if(Math.random()<.5)LV.parts.push({x:p.x,y:p.y+8,vx:(Math.random()-.5)*60,vy:-120-Math.random()*80,t:0,life:.35,c:LV.wi===5?'#b08cff':'#c9b28a',s:6,g:1});}
    else if(isSolid(Math.floor(p.x/TS),Math.floor(p.y/TS))){p.life=0;spark(p.x,p.y,p.k==='ice'?'#dff4ff':'#d9c3a0');continue;}
    const r={l:p.x-14,r:p.x+14,t:p.y-(p.ground?40:8),b:p.y+8};
    if(p.own==='p'){
      for(const e of LV.enemies){if(e.dead)continue;if(p.hit&&p.hit.has(e))continue;if(overlap(r,rectOf(e))){const ok=damageEnemy(e,p.dmg,p.k,p.x-p.vx);if(p.hit)p.hit.add(e);if(!p.pierce){p.life=0;break;}}}
      if(LV.boss&&!LV.boss.dead&&p.life>0&&overlap(r,bossRect())&&!(p.hit&&p.hit.has(LV.boss))){damageBoss(p.dmg,p.k);if(p.hit)p.hit.add(LV.boss);if(!p.pierce)p.life=0;}
      for(const it of LV.items){if((it.k==='crate'||it.k==='chest'||it.k==='barrel')&&!it.gone&&!it.open&&overlap(r,{l:it.x-30,r:it.x+30,t:it.y-56,b:it.y})){breakItem(it);if(!p.pierce)p.life=0;}}
    }else if(!P.dead&&overlap(r,rectOf(P))){hurtPlayer(p.dmg,p.x-p.vx);if(!p.ground)p.life=0;}}
  LV.proj=LV.proj.filter(p=>p.life>0);}

/* ------------------------------ EŞYALAR ------------------------------ */
function magnetR(){return (S.up.magnet?S.up.magnet*90+60:0)+cst('magnet');}
function updateItems(dt){
  const mag=magnetR();
  for(const it of LV.items){it.t+=dt;if(it.gone){if(it.breakT!=null)it.breakT+=dt;continue;}
    if(it.phys||it.vy){it.vy=(it.vy||0)+1600*dt;it.x+=(it.vx||0)*dt;it.y+=it.vy*dt;it.vx=(it.vx||0)*.98;
      const ty=Math.floor(it.y/TS),tx=Math.floor(it.x/TS);if((isSolid(tx,ty)||isOneWay(tx,ty))&&it.vy>0){it.y=ty*TS-2;it.vy=-it.vy*.35;if(Math.abs(it.vy)<60){it.vy=0;it.phys=false;}it.vx*=.6;}
      if(it.life!=null){it.life-=dt;if(it.life<=0)it.gone=true;}}
    const px=P.x,py=P.y-35;const d=Math.hypot(it.x-px,it.y-py);
    if(it.k==='coin'&&mag&&d<mag&&!P.dead){it.x+=(px-it.x)*dt*8;it.y+=(py-it.y)*dt*8;}
    if(P.dead)continue;
    const reach=it.k==='chick'?48:42;
    if(d<reach||(it.k==='chick'&&Math.abs(it.x-px)<38&&Math.abs(it.y-35-py)<52)){
      switch(it.k){
        case 'coin':it.gone=true;G.coins+=1+cst('gold');play('mucevherToplama',.45,1+Math.random()*.2);LV.fx.push({k:'pick',x:it.x,y:it.y,t:0});break;
        case 'chick':it.gone=true;G.chicks++;play('canAlma',.8);toast('🐥 '+t('chickGot'));floatTxt(it.x,it.y-50,'🐥','#fff');vib(30);for(let i=0;i<12;i++)LV.parts.push({x:it.x,y:it.y-30,vx:(Math.random()-.5)*300,vy:-Math.random()*300,t:0,life:.7,c:['#ffe066','#fff3b0','#ffb84d'][i%3],s:7,g:1});break;
        case 'potion':if(P.hp<maxHearts()){it.gone=true;P.hp++;play('saglikToplama',.9);floatTxt(it.x,it.y-30,'+❤','#ff6b5e');}break;
        case 'arrows':it.gone=true;P.arrows+=5;play('saglikToplama',.6,1.2);floatTxt(it.x,it.y-30,'+5 🏹','#ffe28a');break;
        case 'spears':it.gone=true;P.spears+=2;play('saglikToplama',.6,1.2);floatTxt(it.x,it.y-30,'+2 🔱','#ffe28a');break;
        case 'key':it.gone=true;P.hasKey=true;play('canAlma',.7,1.3);toast('🔑 '+t('keyGot'));break;
        case 'weapon':it.gone=true;gainWeapon(it.wpn);break;
        case 'dashorb':it.gone=true;if(!S.dash){S.dash=true;save();}play('canAlma',1,1.2);cardMsg('⇢ '+t('dash').toUpperCase(),t('tutDash'),null);break;
        case 'fire':if(!it.lit){it.lit=true;P.cp={x:it.x,y:it.y};play('saglikToplama',.7,.8);toast('🔥 '+t('checkpoint'));if(P.hp<maxHearts())P.hp=maxHearts();LV.lights.push({x:it.x,y:it.y-40,r:260,k:'fire'});}break;
      }updHud();}
  }
  LV.items=LV.items.filter(it=>!(it.gone&&((it.k!=='crate'&&it.k!=='barrel')||it.breakT>.8)&&it.k!=='chest'));
  // kapılar
  if(P.hasKey){const tx=Math.floor(P.x/TS),ty=Math.floor((P.y-30)/TS);for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)if(tileAt(tx+dx,ty+dy)==='D')openDoor(tx+dx,ty+dy);}
  else{const tx=Math.floor((P.x+P.dir*30)/TS),ty=Math.floor((P.y-30)/TS);if(tileAt(tx,ty)==='D'&&!G.doorHint){G.doorHint=true;toast('🔒 '+t('needKey'));setTimeout(()=>{if(G)G.doorHint=false;},3000);}}
  // tabelalar
  for(const s of LV.signs){const near=Math.abs(P.x-s.x)<TS*1.6&&Math.abs(P.y-s.y)<TS*2;s.show=Math.max(0,Math.min(1,s.show+(near?dt*5:-dt*4)));}
  // çıkış
  const ex=LV.exit;if(ex&&!ex.lit&&Math.abs(P.x-ex.x)<44&&Math.abs(P.y-ex.y)<80&&!P.dead){
    if(LV.boss&&!LV.boss.dead){if(!G.lockHint){G.lockHint=true;toast(t('lanternLocked'));setTimeout(()=>{if(G)G.lockHint=false;},2500);}}
    else{ex.lit=true;winLevel();}}
}
function openDoor(tx,ty){const q=[[tx,ty]];while(q.length){const [x,y]=q.pop();if(tileAt(x,y)!=='D')continue;LV.g[y][x]='.';burst(x*TS+TS/2,y*TS+TS/2,10,'#c8a070');q.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);}
  play('sandikKirma',.9,.8);P.hasKey=false;updHud();}
function gainWeapon(w){if(!w)return;if(!S.weapons.includes(w)){S.weapons.push(w);save();}P.wpn=w;play('canAlma',1,.9);
  const k=w==='sword'?'gotSword':w==='bow'?'gotBow':'gotSpear';cardMsg(t(k),t(k+'X'),w);updHud();}

/* ------------------------------ PARÇACIK ------------------------------ */
function dust(x,y,n){const c=LV.wi===3?'#e8f4ff':LV.wi>=4?'#9a8aa0':'#c9b28a';for(let i=0;i<n;i++)LV.parts.push({x:x+(Math.random()-.5)*20,y:y-4,vx:(Math.random()-.5)*120,vy:-Math.random()*80,t:0,life:.4,c,s:5});}
function spark(x,y,c){for(let i=0;i<10;i++){const a=Math.random()*6.28,v=150+Math.random()*250;LV.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:0,life:.35,c,s:4});}}
function burst(x,y,n,c){for(let i=0;i<n;i++){const a=Math.random()*6.28,v=80+Math.random()*200;LV.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-100,t:0,life:.6,c,s:6,g:1});}}
function ring(x,y){LV.fx.push({k:'ring',x,y,t:0});}
function slashFx(x,y,dir,tier,reach){LV.fx.push({k:'slash',x,y,dir,t:0,tier:tier||0,r:reach||80});if(tier>=2)for(let i=0;i<4+tier*3;i++)LV.parts.push({x:x+dir*(Math.random()*40-10),y:y+(Math.random()-.5)*70,vx:dir*(80+Math.random()*200),vy:(Math.random()-.5)*160,t:0,life:.35,c:TIERC[tier],s:5});}
function floatTxt(x,y,s,c){LV.floats.push({x,y,s,c,t:0});}
let shake=0,flash=0,hitstop=0;

/* ------------------------------ KAMERA ------------------------------ */
const cam={x:0,y:0,la:0,gy:0};
function updateCam(dt,snap){
  if(window.__camLock){cam.x=window.__camLock.x;cam.y=window.__camLock.y;return;}
  // yatay: ileri bakma yok; oyuncu ekran ortasındaki dar bölgeden çıkınca kamera onu sabit şekilde izler.
  // Yön değiştirmek sahneyi kaydırmaz.
  const dz=VW*.05;
  if(snap){cam.gy=P.y;cam.x=P.x-VW/2;}
  else{const c=cam.x+VW/2;if(P.x>c+dz)cam.x=P.x-dz-VW/2;else if(P.x<c-dz)cam.x=P.x+dz-VW/2;}
  // dikey: zıplarken sahne zıplamasın; yere basınca, tırmanırken, düşerken ya da çok yükselince takip et
  if(snap||P.onG||P.climb||P.dead)cam.gy=P.y;else if(P.y>cam.gy)cam.gy=P.y;else if(P.y<cam.gy-VIEW_H*.34)cam.gy=P.y+VIEW_H*.34;
  const ty=cam.gy-VIEW_H*.64;
  if(snap){cam.y=ty;}else{const k=P.vy>500?8:3.2;cam.y+=(ty-cam.y)*Math.min(1,dt*k);}
  cam.x=Math.max(0,Math.min(cam.x,LV.W*TS-VW));cam.y=Math.max(-TS*2,Math.min(cam.y,LV.H*TS-VIEW_H+TS*.5));
  if(LV.W*TS<VW)cam.x=(LV.W*TS-VW)/2;}

/* ------------------------------ HAVA ------------------------------ */
const WX=[];
function updWeather(dt){
  const w=LV.WD.weather;const want={petal:26,sun:22,leaf:G.wind?70:30,snow:G.storm>0?160:80,drip:24,ember:40}[w]||0;
  while(WX.length<want)WX.push(newFlake(w,true));
  if(WX.length>want)WX.length=want;
  for(const f of WX){f.t+=dt;
    switch(w){
      case 'petal':f.x+=(30+Math.sin(f.t*2+f.s)*40)*dt;f.y+=(40+f.s*8)*dt;f.r+=dt*2;break;
      case 'sun':f.y-=(10+f.s*4)*dt;f.x+=Math.sin(f.t+f.s)*10*dt;break;
      case 'leaf':f.x+=((G.wind||0)*.5+20+Math.sin(f.t*2+f.s)*50)*dt;f.y+=(60+f.s*10)*dt;f.r+=dt*(3+f.s);break;
      case 'snow':f.x+=(Math.sin(f.t+f.s)*20+(G.storm>0?-260:-20))*dt;f.y+=(70+f.s*25+(G.storm>0?120:0))*dt;break;
      case 'drip':f.y+=(f.v=(f.v||0)+900*dt)*dt;break;
      case 'ember':f.y-=(40+f.s*15)*dt;f.x+=Math.sin(f.t*3+f.s)*30*dt;break;}
    if(f.y>VIEW_H+20||f.y<-30||f.x<-40||f.x>VW+40)Object.assign(f,newFlake(w,false));}
}
function newFlake(w,anywhere){const f={x:Math.random()*VW,y:anywhere?Math.random()*VIEW_H:-10,s:Math.random()*3,t:Math.random()*10,r:Math.random()*6,v:0};
  if(w==='sun'||w==='ember')f.y=anywhere?Math.random()*VIEW_H:VIEW_H+10;
  if(w==='leaf'&&!anywhere&&G.wind>0)f.x=-20,f.y=Math.random()*VIEW_H*.8;
  if(w==='snow'&&!anywhere&&G.storm>0)f.x=VW+20,f.y=Math.random()*VIEW_H;
  return f;}
function drawWeather(){
  const w=LV.WD.weather;
  for(const f of WX){
    switch(w){
      case 'petal':cx.fillStyle=f.s>1.5?'#ffd3e8':'#fff';cx.save();cx.translate(f.x,f.y);cx.rotate(f.r);cx.fillRect(-4,-2,8,4);cx.restore();break;
      case 'sun':cx.fillStyle='rgba(255,240,170,'+(.25+.25*Math.sin(f.t*2+f.s))+')';cx.beginPath();cx.arc(f.x,f.y,2+f.s,0,7);cx.fill();break;
      case 'leaf':cx.fillStyle=['#e8833a','#c94f2a','#f2b04a'][Math.floor(f.s)];cx.save();cx.translate(f.x,f.y);cx.rotate(f.r);cx.beginPath();cx.ellipse(0,0,7,3.5,0,0,7);cx.fill();cx.restore();break;
      case 'snow':cx.fillStyle='rgba(255,255,255,.9)';cx.beginPath();cx.arc(f.x,f.y,1.5+f.s*.8,0,7);cx.fill();break;
      case 'drip':cx.fillStyle='rgba(140,180,230,.6)';cx.fillRect(f.x,f.y,2,7);break;
      case 'ember':cx.fillStyle='rgba(255,'+(120+f.s*40|0)+',60,'+(.5+.4*Math.sin(f.t*5))+')';cx.fillRect(f.x,f.y,3,3);break;}
  }
  if(G.storm>0){cx.fillStyle='rgba(235,245,255,'+(.32*Math.min(1,G.storm*2))+')';cx.fillRect(0,0,VW,VIEW_H);}
  if(w==='sun'){const g=cx.createRadialGradient(VW*.85,-40,10,VW*.85,-40,VIEW_H*.9);g.addColorStop(0,'rgba(255,240,180,.35)');g.addColorStop(1,'rgba(255,240,180,0)');cx.fillStyle=g;cx.fillRect(0,0,VW,VIEW_H);}
}

/* ------------------------------ DÜNYA ÇİZİMİ ------------------------------ */
function drawBackground(){
  const WD=LV.WD;
  const gr=cx.createLinearGradient(0,0,0,VIEW_H);gr.addColorStop(0,WD.sky[0]);gr.addColorStop(1,WD.sky[1]);cx.fillStyle=gr;cx.fillRect(0,0,VW,VIEW_H);
  const layers=BGL[WD.bg];const fac=[.5,.36,.24,.12,.04];
  // arka planın dikey konumu: kamera yerdeyken alt kenar ekranın altına oturur; kamera yükselince katmanlar az miktarda kayar
  const base=LV.groundY-VIEW_H*.64;const dy=cam.y-base;
  for(let i=layers.length-1;i>=0;i--){const im=tinted(layers[i],Array.isArray(WD.bgTint)?WD.bgTint[i]:WD.bgTint);if(!im)continue;const h=VIEW_H*1.02;const s=h/im.height;const iw=im.width*s;
    let ox=-(cam.x*fac[i])%iw;if(ox>0)ox-=iw;
    const oy=VIEW_H-h+TS*.6-dy*fac[i]*.9;
    for(let x=ox;x<VW;x+=iw-1)cx.drawImage(im,Math.round(x),Math.round(oy),Math.ceil(iw),Math.ceil(h));
    if(oy+h<VIEW_H){cx.fillStyle=WD.fill[i];cx.fillRect(0,oy+h-2,VW,VIEW_H-(oy+h)+4);}}
}
function drawWorld(dt){
  const WD=LV.WD,tk=WD.tiles;
  drawBackground();
  cx.save();
  let sx=0,sy=0;if(shake>0){sx=(Math.random()-.5)*shake;sy=(Math.random()-.5)*shake;shake=Math.max(0,shake-dt*40);}
  cx.translate(-Math.round(cam.x)+sx,-Math.round(cam.y)+sy);
  const x0=Math.max(0,Math.floor(cam.x/TS)-1),x1=Math.min(LV.W-1,Math.ceil((cam.x+VW)/TS)+1),y0=Math.max(0,Math.floor(cam.y/TS)-1),y1=Math.min(LV.H-1,Math.ceil((cam.y+VIEW_H)/TS)+1);
  // mağara/kale arka duvarı
  if(WD.dark&&IMG.wall_cave){const wi=tinted('wall_cave',WD.tint);cx.globalAlpha=.5;for(let y=Math.floor(cam.y/wi.height)*wi.height;y<cam.y+VIEW_H;y+=wi.height)for(let x=Math.floor(cam.x/wi.width)*wi.width;x<cam.x+VW;x+=wi.width)cx.drawImage(wi,x,y);cx.globalAlpha=1;}
  // süsler (arkada)
  for(const d of LV.decos){if(d.x<cam.x-300||d.x>cam.x+VW+300)continue;
    if(d.fx){if(d.fx==='crow'){const fl=Math.sin(G.time*1.3+d.ph)>.6;drawFrame('fx','crow',fl?G.time*14:0,d.x,d.y,false,1);}else drawFrame('fx',d.fx,G.time*10,d.x,d.y,false,1,null,WD.id==='castle'&&d.fx==='torch'?null:null);continue;}
    const im=tinted(d.n,WD.tint);if(!im)continue;cx.drawImage(im,d.x-im.width/2,d.y-im.height+4);}
  // karolar
  const at=tinted('tiles_'+tk,WD.tint),keys=SPR.tiles.keys;const sw=SPR.tiles[tk+'_spikeW'];
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const ch=LV.g[y][x];
    if(ch==='#'||ch==='I'){const k=LV.cell[y][x];const n=keys.indexOf(k);cx.drawImage(at,n*64,0,64,64,x*TS,y*TS,TS,TS);
      if(ch==='I'&&(k[0]==='T')){cx.fillStyle='rgba(200,235,255,.55)';cx.fillRect(x*TS,y*TS+2,TS,12);cx.fillStyle='rgba(255,255,255,.75)';cx.fillRect(x*TS+6+(x*13%30),y*TS+4,14,3);}}
    else if(ch==='='||ch==='X'){
      let dy2=0,alpha=1;if(ch==='X'){const cr=LV.crumbles[x+','+y];if(cr.gone){continue;}if(cr.st===1){dy2=Math.sin(G.time*70)*2;}}
      const l=LV.g[y][x-1]!==ch,r=LV.g[y][x+1]!==ch;const k=l?'PL':r?'PR':(x%2?'P1':'P2');const n=keys.indexOf(k),n2=keys.indexOf('Q'+k.slice(1));
      cx.drawImage(at,n*64,0,64,64,x*TS+dy2,y*TS,TS,TS*.62);cx.drawImage(at,n2*64,0,64,64,x*TS+dy2,y*TS+TS*.62,TS,TS*.5);
      if(ch==='X'){cx.strokeStyle='rgba(40,20,5,.8)';cx.lineWidth=2;cx.beginPath();cx.moveTo(x*TS+18+dy2,y*TS+4);cx.lineTo(x*TS+26+dy2,y*TS+16);cx.lineTo(x*TS+20+dy2,y*TS+28);cx.moveTo(x*TS+44+dy2,y*TS+6);cx.lineTo(x*TS+38+dy2,y*TS+20);cx.stroke();}}
    else if(ch==='^'){cx.drawImage(at,0,64,sw,64,x*TS-2,y*TS+4,TS+4,TS);}
    else if(ch==='H'){drawLadder(x*TS,y*TS);}
    else if(ch==='D'){drawDoor(x*TS,y*TS);}
    else if(ch==='j'){drawMushroom(x*TS+TS/2,(y+1)*TS);}}
  // hareketli platformlar
  for(const p of LV.plats){const n=keys.indexOf('PL'),r=keys.indexOf('PR');cx.drawImage(at,n*64,0,64,64,p.x,p.y-4,TS,TS*.55);cx.drawImage(at,r*64,0,64,64,p.x+TS,p.y-4,TS,TS*.55);}
  // tuzaklar
  for(const tr of LV.traps){
    if(tr.k==='icicle'&&tr.st!=='gone'){const sh=tr.st==='shake'?Math.sin(G.time*80)*3:0;cx.save();cx.translate(tr.x+sh,tr.y);cx.fillStyle='#e6f6ff';cx.strokeStyle='#8cc4e8';cx.lineWidth=2;cx.beginPath();cx.moveTo(-14,0);cx.lineTo(14,0);cx.lineTo(2,56);cx.lineTo(-2,56);cx.closePath();cx.fill();cx.stroke();cx.fillStyle='rgba(255,255,255,.8)';cx.fillRect(-6,4,3,30);cx.restore();}
    else if(tr.k==='crossbow'){drawFrame('fx','crossbow',tr.fire>0?tr.fi:0,tr.x,tr.y-8,tr.dir>0,1);}
  }
  // tabelalar
  for(const s of LV.signs){const im=tinted('sign',WD.tint);if(im)cx.drawImage(im,s.x-im.width/2,s.y-im.height+4);
    if(s.show>0)drawBubble(s.x,s.y-(im?im.height:60)-14,(SIGNS[lang]||SIGNS.en)[s.n%15],s.show);}
  // eşyalar
  for(const it of LV.items)drawItem(it);
  // çıkış feneri
  if(LV.exit){const ex=LV.exit;const im=IMG.lantern_on;if(im){const s=1.1;cx.save();if(!ex.lit&&LV.boss&&!LV.boss.dead)cx.filter='grayscale(1) brightness(.5)';else if(!ex.lit)cx.filter='brightness(.8)';cx.drawImage(im,ex.x-im.width*s/2,ex.y-im.height*s,im.width*s,im.height*s);cx.restore();
    const glow=ex.lit?1:(LV.boss&&!LV.boss.dead?0:.35+.25*Math.sin(G.time*4));if(glow>0){const g2=cx.createRadialGradient(ex.x,ex.y-im.height*s*.75,4,ex.x,ex.y-im.height*s*.75,130);g2.addColorStop(0,'rgba(255,220,120,'+(.6*glow)+')');g2.addColorStop(1,'rgba(255,200,80,0)');cx.fillStyle=g2;cx.fillRect(ex.x-140,ex.y-im.height*s*.75-140,280,280);}}}
  // düşmanlar
  for(const e of LV.enemies){if(e.x<cam.x-200||e.x>cam.x+VW+200)continue;const a=enemyAnim(e);const flipBase=SPR.chars[e.ch].faceLeft?e.dir>0:e.dir<0;
    if(e.type==='x'&&e.st==='hang'){cx.strokeStyle='rgba(230,230,230,.7)';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(e.x,e.y-50);let ty=e.y;while(ty>0&&!isSolid(Math.floor(e.x/TS),Math.floor((ty-1)/TS)))ty-=TS;cx.lineTo(e.x,Math.floor(ty/TS)*TS);cx.stroke();}
    const img=e.tint?tinted(SPR.chars[e.ch].img,e.tint):null;
    drawFrame(e.ch,a,e.fi,e.x,e.y+2,flipBase,1,e.dead?1-(e.t-.6)/.8:null,e.hurt>0?'brightness(2.4)':null,img);}
  // boss
  if(LV.boss){const B=LV.boss;const flip=SPR.chars[B.ch].faceLeft?B.dir>0:B.dir<0;const img=B.tint?tinted(SPR.chars[B.ch].img,B.tint):null;
    let sc=B.sc;if(B.kind==='slimeking'&&B.st==='land')sc*=1+.08*Math.sin(B.t*30)*Math.max(0,1-B.t*2);
    if(B.kind==='spiderqueen'&&(B.st==='ceil'||B.st==='up')){cx.strokeStyle='rgba(230,230,230,.6)';cx.lineWidth=3;cx.beginPath();cx.moveTo(B.x,B.y-80);cx.lineTo(B.x,0);cx.stroke();}
    drawFrame(B.ch,bossAnim(B),B.fi,B.x,B.y+2,flip,sc,B.dead?1-(B.t-1)/1.5:null,B.hurt>0?'brightness(2.2)':((B.st==='stun'||B.st==='tired')?'saturate(.4)':null),img);
    if((B.st==='stun'||B.st==='tired')&&!B.dead){cx.font='30px system-ui';cx.textAlign='center';cx.fillText('💫',B.x,B.y-B.h-10+Math.sin(G.time*8)*4);}}
  // atılma izi
  LV.trail=LV.trail.filter(tr=>(tr.t+=dt)<.18);
  for(const tr of LV.trail){drawFrame('player',tr.f+'_run',tr.fi,tr.x,tr.y+2,tr.dir<0,1,.35*(1-tr.t/.18),'brightness(1.8) saturate(.3)',playerImg());}
  // oyuncu
  if(P){const blink=P.inv>0&&P.dashT<=0&&Math.floor(P.inv*14)%2===0;if(!blink){const f=form();const a=P.climb?'pl_climb':(f+'_'+P.anim);
      const name=SPR.chars.player.anims[a]?a:f+'_idle';
      cx.save();if(P.squash>0&&P.onG){cx.translate(P.x,P.y);cx.scale(1+P.squash,1-P.squash);cx.translate(-P.x,-P.y);}
      if(!P.dead&&!P.climb)drawAccBack(cx,costume().acc,P.x,P.y+2-105,P.dir,1,G.time,clvl(costume().id));
      drawFrame('player',name,P.fi,P.x,P.y+2,P.dir<0,1,P.dead?1-(P.deadT-1)/.6:null,null,playerImg());
      if(!P.dead)drawAcc(cx,costume().acc,P.x,P.y+2-105,P.dir,1,G.time,clvl(costume().id));
      if(!P.dead&&!P.climb&&P.wpn)drawWeaponGlow(P);cx.restore();}
    if(P.hasKey){cx.font='22px system-ui';cx.textAlign='center';cx.fillText('🔑',P.x,P.y-96);}}
  // mermiler
  for(const p of LV.proj)drawProj(p);
  // parçacıklar
  for(const p of LV.parts){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.g)p.vy+=900*dt;cx.globalAlpha=Math.max(0,1-p.t/p.life);cx.fillStyle=p.c;cx.fillRect(p.x-p.s/2,p.y-p.s/2,p.s,p.s);}cx.globalAlpha=1;LV.parts=LV.parts.filter(p=>p.t<p.life);
  for(const f of LV.fx){f.t+=dt;
    if(f.k==='pick')drawFrame('fx','coinpick',f.t*14,f.x,f.y+20,false,1);
    else if(f.k==='ring'){cx.strokeStyle='rgba(255,255,255,'+(1-f.t/.3)+')';cx.lineWidth=4;cx.beginPath();cx.ellipse(f.x,f.y,20+f.t*120,6+f.t*30,0,0,7);cx.stroke();}
    else if(f.k==='slash'){const a=1-f.t/.16;const r=36+f.r*.12+f.tier*6;cx.save();cx.translate(f.x,f.y);cx.scale(f.dir,1);if(f.tier){cx.shadowColor=TIERC[f.tier];cx.shadowBlur=10+f.tier*6;}
      cx.globalAlpha=a;cx.strokeStyle='#fff';cx.lineWidth=7+f.tier*2;cx.beginPath();cx.arc(-10,0,r,-1.15,1.15);cx.stroke();cx.strokeStyle=f.tier?TIERC[f.tier]:'rgba(255,220,140,.8)';cx.lineWidth=3+f.tier*1.5;cx.beginPath();cx.arc(-14,0,r-7,-1.05,1.05);cx.stroke();
      if(f.tier>=3){cx.lineWidth=3;cx.beginPath();cx.arc(-4,0,r+10,-.9,.9);cx.stroke();}cx.restore();}}
  LV.fx=LV.fx.filter(f=>f.t<(f.k==='pick'?.22:f.k==='ring'?.3:.16));
  for(const f of LV.floats){f.t+=dt;cx.globalAlpha=Math.max(0,1-f.t);cx.font='bold 26px Acme,system-ui';cx.textAlign='center';cx.lineWidth=5;cx.strokeStyle='rgba(0,0,0,.6)';cx.strokeText(f.s,f.x,f.y-f.t*50);cx.fillStyle=f.c;cx.fillText(f.s,f.x,f.y-f.t*50);}cx.globalAlpha=1;LV.floats=LV.floats.filter(f=>f.t<1);
  cx.restore();
  // karanlık
  if(WD.dark)drawDark();
  drawWeather();
  if(flash>0){cx.fillStyle='rgba(220,40,30,'+flash*.6+')';cx.fillRect(0,0,VW,VIEW_H);flash=Math.max(0,flash-dt*2);}
  // rüzgâr göstergesi
  if(G.wind){const a=Math.min(1,Math.abs(G.wind)/300);cx.save();cx.globalAlpha=a;cx.font='bold 30px Acme,system-ui';cx.textAlign='center';cx.fillStyle='#fff';cx.strokeStyle='rgba(0,0,0,.5)';cx.lineWidth=5;const s=(G.wind>0?t('wind')+'  ⟶':'⟵  '+t('wind'));cx.strokeText(s,VW/2,70);cx.fillText(s,VW/2,70);cx.restore();}
}
// mağara ve kale karanlığı: oyuncu, meşaleler, ateşler ve fenerler ışık deliği açar
let darkC=null;
function drawDark(){
  const sc=.5,w=Math.ceil(VW*sc),h=Math.ceil(VIEW_H*sc);
  if(!darkC){darkC=document.createElement('canvas');}
  if(darkC.width!==w||darkC.height!==h){darkC.width=w;darkC.height=h;}
  const g=darkC.getContext('2d');g.globalCompositeOperation='source-over';g.clearRect(0,0,w,h);g.fillStyle='rgba(4,3,10,'+LV.WD.dark+')';g.fillRect(0,0,w,h);
  g.globalCompositeOperation='destination-out';
  const hole=(x,y,r)=>{x=(x-cam.x)*sc;y=(y-cam.y)*sc;r*=sc;if(x<-r||x>w+r||y<-r||y>h+r)return;const gr=g.createRadialGradient(x,y,r*.25,x,y,r);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();};
  if(P)hole(P.x,P.y-40,300+cst('sight')+Math.sin(G.time*9)*6);
  for(const l of LV.lights)hole(l.x,l.y,l.r+Math.sin(G.time*7+l.x)*8);
  if(LV.exit)hole(LV.exit.x,LV.exit.y-90,LV.exit.lit?320:170);
  for(const it of LV.items)if(!it.gone&&(it.k==='chick'||it.k==='key'||it.k==='weapon'||it.k==='dashorb'))hole(it.x,it.y-20,90);
  for(const p of LV.proj)hole(p.x,p.y,70);
  if(LV.boss&&!LV.boss.dead)hole(LV.boss.x,LV.boss.y-LV.boss.h/2,220);
  cx.drawImage(darkC,0,0,w,h,0,0,VW,VIEW_H);
  // sıcak ışık tonu
  if(P){const px=P.x-cam.x,py=P.y-40-cam.y;const g3=cx.createRadialGradient(px,py,10,px,py,260);g3.addColorStop(0,'rgba(255,170,80,.12)');g3.addColorStop(1,'rgba(255,170,80,0)');cx.fillStyle=g3;cx.fillRect(0,0,VW,VIEW_H);}
}
let PIMG=null,PIMGK='';
function playerImg(){const c=costume();if(!c.f)return null;if(PIMGK!==c.id){PIMG=tinted(SPR.chars.player.img,c.f);PIMGK=c.id;}return PIMG;}
function drawBubble(x,y,txt,a){cx.save();cx.globalAlpha=a;cx.font='20px Acme,system-ui';const lines=wrapText(txt,300);const w=Math.max(...lines.map(l=>cx.measureText(l).width))+28,h=lines.length*24+18;
  const bx=x-w/2,by=y-h;cx.fillStyle='rgba(38,22,10,.92)';cx.strokeStyle='#d8a560';cx.lineWidth=3;roundRect(bx,by,w,h,12);cx.fill();cx.stroke();
  cx.beginPath();cx.moveTo(x-10,by+h);cx.lineTo(x,by+h+12);cx.lineTo(x+10,by+h);cx.fill();
  cx.fillStyle='#fff8ea';cx.textAlign='center';lines.forEach((l,i)=>cx.fillText(l,x,by+30+i*24));cx.restore();}
function wrapText(s,maxW){const words=s.split(' ');const out=[];let cur='';for(const w of words){const tt=cur?cur+' '+w:w;if(cx.measureText(tt).width>maxW&&cur){out.push(cur);cur=w;}else cur=tt;}if(cur)out.push(cur);return out;}
function roundRect(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath();}
function drawMushroom(x,y){let sq=0;for(const tr of LV.traps)if(tr.k==='spring'&&Math.abs(tr.x-x)<4&&tr.sq>0)sq=tr.sq;const k=1-sq*1.2;
  cx.save();cx.translate(x,y);cx.scale(1+sq*.8,k);
  cx.fillStyle='#f3e6c8';cx.strokeStyle='#5a3418';cx.lineWidth=3;cx.beginPath();cx.roundRect?cx.roundRect(-12,-34,24,34,6):cx.rect(-12,-34,24,34);cx.fill();cx.stroke();
  cx.fillStyle='#e0443a';cx.beginPath();cx.ellipse(0,-34,34,22,0,Math.PI,0);cx.lineTo(34,-30);cx.lineTo(-34,-30);cx.closePath();cx.fill();cx.stroke();
  cx.fillStyle='#fff';for(const [dx,dy,r] of [[-16,-44,5],[4,-50,6],[18,-40,4],[-4,-38,3]]){cx.beginPath();cx.arc(dx,dy,r,0,7);cx.fill();}
  cx.restore();}
function drawLadder(x,y){const im=IMG.ladder_tile_2;if(im){cx.drawImage(im,x+8,y,TS-16,TS+1);}else{cx.strokeStyle='#8a5428';cx.lineWidth=5;cx.beginPath();cx.moveTo(x+14,y);cx.lineTo(x+14,y+TS);cx.moveTo(x+TS-14,y);cx.lineTo(x+TS-14,y+TS);for(let i=8;i<TS;i+=16){cx.moveTo(x+14,y+i);cx.lineTo(x+TS-14,y+i);}cx.stroke();}}
function drawDoor(x,y){cx.fillStyle='#4a2c14';cx.fillRect(x+6,y,TS-12,TS);cx.strokeStyle='#2a170a';cx.lineWidth=3;cx.strokeRect(x+6,y,TS-12,TS);cx.fillStyle='#9aa3b5';for(let i=0;i<3;i++)cx.fillRect(x+14+i*14,y,5,TS);if(tileAt(x/TS,y/TS-1)!=='D'){cx.font='24px system-ui';cx.textAlign='center';cx.fillText('🔒',x+TS/2,y+TS/2+8);}}
function drawItem(it){
  const bob=Math.sin(it.t*3)*4;
  switch(it.k){
    case 'coin':if(!it.gone)drawFrame('fx','coin',it.t*12,it.x,it.y+16,false,1);break;
    case 'chick':if(!it.gone){const g=cx.createRadialGradient(it.x,it.y-24,4,it.x,it.y-24,50);g.addColorStop(0,'rgba(255,240,150,.45)');g.addColorStop(1,'rgba(255,240,150,0)');cx.fillStyle=g;cx.fillRect(it.x-50,it.y-74,100,100);
      drawFrame('chick','idle',it.t*8,it.x,it.y+2,Math.sin(it.t*.5)>0,1);if(Math.floor(it.t*2)%4===0){cx.font='16px system-ui';cx.textAlign='center';cx.fillText('♪',it.x+18,it.y-40);}}break;
    case 'potion':if(!it.gone){const im=IMG.health_potion;if(im)cx.drawImage(im,it.x-18,it.y-22+bob,36,44);}break;
    case 'arrows':if(!it.gone){const im=IMG.weapon_bow;if(im)cx.drawImage(im,it.x-20,it.y-22+bob,40,44);cx.font='14px Acme';cx.fillStyle='#fff';cx.textAlign='center';cx.fillText('+5',it.x,it.y+28+bob);}break;
    case 'spears':if(!it.gone){const im=IMG.weapon_spear;if(im)cx.drawImage(im,it.x-22,it.y-22+bob,44,44);}break;
    case 'key':if(!it.gone)drawFrame('fx','key',it.t*12,it.x,it.y+20+bob,false,1);break;
    case 'weapon':case 'dashorb':if(!it.gone){const g=cx.createRadialGradient(it.x,it.y,4,it.x,it.y,64);g.addColorStop(0,it.k==='dashorb'?'rgba(140,220,255,.8)':'rgba(255,230,140,.75)');g.addColorStop(1,'rgba(255,230,140,0)');cx.fillStyle=g;cx.fillRect(it.x-64,it.y-64,128,128);
      if(it.k==='weapon'){const im=IMG['weapon_'+it.wpn];if(im)cx.drawImage(im,it.x-30,it.y-30+bob,60,60);}else{cx.font='bold 46px Acme,system-ui';cx.textAlign='center';cx.fillStyle='#fff';cx.strokeStyle='#2a86d6';cx.lineWidth=6;cx.strokeText('⇢',it.x,it.y+16+bob);cx.fillText('⇢',it.x,it.y+16+bob);}}break;
    case 'crate':if(!it.gone)drawFrame('fx','crate',0,it.x,it.y+2,false,1);else drawFrame('fx','crate',Math.min(8,it.breakT*14),it.x,it.y+2,false,1,1-it.breakT/.8);break;
    case 'barrel':if(!it.gone)drawFrame('fx','barrel',0,it.x,it.y+2,false,1);else drawFrame('fx','barrel',Math.min(8,it.breakT*14),it.x,it.y+2,false,1,1-it.breakT/.8);break;
    case 'chest':drawFrame('fx','chest',it.open?Math.min(4,it.t*10):0,it.x,it.y+2,false,1);break;
    case 'fire':drawFrame('fx','campfire',it.lit?it.t*10:0,it.x,it.y+2,false,1,null,it.lit?null:'grayscale(1) brightness(.6)');if(it.lit){const g=cx.createRadialGradient(it.x,it.y-20,4,it.x,it.y-20,90);g.addColorStop(0,'rgba(255,170,60,.35)');g.addColorStop(1,'rgba(255,170,60,0)');cx.fillStyle=g;cx.fillRect(it.x-90,it.y-110,180,180);}break;
  }}
function drawProj(p){
  if(p.tier){const c=TIERC[p.tier];const g=cx.createRadialGradient(p.x,p.y,2,p.x,p.y,26+p.tier*6);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');cx.save();cx.globalAlpha=.55;cx.globalCompositeOperation='lighter';cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,26+p.tier*6,0,7);cx.fill();cx.restore();
    if(Math.random()<.5+p.tier*.1)LV.parts.push({x:p.x,y:p.y+(Math.random()-.5)*8,vx:-p.vx*.05,vy:(Math.random()-.5)*40,t:0,life:.3,c,s:4});}
  cx.save();cx.translate(p.x,p.y);
  switch(p.k){
    case 'arrow':case 'earrow':case 'bolt':{cx.rotate(Math.atan2(p.vy,p.vx));const im=IMG.arrow;if(im){const s=1.2;if(p.k!=='arrow')cx.filter=p.k==='bolt'?'brightness(.6) sepia(1)':'hue-rotate(180deg)';cx.drawImage(im,-im.width*s/2,-im.height*s/2,im.width*s,im.height*s);}break;}
    case 'spear':case 'gspear':{cx.rotate(Math.atan2(p.vy,p.vx));const im=IMG.weapon_spear;if(im){const s=1.1;if(p.k==='gspear')cx.filter='brightness(.7) sepia(.6)';cx.drawImage(im,-im.width*s/2,-im.height*s/2,im.width*s,im.height*s);}break;}
    case 'ice':{cx.rotate(Math.atan2(p.vy,p.vx));cx.fillStyle='#e6f6ff';cx.strokeStyle='#6fb6ff';cx.lineWidth=2;cx.beginPath();cx.moveTo(16,0);cx.lineTo(-10,-7);cx.lineTo(-6,0);cx.lineTo(-10,7);cx.closePath();cx.fill();cx.stroke();break;}
    case 'web':{cx.strokeStyle='rgba(240,240,240,.85)';cx.lineWidth=2;for(let i=0;i<4;i++){cx.beginPath();cx.moveTo(-18,(i-1.5)*8);cx.lineTo(18,(i-1.5)*8);cx.stroke();cx.beginPath();cx.moveTo((i-1.5)*8,-18);cx.lineTo((i-1.5)*8,18);cx.stroke();}break;}
    case 'wave':{const c=LV.wi===5?'rgba(176,140,255,':(LV.wi===1?'rgba(150,230,90,':'rgba(220,190,140,');cx.fillStyle=c+'.85)';cx.beginPath();cx.moveTo(-24,8);cx.quadraticCurveTo(0,-46-Math.sin(G.time*30)*6,24,8);cx.closePath();cx.fill();break;}
  }
  cx.restore();}

/* ------------------------------ SİLAH PARILTISI ------------------------------ */
function drawWeaponGlow(p){
  const tier=wt(p.wpn);if(!tier)return;const c=TIERC[tier],d=p.dir;
  const pos={sword:[38,-34],bow:[28,-46],spear:[14,-118]}[p.wpn]||[30,-40];
  let x=p.x+d*pos[0],y=p.y+pos[1];if(p.atk>0&&p.wpn==='sword')x+=d*20;
  const r=16+tier*7+Math.sin(G.time*6)*3;
  cx.save();cx.globalCompositeOperation='lighter';const g=cx.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,c);g.addColorStop(.4,c+'99');g.addColorStop(1,'rgba(0,0,0,0)');cx.globalAlpha=.55+.15*Math.sin(G.time*5);cx.fillStyle=g;cx.beginPath();cx.arc(x,y,r,0,7);cx.fill();cx.restore();
  if(tier>=2&&Math.random()<.12*tier)LV.parts.push({x:x+(Math.random()-.5)*24,y:y+(Math.random()-.5)*24,vx:(Math.random()-.5)*30,vy:-30-Math.random()*50,t:0,life:.5,c,s:3+tier});
  if(tier>=4&&Math.random()<.5)LV.parts.push({x:x+(Math.random()-.5)*16,y:y,vx:(Math.random()-.5)*20,vy:-90-Math.random()*60,t:0,life:.45,c:Math.random()<.5?'#ff8a1f':'#ffe066',s:6});
}

/* ------------------------------ KOSTÜM AKSESUARLARI ------------------------------
   x: kafa ortası, top: kapüşon tepesi, d: yön, k: ölçek. Hem oyunda hem dükkânda kullanılır. */
function drawAccBack(g,acc,x,top,d,k,tm,lv){
  if(acc==='scarf'){g.save();g.translate(x,top+62*k);g.scale(d*k,k);g.fillStyle='#2fd6b5';g.strokeStyle='#127a66';g.lineWidth=2;
    g.beginPath();g.moveTo(-6,0);for(let i=0;i<=6;i++){g.lineTo(-10-i*9,4+Math.sin(tm*9-i*.9)*5+i*1.2);}for(let i=6;i>=0;i--){g.lineTo(-10-i*9,14+Math.sin(tm*9-i*.9)*5+i*1.4);}g.closePath();g.fill();g.stroke();g.restore();}
  if(acc==='ears'){g.save();g.translate(x,top+92*k);g.scale(d*k,k);g.fillStyle='#e9eef5';g.strokeStyle='#8a97a8';g.lineWidth=2;
    g.beginPath();g.moveTo(-14,0);g.quadraticCurveTo(-40,-10+Math.sin(tm*6)*4,-46,-30+Math.sin(tm*6)*5);g.quadraticCurveTo(-30,-12,-12,-8);g.closePath();g.fill();g.stroke();g.restore();}
}
function drawAcc(g,acc,x,top,d,k,tm,lv){
  if(!acc)return;
  g.save();g.translate(x,top);g.scale(d*k,k);g.lineJoin='round';
  switch(acc){
    case 'leaves':{const L=[[-26,8,-.9,'#3fa34d'],[-10,-4,-.35,'#5cc95a'],[8,-5,.3,'#47b04f'],[24,6,.9,'#3fa34d']];if(lv>=2)L.push([0,-10,0,'#7be070']);
      for(const [lx,ly,a,c] of L){g.save();g.translate(lx,ly);g.rotate(a);g.fillStyle=c;g.strokeStyle='#1f5a26';g.lineWidth=2;g.beginPath();g.ellipse(0,-8,6,13,0,0,7);g.fill();g.stroke();g.beginPath();g.moveTo(0,4);g.lineTo(0,-18);g.stroke();g.restore();}
      if(lv>=3){g.fillStyle='#ff6fa8';g.beginPath();g.arc(16,-2,5,0,7);g.fill();g.fillStyle='#ffe066';g.beginPath();g.arc(16,-2,2,0,7);g.fill();}
      break;}
    case 'ice':{const C=[[-18,6,16],[0,-2,26],[18,6,16]];if(lv>=2)C.push([-30,14,10],[30,14,10]);
      for(const [cx2,cy,h] of C){g.fillStyle='rgba(205,240,255,.95)';g.strokeStyle='#5fb8ef';g.lineWidth=2;g.beginPath();g.moveTo(cx2-6,cy+4);g.lineTo(cx2,cy-h);g.lineTo(cx2+6,cy+4);g.closePath();g.fill();g.stroke();g.fillStyle='#fff';g.fillRect(cx2-1,cy-h*.6,2,h*.4);}
      if(lv>=3){g.globalAlpha=.6+.4*Math.sin(tm*5);g.fillStyle='#fff';g.beginPath();g.arc(0,-30,3,0,7);g.fill();}
      break;}
    case 'scarf':{g.fillStyle='#2fd6b5';g.strokeStyle='#127a66';g.lineWidth=2;g.beginPath();g.roundRect?g.roundRect(-26,58,52,14,7):g.rect(-26,58,52,14);g.fill();g.stroke();
      if(lv>=2){g.fillStyle='#bff6ea';g.fillRect(-20,62,6,6);g.fillRect(4,62,6,6);}
      if(lv>=3){g.strokeStyle='rgba(180,255,240,.7)';g.lineWidth=2;for(let i=0;i<3;i++){g.beginPath();g.arc(-50-i*14,20+i*12,10,Math.PI*.2+tm*3,Math.PI*1.2+tm*3);g.stroke();}}
      break;}
    case 'ears':{for(const s2 of [-1,1]){g.fillStyle='#e9eef5';g.strokeStyle='#8a97a8';g.lineWidth=2.5;g.beginPath();g.moveTo(s2*10,6);g.lineTo(s2*24,-22);g.lineTo(s2*30,8);g.closePath();g.fill();g.stroke();g.fillStyle='#ffb3c6';g.beginPath();g.moveTo(s2*15,4);g.lineTo(s2*23,-12);g.lineTo(s2*26,5);g.closePath();g.fill();}
      if(lv>=3){g.strokeStyle='rgba(160,220,255,.8)';g.lineWidth=3;g.beginPath();g.moveTo(-34,40);g.lineTo(-44,30);g.moveTo(34,40);g.lineTo(44,30);g.stroke();}
      break;}
    case 'horns':{for(const s2 of [-1,1]){g.fillStyle='#3a1d55';g.strokeStyle='#1a0b28';g.lineWidth=2;g.beginPath();g.moveTo(s2*12,10);g.quadraticCurveTo(s2*34,0,s2*30,-24);g.quadraticCurveTo(s2*24,-6,s2*22,12);g.closePath();g.fill();g.stroke();}
      if(lv>=2){g.fillStyle='#b77dff';g.beginPath();g.arc(-30,-24,3,0,7);g.arc(30,-24,3,0,7);g.fill();}
      if(lv>=3){g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(0,40,4,0,40,70);gr.addColorStop(0,'rgba(170,90,255,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(0,40,70,0,7);g.fill();}
      break;}
    case 'plume':{g.fillStyle='#b9c2cf';g.strokeStyle='#5a6270';g.lineWidth=2;g.beginPath();g.roundRect?g.roundRect(-31,27,62,10,4):g.rect(-31,27,62,10);g.fill();g.stroke();
      const n=lv>=2?3:2;for(let i=n-1;i>=0;i--){g.save();g.translate(-2+i*4,29);g.rotate(-.45+i*.2+Math.sin(tm*4+i)*.06);g.fillStyle=['#e8483c','#ff7a3c','#ffd23c'][i];g.strokeStyle='#7a1a12';g.beginPath();g.ellipse(0,-24,8,22,0,0,7);g.fill();g.stroke();g.restore();}
      if(lv>=3){g.fillStyle='#ffd23c';g.beginPath();g.arc(0,32,4,0,7);g.fill();}
      break;}
    case 'crown':{g.fillStyle='#ffcf3f';g.strokeStyle='#8a5a00';g.lineWidth=2.5;g.beginPath();g.moveTo(-24,10);g.lineTo(-26,-14);g.lineTo(-13,-2);g.lineTo(0,-20);g.lineTo(13,-2);g.lineTo(26,-14);g.lineTo(24,10);g.closePath();g.fill();g.stroke();
      g.fillStyle='#e8483c';g.beginPath();g.arc(0,2,4,0,7);g.fill();if(lv>=2){g.fillStyle='#4fd2ff';g.beginPath();g.arc(-14,4,3,0,7);g.arc(14,4,3,0,7);g.fill();}
      const sp=lv>=3?4:2;g.fillStyle='#fff';for(let i=0;i<sp;i++){const a=tm*2+i*1.6;const r2=(Math.sin(tm*6+i)+1)*2+1;g.globalAlpha=.8;g.beginPath();g.arc(Math.cos(a)*40,30+Math.sin(a)*40,r2,0,7);g.fill();}
      break;}
  }
  g.restore();}

/* ------------------------------ OYUN DURUMU ------------------------------ */
let G={state:'menu',time:0};
function startLevel(idx){
  audioInit();
  LV=parseLevel(idx);LV.trail=[];P=newPlayer();
  G={state:'play',time:0,coins:0,chicks:0,kills:0,idx,revived:0,tok:Math.random(),wind:0,windT:0,storm:0,stormT:6};
  WX.length=0;
  if(LV.def.boss)spawnBoss();else $('bossbar').style.display='none';
  updateCam(0,true);show(null);$('hud').classList.add('on');$('pad').classList.add('on');
  music(LV.WD.music);updHud();last=performance.now();acc=0;for(const k in IN)IN[k]=0;
  // dünyaya özgü ilk ipucu
  const tipKey=idx===0?'tut':({summer:'tutSpring',autumn:'tutWind',ice:'tutIce',cave:'tutDark',castle:'tutCastle'})[LV.WD.id];
  if(tipKey&&!S.seen['tip_'+tipKey]&&idx%5===0){S.seen['tip_'+tipKey]=1;save();setTimeout(()=>{if(G.state==='play')cardMsg(idx===0?'SOBE':t('w_'+LV.WD.id),t(tipKey),null);},500);}
}
function worldTick(dt){
  // sonbahar rüzgârı: 4 sn sakin, 3 sn sert esinti
  if(LV.WD.wind&&!LV.def.boss||LV.WD.wind&&LV.boss&&LV.boss.hp<LV.boss.maxHp/2){G.windT+=dt;const c=G.windT%7;if(c<4){G.wind*=.9;if(Math.abs(G.wind)<5)G.wind=0;G.windDir=(Math.floor(G.windT/7)%2?-1:1)*(LV.def.windDir||1);}
    else{const k=Math.sin((c-4)/3*Math.PI);G.wind=G.windDir*620*k;}}
  // buzul tipisi (her bölümde değil: def.storm)
  if(LV.def.storm){G.stormT-=dt;if(G.stormT<=0){if(G.storm>0){G.storm=0;G.stormT=7;}else{G.storm=3;G.stormT=3;}}if(G.storm>0)G.storm-=dt;}
}
function winLevel(){
  if(G.state!=='play')return;G.state='won';play('canAlma',1,.8);music('');
  for(let i=0;i<30;i++)setTimeout(()=>{if(LV&&LV.exit)burst(LV.exit.x,LV.exit.y-60,3,['#ffd96a','#ff9a3c','#fff'][i%3]);},i*30);
  const idx=G.idx;const stars=G.chicks;const first=S.stars[idx]==null;
  S.stars[idx]=Math.max(S.stars[idx]||0,stars);if(S.unlocked<=idx)S.unlocked=idx+1;
  const bonus=stars*15+(LV.def.boss?(first?150:60):(first?40:20));G.earned=Math.round(G.coins)+bonus;S.coins+=G.earned;save();
  const tok=G.tok;setTimeout(()=>{if(G.tok===tok)showResult(true);},1300);}
function offerRevive(){
  G.state='revive';
  const potions=S.potions;
  const box=document.createElement('div');box.className='scr dim on';box.style.zIndex=30;
  box.innerHTML='<div class="panel col"><div class="title" style="font-size:40px">'+t('revT')+'</div><div style="color:var(--dim);max-width:420px;text-align:center">'+t('revX')+'</div><div class="row">'+(potions>0?'<button class="btn o" id="rvP">🧪 '+t('revPotion')+' ('+potions+')</button>':'')+(G.revived<2&&AdKit.left()>0?'<button class="btn b" id="rvA">▶ '+t('revAd')+'</button>':'')+'</div><button class="btn w sm" id="rvN">'+t('giveup')+'</button></div>';
  document.body.appendChild(box);
  const done=ok=>{box.remove();if(ok)revive();else showResult(false);};
  const bp=box.querySelector('#rvP');if(bp)bp.onclick=()=>{S.potions--;save();done(true);};
  const ba=box.querySelector('#rvA');if(ba)ba.onclick=()=>{box.style.display='none';AdKit.rewarded('revive').then(ok=>{box.style.display='';if(ok){G.revived++;done(true);}});};
  box.querySelector('#rvN').onclick=()=>done(false);}
function revive(){P.dead=false;P.hp=maxHearts();P.inv=2;P.x=P.cp.x;P.y=P.cp.y;P.vx=P.vy=0;P.anim='idle';P.climb=false;P.dashT=0;G.state='play';music(LV.WD.music);updateCam(0,true);
  for(const e of LV.enemies)if(!e.dead&&Math.abs(e.x-P.x)<TS*3)e.x+=Math.sign(e.x-P.x||1)*TS*3;LV.proj.length=0;updHud();last=performance.now();for(const k in IN)IN[k]=0;}
function showResult(won){
  G.state='over';$('hud').classList.remove('on');$('pad').classList.remove('on');$('bossbar').style.display='none';
  const idx=G.idx;$('rTitle').textContent=won?t('win'):t('fail');
  const st=$('rStars');st.style.display=won?'flex':'none';st.querySelectorAll('span').forEach((s,i)=>{s.className='';if(won&&i<G.chicks)setTimeout(()=>{s.className='on';beep(600+i*200,.15,'triangle',.12);},350+i*300);});
  const earned=won?G.earned:Math.round(G.coins);if(!won){S.coins+=earned;save();}
  G.earnedNow=earned;G.doubled=false;$('rCoins').textContent=earned;
  $('rInfo').textContent=t('lvl')+' '+(idx+1)+' · '+G.chicks+'/'+LV.chicksTotal+' '+t('chicksL')+' · '+t('time')+' '+fmtTime(G.time);
  const db=$('rDouble');db.style.display=earned>=10&&AdKit.left()>0?'inline-flex':'none';db.disabled=false;
  $('rNext').style.display=won&&idx<window.SOBE_LEVELS.length-1?'inline-flex':'none';
  show('sResult');music('menu');}
function fmtTime(s){s=Math.floor(s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
$('rDouble').onclick=()=>{if(G.doubled)return;AdKit.rewarded('double').then(ok=>{if(ok){G.doubled=true;S.coins+=G.earnedNow;save();$('rCoins').textContent=G.earnedNow*2;$('rDouble').disabled=true;beep(900,.2,'triangle',.15);}});};
$('rNext').onclick=()=>{const n=G.idx+1;AdKit.levelDone({reward:'+60 🪙'}).then(ok=>{if(ok){S.coins+=60;save();}goLevel(n,true);});};
$('rRetry').onclick=()=>{const n=G.idx;AdKit.breakpoint().then(()=>startLevel(n));};
$('rMenu').onclick=()=>{const was=G.idx,won=S.stars[was]!=null;AdKit.breakpoint().then(()=>{afterLevelStory(was,won,()=>openWorlds());});};
function storyOf(){return STORY[lang]||STORY.en;}
// boss sonrası ve dünya girişi hikâyeleri
function afterLevelStory(idx,won,cb){
  const def=window.SOBE_LEVELS[idx];const wid=WORLDS[def.wi].id;
  if(won&&def.boss&&!S.seen['bd_'+wid]){S.seen['bd_'+wid]=1;save();
    if(wid==='castle'){if(!S.seen.end){S.seen.end=1;save();return playStory(storyOf().end,cb);}}
    else return playStory(storyOf().bossdone[wid]||[],cb);}
  cb();}
function goLevel(n,fromResult){
  const prev=G.idx;const go=()=>{const wid=WORLDS[window.SOBE_LEVELS[n].wi].id;if(n%5===0&&!S.seen['w_'+wid]){S.seen['w_'+wid]=1;save();playStory(storyOf()[wid]||[],()=>startLevel(n));}else startLevel(n);};
  if(fromResult)afterLevelStory(prev,true,go);else go();}

/* ------------------------------ DÖNGÜ ------------------------------ */
let last=performance.now(),acc=0;
function frame(now){
  let dt=Math.min(.05,(now-last)/1000);last=now;
  cx.setTransform(DPR*SC,0,0,DPR*SC,0,0);
  if(LV&&P&&G.state!=='menu'){
    if(G.state==='play'||G.state==='won'){
      if(hitstop>0){hitstop-=dt;}
      else{acc+=dt;let n=0;while(acc>=STEP&&n<12){tick(STEP);acc-=STEP;n++;IN.jp=IN.ap=IN.wp=IN.sp=0;}if(n>=12)acc=0;}
      updWeather(dt);}
    else if(G.state==='revive'){P.deadT+=dt;P.fi+=dt*12;}
    updateCam(dt);drawWorld(G.state==='pause'||G.state==='card'?0:dt);
    $('bU').style.display=$('bD').style.display=nearLadder&&G.state==='play'?'flex':'none';
    if(S.dash){const k=P.dashCd>0?1-P.dashCd/WPN.dash.cd[wl('dash')]:1;$('bS').style.setProperty('--cd',(Math.max(0,Math.min(1,k))*100)+'%');}
  }else drawMenuBg(dt);
  requestAnimationFrame(frame);}
function tick(dt){
  G.time+=dt;
  if(G.state==='play'){worldTick(dt);updatePlayer(dt);}
  else if(G.state==='won'){P.vx*=.9;P.vy+=PH.gDown*dt;move(P,dt);P.anim='idle';P.fi+=dt*10;}
  for(const p of LV.plats){p.ph+=dt*p.sp;const ox=p.x,oy=p.y;const k=(Math.sin(p.ph)+1)/2;p.x=p.ax+p.dx*k;p.y=p.ay+p.dy*k;p.vx=(p.x-ox)/dt;p.vy=(p.y-oy)/dt;}
  updateEnemies(dt);updateBoss(dt);updateTraps(dt);updateProj(dt);if(G.state==='play')updateItems(dt);
}
let menuT=0;
function drawMenuBg(dt){menuT+=dt;const layers=BGL.forest;const gr=cx.createLinearGradient(0,0,0,VIEW_H);gr.addColorStop(0,'#7cc8f2');gr.addColorStop(1,'#d9f2ff');cx.fillStyle=gr;cx.fillRect(0,0,VW,VIEW_H);const fac=[.6,.42,.28,.15,.05];
  for(let i=layers.length-1;i>=0;i--){const im=IMG[layers[i]];if(!im)continue;const h=VIEW_H,s=h/im.height,iw=im.width*s;let ox=-(menuT*60*fac[i])%iw;const oy=VIEW_H-h+20;for(let x=ox;x<VW;x+=iw-1)cx.drawImage(im,x,oy,iw,h);}
  if(SPR){const ac=costume().acc,lv=clvl(costume().id);drawAccBack(cx,ac,VW*.5,VIEW_H-60-105*1.5,1,1.5,menuT,lv);drawFrame('player','sw_run',menuT*16,VW*.5,VIEW_H-60,false,1.5,null,null,playerImg());drawAcc(cx,ac,VW*.5,VIEW_H-60-105*1.5,1,1.5,menuT,lv);drawFrame('chick','idle',menuT*8,VW*.5+110,VIEW_H-60,true,1.3);drawFrame('boar','run',menuT*16,VW*.5-210,VIEW_H-60,true,1.05);}
  cx.fillStyle='rgba(0,0,0,.18)';cx.fillRect(0,0,VW,VIEW_H);}

/* ------------------------------ GİRİŞ ------------------------------ */
const KEYS={ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',ArrowUp:'u',KeyW:'u',ArrowDown:'d',KeyS:'d',Space:'j',KeyZ:'j',KeyX:'a',KeyJ:'a',KeyC:'w',KeyQ:'w',ShiftLeft:'s',ShiftRight:'s',KeyK:'s'};
function press(k){if(k==='j'){if(!IN.j)IN.jp=1;IN.j=1;}else if(k==='a'){if(!IN.a)IN.ap=1;IN.a=1;}else if(k==='w'){IN.wp=1;}else if(k==='s'){if(!IN.s)IN.sp=1;IN.s=1;}else IN[k]=1;}
function release(k){if(k==='j')IN.j=0;else if(k==='a')IN.a=0;else if(k==='s')IN.s=0;else if(k!=='w')IN[k]=0;}
addEventListener('keydown',e=>{const k=KEYS[e.code];if(!k)return;e.preventDefault();if(e.repeat)return;press(k);});
addEventListener('keyup',e=>{const k=KEYS[e.code];if(!k)return;release(k);});
function bindBtn(id,key){const el=$(id);const ids=new Set();
  const down=e=>{e.preventDefault();audioInit();if(AC&&AC.state==='suspended')AC.resume();ids.add(e.pointerId);try{el.setPointerCapture(e.pointerId);}catch(_){}el.classList.add('on');press(key);};
  const up=e=>{if(!ids.has(e.pointerId))return;ids.delete(e.pointerId);if(ids.size)return;el.classList.remove('on');release(key);};
  el.addEventListener('pointerdown',down);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',up);}
// sol/sağ: parmak kaldırmadan iki tuş arasında kaydırılabilir
(function(){const Lb=$('bL'),Rb=$('bR');const ids=new Map();
  function apply(){let l=0,r=0;ids.forEach(v=>{if(v<0)l=1;else r=1;});IN.l=l;IN.r=r;Lb.classList.toggle('on',!!l);Rb.classList.toggle('on',!!r);}
  function side(x){const a=Lb.getBoundingClientRect(),b=Rb.getBoundingClientRect();return x<(a.left+a.width/2+b.left+b.width/2)/2?-1:1;}
  function down(e){e.preventDefault();audioInit();if(AC&&AC.state==='suspended')AC.resume();try{e.currentTarget.setPointerCapture(e.pointerId);}catch(_){}ids.set(e.pointerId,side(e.clientX));apply();}
  function mv(e){if(!ids.has(e.pointerId))return;ids.set(e.pointerId,side(e.clientX));apply();}
  function up(e){if(!ids.has(e.pointerId))return;ids.delete(e.pointerId);apply();}
  for(const el of [Lb,Rb]){el.addEventListener('pointerdown',down);el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',up);}
  window.__padClear=()=>{ids.clear();apply();};})();
bindBtn('bJ','j');bindBtn('bA','a');bindBtn('bW','w');bindBtn('bU','u');bindBtn('bD','d');bindBtn('bS','s');
function clearInput(){for(const k in IN)IN[k]=0;if(window.__padClear)window.__padClear();document.querySelectorAll('.tb.on').forEach(e=>e.classList.remove('on'));}

/* ------------------------------ HUD ------------------------------ */
function updHud(){if(!P)return;let h='';for(let i=0;i<maxHearts();i++)h+='<span class="'+(i<P.hp?'':'off')+'"></span>';$('hearts').innerHTML=h;$('hCoins').textContent=Math.round(G.coins||0);
  const ch=$('chicks');ch.innerHTML='<span></span>'.repeat(LV.chicksTotal||3);ch.querySelectorAll('span').forEach((s,i)=>s.className=i<(G.chicks||0)?'on':'');
  const bA=$('bA');bA.firstChild.textContent=P.wpn==='bow'?'🏹':P.wpn==='spear'?'🔱':'⚔';bA.style.display=P.wpn?'flex':'none';
  const am=$('ammo');if(P.wpn==='bow'){am.style.display='block';am.textContent=P.arrows;}else if(P.wpn==='spear'){am.style.display='block';am.textContent=P.spears;}else am.style.display='none';
  $('bW').style.display=S.weapons.length>1?'flex':'none';$('bS').style.display=S.dash?'flex':'none';}
let toastT;function toast(s){if(!s)return;const e=$('toast');e.textContent=s;e.style.opacity=1;clearTimeout(toastT);toastT=setTimeout(()=>e.style.opacity=0,2200);}
function cardMsg(title,text,wpn){const prev=G.state==='card'?'play':G.state;G.state='card';clearInput();const box=document.createElement('div');box.className='scr dim on';box.style.zIndex=30;
  box.innerHTML='<div class="panel col" style="max-width:580px">'+(wpn?'<div style="width:90px;height:90px;background:url(img/weapon_'+wpn+'.png) center/contain no-repeat"></div>':'')+'<div class="title" style="font-size:34px">'+title+'</div><div style="text-align:center;white-space:pre-line;font-size:21px">'+text+'</div><button class="btn o">'+t('next')+'</button></div>';
  document.body.appendChild(box);box.querySelector('button').onclick=()=>{box.remove();if(G.state==='card')G.state=prev;last=performance.now();clearInput();};}

/* ------------------------------ EKRANLAR ------------------------------ */
const SCREENS=['sMenu','sWorlds','sLevels','sStory','sPause','sResult','sShop','sDaily'];
function show(id){SCREENS.forEach(s=>$(s).classList.toggle('on',s===id));document.querySelectorAll('.coins').forEach(e=>e.textContent=S.coins);if(id==='sMenu'&&typeof updShopBadge==='function'&&SPR)updShopBadge();}
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{beep(500,.05,'triangle',.08);const to=b.dataset.back;if(to==='sWorlds')openWorlds();else{show(to);}});
function applyLang(){document.querySelectorAll('[data-t]').forEach(e=>e.textContent=t(e.dataset.t));$('rotTxt').textContent=t('rot');}
$('playB').onclick=()=>{audioInit();if(!S.storySeen){playStory(storyOf().intro,()=>{S.storySeen=true;save();goLevel(0);});}else openWorlds();};
$('storyB').onclick=()=>{audioInit();playStory(storyOf().intro,()=>show('sMenu'));};
$('shopB').onclick=()=>{audioInit();openShop('w');};$('dailyB').onclick=()=>{audioInit();openDaily();};
$('sndB').onclick=()=>{S.sound=!S.sound;save();$('sndB').textContent=S.sound?'🔊':'🔇';audioInit();if(master)master.gain.value=S.sound?1:0;};
$('langB').onclick=()=>{const ls=['tr','en','es','pt'];lang=ls[(ls.indexOf(lang)+1)%4];S.lang=lang;save();applyLang();toast(t('langName'));};
$('pauseB').onclick=()=>{if(G.state==='play'){G.state='pause';clearInput();show('sPause');}};
$('resB').onclick=()=>{show(null);G.state='play';last=performance.now();clearInput();};
$('restartB').onclick=()=>{const n=G.idx;startLevel(n);};
$('quitB').onclick=()=>{S.coins+=Math.round(G.coins||0);save();G.state='menu';LV=null;P=null;$('hud').classList.remove('on');$('pad').classList.remove('on');$('bossbar').style.display='none';music('menu');openWorlds();};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.state==='play'){G.state='pause';clearInput();show('sPause');}});
addEventListener('adkit:start',()=>{if(G.state==='play'){G.state='pause';clearInput();show('sPause');}});

function worldStars(wi){let st=0;for(let i=wi*5;i<wi*5+5;i++)st+=S.stars[i]||0;return st;}
function openWorlds(){music('menu');let h='';
  WORLDS.forEach((wd,wi)=>{const start=wi*5;const open=S.unlocked>=start;const done=S.stars[start+4]!=null;
    h+='<div class="world'+(open?'':' lock')+'" data-wi="'+wi+'"><div class="pic" style="background-image:url('+worldPic(wi)+')"></div><h3>'+(done?'🏮 ':'')+t('w_'+wd.id)+'</h3><div class="st">'+t('wx_'+wd.id)+'</div><div class="st">🐥 '+worldStars(wi)+'/15</div></div>';});
  $('worldList').innerHTML=h;$('worldList').querySelectorAll('.world').forEach(e=>e.onclick=()=>{if(e.classList.contains('lock')){toast(t('locked'));return;}beep(600,.06,'triangle',.1);openLevels(+e.dataset.wi);});
  show('sWorlds');
  // en son açık dünyayı görünür yap
  const cur=Math.min(5,Math.floor(S.unlocked/5));const el=$('worldList').children[cur];if(el&&el.scrollIntoView)el.scrollIntoView({block:'nearest',inline:'center'});}
const WPIC={};
function worldPic(wi){if(WPIC[wi])return WPIC[wi];const wd=WORLDS[wi];const c=document.createElement('canvas');c.width=300;c.height=130;const g=c.getContext('2d');
  const gr=g.createLinearGradient(0,0,0,130);gr.addColorStop(0,wd.sky[0]);gr.addColorStop(1,wd.sky[1]);g.fillStyle=gr;g.fillRect(0,0,300,130);
  const L2=BGL[wd.bg];for(let i=L2.length-1;i>=0;i--){const im=tinted(L2[i],Array.isArray(wd.bgTint)?wd.bgTint[i]:wd.bgTint);if(im){const s=150/im.height;g.drawImage(im,-20*i,-10,im.width*s,150);}}
  if(wd.dark){g.fillStyle='rgba(0,0,0,'+(wd.dark*.5)+')';g.fillRect(0,0,300,130);}
  try{WPIC[wi]=c.toDataURL('image/jpeg',.8);}catch(e){WPIC[wi]='';}return WPIC[wi];}
function openLevels(wi){const wd=WORLDS[wi];$('lvTitle').textContent=t('w_'+wd.id);let h='';
  for(let i=wi*5;i<wi*5+5;i++){const def=window.SOBE_LEVELS[i];const lock=i>S.unlocked;const st=S.stars[i];h+='<div class="lv'+(lock?' lock':'')+(def.boss?' boss':'')+(i===S.unlocked?' cur':'')+'" data-i="'+i+'">'+(def.boss?'☠':(i+1))+'<i>'+(st!=null?'🐥'.repeat(st)+'·'.repeat(Math.max(0,3-st)):'')+'</i></div>';}
  $('lvList').innerHTML=h;$('lvList').querySelectorAll('.lv').forEach(e=>e.onclick=()=>{const i=+e.dataset.i;if(i>S.unlocked){toast(t('locked'));return;}beep(700,.06,'triangle',.1);goLevel(i);});
  show('sLevels');}
/* hikâye */
let stQ=[],stDone=null,stTy=null;
function playStory(pages,done){if(!pages||!pages.length){done&&done();return;}stQ=pages.slice();stDone=done;show('sStory');nextPage();}
function nextPage(){if(!stQ.length){const d=stDone;stDone=null;d&&d();return;}const [face,who,txt]=stQ.shift();$('stFace').style.backgroundImage='url('+(FACES[face]||'')+')';$('stWho').textContent=who;const el=$('stTxt');clearInterval(stTy);let i=0;el.textContent='';stTy=setInterval(()=>{i+=2;el.textContent=txt.slice(0,i);if(i%8===0)beep(900+Math.random()*200,.02,'square',.02);if(i>=txt.length){clearInterval(stTy);stTy=null;}},20);}
$('stNext').onclick=()=>{if(stTy){clearInterval(stTy);stTy=null;$('stTxt').textContent=$('stTxt').textContent.length?$('stTxt').textContent:'';}nextPage();};
$('stSkip').onclick=()=>{clearInterval(stTy);stTy=null;stQ=[];nextPage();};
const FACES={};
// karakter karesini kırpıp kareye sığdır (portre ve kostüm önizlemesi)
function fitSprite(ch,anim,filter,size,pad,headOnly){
  const C=SPR.chars[ch];const f=C.anims[anim][0];const t1=document.createElement('canvas');t1.width=C.w;t1.height=C.h;const g1=t1.getContext('2d');if(filter)g1.filter=filter;g1.drawImage(IMG[C.img],f[0],f[1],C.w,C.h,0,0,C.w,C.h);
  const d=g1.getImageData(0,0,C.w,C.h).data;let x0=C.w,y0=C.h,x1=0,y1=0;for(let y=0;y<C.h;y++)for(let x=0;x<C.w;x++)if(d[(y*C.w+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  if(x1<x0){x0=0;y0=0;x1=C.w-1;y1=C.h-1;}
  if(headOnly){y1=y0+Math.round((y1-y0)*.75);}
  const bw=x1-x0+1,bh=y1-y0+1,sc=(size-pad*2)/Math.max(bw,bh);const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');
  g.drawImage(t1,x0,y0,bw,bh,(size-bw*sc)/2,size-pad-bh*sc,bw*sc,bh*sc);return c.toDataURL();}
function makeFaces(){
  FACES.sobe=fitSprite('player','pl_idle',null,140,10,true);FACES.king=fitSprite('boneking','idle',null,140,6,true);FACES.piril=fitSprite('chick','idle',null,140,16);FACES.goblin=fitSprite('goblin','idle',null,140,8,true);}
/* dükkân */
let shopTab='w';
function costumeThumb(c){const k='th3_'+c.id+'_'+clvl(c.id);if(FACES[k])return FACES[k];
  const cv2=document.createElement('canvas');cv2.width=150;cv2.height=150;const g=cv2.getContext('2d');const C=SPR.chars.player;const f=C.anims.pl_idle[0];const kk=1.15,sc=C.s*kk;
  const fx=75,fy=140,top=fy-105*kk;
  drawAccBack(g,c.acc,fx,top,1,kk,.6,clvl(c.id));
  g.save();if(c.f)g.filter=c.f;g.drawImage(IMG[C.img],f[0],f[1],C.w,C.h,fx-C.axp.pl*sc,fy-C.ay*sc,C.w*sc,C.h*sc);g.restore();
  drawAcc(g,c.acc,fx,top,1,kk,.6,clvl(c.id));
  FACES[k]=cv2.toDataURL();return FACES[k];}
function costStats(c,lv){const out=[];for(const k in c.st){const v=c.st[k][lv-1];let s2=t('st_'+k);
    if(k==='spd'||k==='jump'||k==='gold'||k==='dashcd')s2+=' +'+Math.round(v*100)+'%';else if(k==='magnet'||k==='sight')s2+=' +'+v;else if(k==='grip')s2=s2;else s2+=' +'+v;out.push(s2);}return out;}
function weaponStats(w,L){const W2=WPN[w];const i=L-1;
  if(w==='sword')return [[t('dmgL'),W2.dmg[i]],[t('reachL'),W2.reach[i]]];
  if(w==='bow')return [[t('dmgL'),W2.dmg[i]],[t('capL'),W2.cap[i]]];
  if(w==='spear')return [[t('dmgL'),W2.dmg[i]],[t('capL'),W2.cap[i]]];
  return [[t('cdL'),W2.cd[i]+'s'],[t('dmgL'),W2.hit[i]]];}
function canAffordAny(){for(const w of ['sword','bow','spear','dash']){const have=w==='dash'?S.dash:S.weapons.includes(w);const l=S.wl[w]||1;if(have&&l<WMAX&&S.coins>=WPN[w].cost[l-1])return true;}
  for(const c of COSTUMES){if(!S.owned.includes(c.id)){if(S.coins>=c.price)return true;}else if(c.price&&clvl(c.id)<3&&S.coins>=cupCost(c)[clvl(c.id)-1])return true;}return false;}
function updShopBadge(){const b=$('shopB');if(b)b.classList.toggle('badge',canAffordAny());}
function openShop(tab){shopTab=tab||shopTab;let h='<div class="tabs">'+['w','c','i'].map(k=>'<button class="tab'+(k===shopTab?' on':'')+'" data-tab="'+k+'">'+t({w:'tabW',c:'tabC',i:'tabI'}[k])+'</button>').join('')+'</div>';
  if(shopTab==='w'){
    for(const w of ['sword','bow','spear','dash']){const have=w==='dash'?S.dash:S.weapons.includes(w);const lvl=S.wl[w]||1;const costs=WPN[w].cost;const c=costs[lvl-1];const tr=wtier(lvl),col=TIERC[tr];
      const ic=w==='dash'?'':'img/weapon_'+w+'.png';
      const cur=weaponStats(w,lvl),nx=lvl<WMAX?weaponStats(w,lvl+1):null;
      const st=cur.map((a2,i)=>a2[0]+' <b>'+a2[1]+'</b>'+(nx&&nx[i][1]!==a2[1]?' → <b class="up">'+nx[i][1]+'</b>':'')).join(' · ');
      let nextT='';for(const L2 of [3,5,7,10])if(L2>lvl){nextT='✨ '+t('lv')+' '+L2+': <span style="color:'+TIERC[wtier(L2)]+'">●</span> '+t('tierN');break;}
      const gems=[1,2,3,4].map(i=>'<span class="gem'+(tr>=i?' on':'')+'" style="'+(tr>=i?'background:'+TIERC[i]:'')+'"></span>').join('');
      h+='<div class="shopi wpn t'+tr+'"><div class="ic wic" style="'+(ic?'background-image:url('+ic+');':'')+(tr?'filter:drop-shadow(0 0 '+(4+tr*4)+'px '+col+') drop-shadow(0 0 '+(2+tr*2)+'px '+col+');':'')+'">'+(ic?'':'<b style="font-size:34px;color:'+col+'">⇢</b>')+'</div><div class="d">'+t(w)+' <span class="lvtag">'+t('lv')+' '+lvl+'/'+WMAX+'</span> <span class="gems">'+gems+'</span><small>'+st+'</small>'+(have&&nextT?'<small class="nt">'+nextT+'</small>':'')+'<div class="pips">'+Array.from({length:WMAX},(_,i)=>'<span class="'+(i<lvl?'on':'')+'" style="'+(i<lvl?'background:'+TIERC[wtier(i+1)]:'')+'"></span>').join('')+'</div></div>'+
        (!have?'<button class="btn w sm" disabled>'+t('needFind')+'</button>':lvl>=WMAX?'<button class="btn w sm" disabled>'+t('max')+'</button>':'<button class="btn o sm" data-wl="'+w+'" '+(S.coins<c?'disabled':'')+'>'+t('upgrade')+' <i class="coinI"></i>'+c+'</button>')+'</div>';}
    for(const k of ['heart','magnet']){const lvl=S.up[k]||0,costs=UPG[k],mx=costs.length,c=costs[lvl];const ic=k==='heart'?'heart.png':'coin.png';
      h+='<div class="shopi"><div class="ic" style="background-image:url(img/'+ic+')"></div><div class="d">'+t('u_'+k)+'<small>'+t('u_'+k+'X')+'</small><div class="pips">'+costs.map((_,i)=>'<span class="'+(i<lvl?'on':'')+'"></span>').join('')+'</div></div>'+(lvl>=mx?'<button class="btn w sm" disabled>'+t('max')+'</button>':'<button class="btn o sm" data-up="'+k+'" '+(S.coins<c?'disabled':'')+'><i class="coinI"></i>'+c+'</button>')+'</div>';}
  }else if(shopTab==='c'){
    h+='<div class="cgrid">';
    for(const c of COSTUMES){const own=S.owned.includes(c.id),on=S.costume===c.id,lv=clvl(c.id);const stats=costStats(c,lv);const up=cupCost(c);
      const nxt=own&&c.price&&lv<3?costStats(c,lv+1):null;
      h+='<div class="cos'+(on?' on':'')+(own?'':' locked')+'"><div class="cimg" style="background-image:url('+costumeThumb(c)+')"></div><b>'+t('c_'+c.id)+'</b>'+
        (c.price?'<div class="pips">'+[1,2,3].map(i=>'<span class="'+(own&&i<=lv?'on':'')+'"></span>').join('')+'</div>':'')+
        '<small>'+(stats.length?stats.join('<br>'):t('p_none'))+(nxt?'<br><span class="up">'+t('nextLv')+': '+nxt.join(', ')+'</span>':'')+'</small><div class="cbtns">'+
        (!own?'<button class="btn o sm" data-buyc="'+c.id+'" '+(S.coins<c.price?'disabled':'')+'><i class="coinI"></i>'+c.price+'</button>':
          (on?'<button class="btn w sm" disabled>'+t('inUse')+'</button>':'<button class="btn b sm" data-wear="'+c.id+'">'+t('use')+'</button>')+
          (c.price&&lv<3?'<button class="btn o sm" data-cup="'+c.id+'" '+(S.coins<up[lv-1]?'disabled':'')+'>⬆ <i class="coinI"></i>'+up[lv-1]+'</button>':''))+'</div></div>';}
    h+='</div>';
  }else{
    h+='<div class="shopi"><div class="ic" style="background-image:url(img/health_potion.png)"></div><div class="d">'+t('potion')+'<small>'+t('potionX')+' · '+t('owned')+': '+S.potions+'</small></div><button class="btn o sm" id="buyPot" '+(S.coins<150?'disabled':'')+'><i class="coinI"></i>150</button></div>';
    const td=new Date().toDateString();if(S.adG.d!==td){S.adG={d:td,n:0};}
    h+='<div class="shopi"><div class="ic" style="background-image:url(img/coin.png)"></div><div class="d">'+t('freeG')+'<small>'+t('freeGX')+' ('+(5-S.adG.n)+'/5)</small></div><button class="btn b sm" id="adGold" '+(S.adG.n>=5?'disabled':'')+'>▶ +100</button></div>';}
  $('shopList').innerHTML=h;
  $('shopList').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{beep(600,.04,'triangle',.06);openShop(b.dataset.tab);});
  $('shopList').querySelectorAll('[data-wl]').forEach(b=>b.onclick=()=>{const w=b.dataset.wl;const lvl=S.wl[w]||1;const c=WPN[w].cost[lvl-1];if(S.coins<c||lvl>=WMAX)return;S.coins-=c;S.wl[w]=lvl+1;save();play('canAlma',.7);const nt=wtier(lvl+1)>wtier(lvl);if(nt){beep(700,.15,'triangle',.12);setTimeout(()=>beep(1050,.2,'triangle',.12),120);}toast((nt?'✨ ':'')+t(w)+' '+t('lv')+' '+(lvl+1));openShop();});
  $('shopList').querySelectorAll('[data-cup]').forEach(b=>b.onclick=()=>{const c=COSTUMES.find(x=>x.id===b.dataset.cup);const lv=clvl(c.id);const cost=cupCost(c)[lv-1];if(lv>=3||S.coins<cost)return;S.coins-=cost;S.clv[c.id]=lv+1;save();play('canAlma',.9);toast(t('c_'+c.id)+' '+t('lv')+' '+(lv+1));openShop();});
  $('shopList').querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const k=b.dataset.up;const c=UPG[k][S.up[k]];if(S.coins<c)return;S.coins-=c;S.up[k]++;save();play('canAlma',.7);openShop();});
  $('shopList').querySelectorAll('[data-wear]').forEach(b=>b.onclick=()=>{S.costume=b.dataset.wear;save();beep(800,.08,'triangle',.08);openShop();});
  $('shopList').querySelectorAll('[data-buyc]').forEach(b=>b.onclick=()=>{const c=COSTUMES.find(x=>x.id===b.dataset.buyc);if(S.coins<c.price)return;S.coins-=c.price;S.owned.push(c.id);S.costume=c.id;save();play('canAlma',.9);openShop();});
  const bp=$('buyPot');if(bp)bp.onclick=()=>{if(S.coins<150)return;S.coins-=150;S.potions++;save();play('saglikToplama',.8);openShop();};
  const ag=$('adGold');if(ag)ag.onclick=()=>AdKit.rewarded('shop').then(ok=>{if(ok){S.coins+=100;S.adG.n++;save();toast('+100');}openShop();});
  show('sShop');updShopBadge();}
/* günlük */
const DAILY=[50,60,80,100,120,150,300];
function openDaily(){const td=new Date().toDateString(),yd=new Date(Date.now()-864e5).toDateString();let streak=S.daily.streak;if(S.daily.last!==td&&S.daily.last!==yd)streak=0;const can=S.daily.last!==td;const idx=can?streak%7:(streak-1+7)%7;
  $('dailyGrid').innerHTML=DAILY.map((v,i)=>'<div class="'+(i<idx||(!can&&i===idx)?'got':'')+(can&&i===idx?' now':'')+'">'+t('dayN')+' '+(i+1)+'<br><b>'+v+'</b>'+(i===6?'<br>🧪':'')+'</div>').join('');
  $('dailyMsg').textContent=can?t('streak')+': '+streak:t('claimed');
  $('dailyClaim').disabled=!can;$('dailyClaim').onclick=()=>{if(!can)return;S.coins+=DAILY[idx];if(idx===6)S.potions++;S.daily={last:td,streak:streak+1,ad:S.daily.ad};save();play('canAlma',.8);toast('+'+DAILY[idx]);openDaily();};
  const ab=$('dailyAd');ab.style.display=can?'none':'inline-flex';ab.disabled=S.daily.ad===td;ab.onclick=()=>AdKit.rewarded('daily').then(ok=>{if(ok){S.coins+=80;S.daily.ad=td;save();toast('+80');}openDaily();});
  show('sDaily');}

/* ------------------------------ BAŞLAT ------------------------------ */
async function boot(){
  resize();
  SPR=await fetch('sprites.json').then(r=>r.json());
  const list=[];for(const k in SPR.chars){const im=SPR.chars[k].img;if(!list.includes(im))list.push(im);}for(const k in SPR.fx){list.push(SPR.fx[k].img);}
  const loads=list.map(n=>loadImg(n,'img/'+n));
  for(const k of ['forest','cave','snow']){loads.push(loadImg('tiles_'+k,'img/tiles_'+k+'.png'));for(const b of BGL[k])loads.push(loadImg(b,'img/'+b+'.webp'));}
  loads.push(loadImg('wall_cave','img/wall_cave.png'));
  const decos=new Set();WORLDS.forEach(w=>w.deco.forEach(d=>decos.add(d)));
  for(const n of new Set([...decos,'sign','lantern_on','health_potion','weapon_sword','weapon_bow','weapon_spear','arrow','ladder_tile_2','heart','coin']))loads.push(loadImg(n,'img/'+n+'.png'));
  await Promise.all(loads);
  // fx sözlüğü de charOf ile çalışsın diye ölçek alanı ekle
  for(const k in SPR.fx)SPR.fx[k].s=SPR.fx[k].s||1;
  // gövde merkezleri (atlas pikseli): aynalama bu noktadan yapılır, böylece dönerken karakter yerinde kalır
  SPR.chars.player.axp={pl:70,sw:70,bw:67,sp:136};
  const BODYX={slime:61,boar:44,goblin:80,skel:73.5,shield:72,archer:57.5,spider:44,bee:42,bat:66.5,bigboar:57,boneking:189.5,chick:34};
  for(const k in BODYX)if(SPR.chars[k])SPR.chars[k].ax=BODYX[k];
  SPR.chars.player.s=1.3;for(const k of ['slime','boar','bee','bat','spider','goblin','skel','archer','shield'])SPR.chars[k].s=1.25;SPR.chars.chick.s=1.1;
  makeFaces();
  $('sndB').textContent=S.sound?'🔊':'🔇';applyLang();show('sMenu');music('menu');
  requestAnimationFrame(tt=>{last=tt;frame(tt);});
}
document.addEventListener('pointerdown',()=>{audioInit();if(AC&&AC.state==='suspended')AC.resume();},{passive:true});
window.__sobe={cam,PH,get G(){return G;},get P(){return P;},get LV(){return LV;},S,startLevel,IN,press,release,save,WORLDS};
boot();
})();

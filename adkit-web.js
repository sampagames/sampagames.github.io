/* AdKit (web demo) — Sampa Games vitrini.
 * Uygulamada reklam olan yerlerde burada reklam yok: ödüller hediye edilir ve
 * oyuncuya oyunun Google Play sürümü hatırlatılır. */
(function () {
  'use strict';
  if (window.AdKit) return;
  var me = document.currentScript;
  var PKG = (me && me.getAttribute('data-pkg')) || '';
  var URL_PLAY = 'https://play.google.com/store/apps/details?id=' + PKG;
  var lang = 'en';
  try { lang = (localStorage.getItem('sg_lang') || window.SG_LANG || (navigator.languages && navigator.languages[0]) || navigator.language || 'en'); } catch (e) { lang = window.SG_LANG || navigator.language || 'en'; }
  lang = String(lang).slice(0, 2).toLowerCase(); if (lang === 'in') lang = 'id';
  var T = {
    tr: { gift: 'Hediye!', giftText: 'Telefonda bu ödül kısa bir reklamla kazanılır. Burada sana hediye.', take: 'Ödülü al', play: 'Google Play’den indir', no: 'Hayır, teşekkürler', nudgeT: 'Beğendin mi?', nudge: 'Tam sürüm telefonunda, internetsiz ve ücretsiz.', later: 'Oynamaya devam' },
    en: { gift: 'On the house!', giftText: 'On your phone this reward costs a short ad. Here it is free.', take: 'Claim reward', play: 'Get it on Google Play', no: 'No thanks', nudgeT: 'Enjoying it?', nudge: 'Get the full game on your phone, free and offline.', later: 'Keep playing' },
    es: { gift: '¡Regalo!', giftText: 'En el móvil este premio cuesta un anuncio corto. Aquí es gratis.', take: 'Tomar premio', play: 'Descárgalo en Google Play', no: 'No, gracias', nudgeT: '¿Te gusta?', nudge: 'El juego completo en tu móvil, gratis y sin conexión.', later: 'Seguir jugando' },
    pt: { gift: 'Presente!', giftText: 'No celular este prêmio custa um anúncio curto. Aqui é grátis.', take: 'Pegar prêmio', play: 'Baixe no Google Play', no: 'Não, obrigado', nudgeT: 'Está curtindo?', nudge: 'O jogo completo no seu celular, grátis e offline.', later: 'Continuar jogando' },
    de: { gift: 'Geschenk!', giftText: 'Auf dem Handy kostet diese Belohnung eine kurze Werbung. Hier ist sie gratis.', take: 'Belohnung holen', play: 'Bei Google Play laden', no: 'Nein, danke', nudgeT: 'Gefällt es dir?', nudge: 'Das ganze Spiel auf deinem Handy, gratis und offline.', later: 'Weiterspielen' },
    fr: { gift: 'Cadeau !', giftText: 'Sur mobile, cette récompense coûte une courte pub. Ici, elle est offerte.', take: 'Récupérer', play: 'Disponible sur Google Play', no: 'Non merci', nudgeT: 'Ça te plaît ?', nudge: 'Le jeu complet sur ton téléphone, gratuit et hors ligne.', later: 'Continuer' },
    id: { gift: 'Hadiah!', giftText: 'Di HP, hadiah ini didapat lewat iklan singkat. Di sini gratis.', take: 'Ambil hadiah', play: 'Unduh di Google Play', no: 'Tidak, terima kasih', nudgeT: 'Suka gamenya?', nudge: 'Game lengkapnya di HP-mu, gratis dan offline.', later: 'Lanjut main' },
    ru: { gift: 'Подарок!', giftText: 'На телефоне эта награда стоит короткой рекламы. Здесь она бесплатна.', take: 'Забрать', play: 'Скачать в Google Play', no: 'Нет, спасибо', nudgeT: 'Нравится?', nudge: 'Полная версия на телефоне, бесплатно и без интернета.', later: 'Играть дальше' }
  };
  var tx = T[lang] || T.en;
  var css = '.skw{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(8,12,24,.62);font:15px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;padding:16px}' +
    '.skw .b{background:#fff;color:#172033;border-radius:18px;max-width:340px;width:100%;padding:22px 20px 18px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.35)}' +
    '.skw h3{margin:0 0 6px;font-size:21px}.skw p{margin:0 0 16px;color:#4a5568}' +
    '.skw a,.skw button{display:block;width:100%;box-sizing:border-box;border:0;border-radius:12px;padding:12px;font:600 15px system-ui,sans-serif;cursor:pointer;margin-top:8px;text-decoration:none}' +
    '.skw .go{background:#ff5a36;color:#fff}.skw .gp{background:#01875f;color:#fff}.skw .ln{background:transparent;color:#4a5568}';
  function box(title, text, buttons) {
    return new Promise(function (resolve) {
      if (!document.getElementById('skw-css')) { var s = document.createElement('style'); s.id = 'skw-css'; s.textContent = css; document.head.appendChild(s); }
      var w = document.createElement('div'); w.className = 'skw';
      var b = document.createElement('div'); b.className = 'b'; w.appendChild(b);
      var h = document.createElement('h3'); h.textContent = title; b.appendChild(h);
      var p = document.createElement('p'); p.textContent = text; b.appendChild(p);
      buttons.forEach(function (o) {
        var el;
        if (o.href) { el = document.createElement('a'); el.href = o.href; el.target = '_blank'; el.rel = 'noopener'; }
        else el = document.createElement('button');
        el.className = o.cls; el.textContent = o.label;
        el.addEventListener('click', function () { if (!o.keep) { w.remove(); resolve(o.value); } });
        b.appendChild(el);
      });
      (document.body || document.documentElement).appendChild(w);
    });
  }
  function ping(kind) { try { parent.postMessage({ sampa: kind }, '*'); } catch (e) {} }
  var gifts = 0, levels = 0;
  function gift(title) {
    gifts++; ping('gift');
    return box(title || tx.gift, tx.giftText, [
      { label: tx.take, cls: 'go', value: true },
      { label: tx.play, cls: 'gp', href: URL_PLAY, keep: true }
    ]);
  }
  window.AdKit = {
    rewarded: function () { return gift(); },
    offer: function (o) { return gift(o && o.title); },
    levelDone: function () {
      levels++;
      if (levels % 4 === 0) { ping('nudge'); return box(tx.nudgeT, tx.nudge, [{ label: tx.play, cls: 'gp', href: URL_PLAY, keep: true }, { label: tx.later, cls: 'ln', value: false }]); }
      return Promise.resolve(false);
    },
    breakpoint: function () { return Promise.resolve(); },
    left: function () { return 99; },
    available: function () { return true; }
  };
})();

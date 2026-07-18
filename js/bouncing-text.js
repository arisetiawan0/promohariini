// BouncingText — pecah teks jadi huruf, tiap huruf bounce kecil dengan delay
// bertingkat (stagger) sehingga membentuk gelombang. Vanilla JS, tanpa dependensi.
//
// Pemakaian:
//   import { applyBouncingText } from './js/bouncing-text.js';
//   var next = applyBouncingText(el, { amplitude: 4, duration: 0.6, stagger: 0.1 });
//   // `next` = index stagger berikutnya, untuk melanjutkan gelombang ke elemen lain.
//
// Opsi:
//   amplitude  px naik maksimum (default 4 → translateY -4px)
//   duration   detik per siklus bounce (default 0.6)
//   stagger    detik jeda antar huruf (default 0.1)
//   startIndex index awal stagger, untuk merangkai beberapa elemen (default 0)

var STYLE_ID = 'bouncing-text-style';

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  var style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent =
    '.bt-char{display:inline-block;will-change:transform;' +
    'animation:bt-bounce var(--bt-dur,.6s) ease-in-out infinite;' +
    'animation-delay:var(--bt-delay,0s);}' +
    '@keyframes bt-bounce{0%,100%{transform:translateY(0)}' +
    '50%{transform:translateY(var(--bt-amp,-4px))}}' +
    '@media (prefers-reduced-motion: reduce){.bt-char{animation:none}}';
  document.head.appendChild(style);
}

export function applyBouncingText(el, opts) {
  opts = opts || {};
  var amplitude = opts.amplitude != null ? opts.amplitude : 4;
  var duration = opts.duration != null ? opts.duration : 0.6;
  var stagger = opts.stagger != null ? opts.stagger : 0.1;
  var index = opts.startIndex || 0;

  if (!el || el.dataset.btApplied === '1') return index;

  injectStyle();

  var text = el.textContent;
  el.setAttribute('aria-label', text);
  el.dataset.btApplied = '1';
  el.textContent = '';

  var frag = document.createDocumentFragment();
  for (var i = 0; i < text.length; i++) {
    var ch = text[i];
    if (ch === ' ') {
      frag.appendChild(document.createTextNode(' '));
      continue;
    }
    var span = document.createElement('span');
    span.className = 'bt-char';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = ch;
    span.style.setProperty('--bt-amp', -amplitude + 'px');
    span.style.setProperty('--bt-dur', duration + 's');
    span.style.setProperty('--bt-delay', (index * stagger).toFixed(2) + 's');
    frag.appendChild(span);
    index++;
  }
  el.appendChild(frag);
  return index;
}

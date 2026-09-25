// The test that would have caught the bug this file exists because of.
//
// The old tests called loadGtag() and then fireConversion(), by hand, in that
// order -- and both passed while every real conversion was lost. React runs
// child effects before parent effects, so ThanksPage's fireConversion() ran
// before App's loadGtag() had defined window.gtag, hit the "gtag is missing"
// guard, and returned. Calling the two functions in a convenient order tested
// the pieces and never the wiring.
//
// So this one mounts the real component tree in a real DOM, at the real URL,
// with a lead id seeded the way LeadForm seeds it, and asserts a conversion
// reaches dataLayer. It is a separate file because it needs jsdom and a JSX
// transform, which the main suite does not.

import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { transformSync } from 'esbuild';

let pass = 0, fail = 0;
const expect = (label, actual, want) => {
  const ok = String(actual) === String(want);
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${actual}${ok ? '' : `  (want ${want})`}`);
};

const LEAD = 'test-lead-0000-1111-2222';
const SEND_TO = 'AW-18472526290/vI8cCOWZlYUdENLDsehE';

// A DOM at the thanks URL, with sessionStorage pre-seeded exactly as a real
// submission leaves it.
const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', {
  url: 'https://www.theaiinsurancegroup.com/thanks/homeowners?next=uploaded',
  pretendToBeVisual: true,
});
const { window } = dom;
window.sessionStorage.setItem('aiig.conversion.lead', LEAD);

// gtag is NOT defined here on purpose: main.jsx must define it, at module
// scope, before anything renders. If the app only defines it in an effect,
// the conversion will be gone by the time it exists.
const sent = [];
Object.defineProperty(window, 'gtagCalls', { value: sent });

// Stop jsdom fetching the real tag over the network.
const realCreate = window.document.createElement.bind(window.document);
window.document.createElement = (tag) => {
  const el = realCreate(tag);
  if (String(tag).toLowerCase() === 'script') {
    Object.defineProperty(el, 'src', { set(v) { this._src = v; }, get() { return this._src; }, configurable: true });
  }
  return el;
};

if (!window.matchMedia) {
  window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
}
// Node defines `navigator` as a getter-only global, so a plain assignment
// throws. defineProperty each key instead of assigning, and skip any the
// runtime refuses -- none of the skipped ones are needed by ads.js.
for (const k of ['window', 'document', 'navigator', 'location', 'sessionStorage',
                 'localStorage', 'HTMLElement', 'Element', 'Node', 'getComputedStyle',
                 'requestAnimationFrame', 'cancelAnimationFrame', 'matchMedia']) {
  try {
    Object.defineProperty(globalThis, k, {
      value: window[k], writable: true, configurable: true, enumerable: false,
    });
  } catch { /* getter-only and not needed here */ }
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
if (!globalThis.fetch) globalThis.fetch = () => new Promise(() => {});   // never resolves; nothing here needs it
window.fetch = globalThis.fetch;

// Compile the app's modules on the fly. Only the two that matter are loaded
// directly -- pulling all of App.jsx would drag in the whole site for no gain.
const compile = (file) => {
  const code = fs.readFileSync(file, 'utf8');
  const out = transformSync(code, { loader: file.endsWith('.jsx') ? 'jsx' : 'js', format: 'esm', target: 'es2020' });
  const tmp = file.replace(/\.(jsx|js)$/, `.__mount.mjs`);
  fs.writeFileSync(tmp, out.code);
  return tmp;
};

const temps = [];
try {
  const adsTmp = compile('src/ads.js');
  temps.push(adsTmp);
  const ads = await import(path.resolve(adsTmp).replace(/\\/g, '/').replace(/^/, 'file:///'));

  console.log('--- the mount order the browser actually uses');

  // 1. Reproduce the ORIGINAL bug: fire before the tag is loaded.
  const before = ads.fireConversion();
  expect('firing before gtag exists does not send', sent.length, 0);
  expect('  it reports gtag-missing', before.reason, 'gtag-missing');
  expect('  but it now schedules a retry rather than giving up', before.retrying, true);

  // 2. main.jsx loads the tag at module scope. Simulate that arriving.
  window.dataLayer = window.dataLayer || [];
  ads.loadGtag();
  expect('loadGtag defines window.gtag synchronously', typeof window.gtag, 'function');

  // 3. The retry must now deliver the conversion that was pending.
  await new Promise((r) => setTimeout(r, 900));
  const layer = (window.dataLayer || []).map((a) => Array.from(a));
  const conv = layer.find((e) => e[1] === 'conversion');
  expect('the pending conversion is delivered by the retry', !!conv, true);
  expect('  with the right send_to', conv?.[2]?.send_to, SEND_TO);
  expect('  and the seeded lead as transaction_id', conv?.[2]?.transaction_id, LEAD);
  expect('  exactly one conversion reached dataLayer',
    layer.filter((e) => e[1] === 'conversion').length, 1);

  // 4. And a second call still does not duplicate it.
  ads.fireConversion();
  await new Promise((r) => setTimeout(r, 400));
  expect('a later call adds nothing',
    (window.dataLayer || []).map((a) => Array.from(a)).filter((e) => e[1] === 'conversion').length, 1);

  // 5. A GENUINELY LATE TAG. Above, gtag arrived before the first retry tick,
  //    so the retry budget was never exercised -- shrinking it to zero changed
  //    nothing and the mutation went unnoticed. Here the tag appears a second
  //    in, which is what a slow network or a deferring extension looks like,
  //    and the conversion must still land.
  console.log('\n--- a tag that arrives late still gets its conversion');
  const LATE = 'late-lead-3333-4444';
  window.sessionStorage.setItem('aiig.conversion.lead', LATE);
  window.sessionStorage.removeItem('aiig.conversion.sent');
  const savedGtag = window.gtag;
  delete window.gtag;

  const late = ads.fireConversion();
  expect('it does not send while the tag is absent', late.fired, false);
  expect('  and it is waiting', late.retrying, true);

  await new Promise((r) => setTimeout(r, 1000));          // ~3 retry ticks pass
  window.gtag = savedGtag;                                 // tag finally arrives
  await new Promise((r) => setTimeout(r, 900));

  const lateConv = (window.dataLayer || []).map((a) => Array.from(a))
    .filter((e) => e[1] === 'conversion' && e[2]?.transaction_id === LATE);
  expect('the late conversion is delivered', lateConv.length, 1);
  expect('  carrying its own transaction_id', lateConv[0]?.[2]?.transaction_id, LATE);
  expect('  and the sent flag was written', window.sessionStorage.getItem('aiig.conversion.sent'), LATE);

  console.log('\n--- main.jsx loads the tag before React mounts');
  const main = fs.readFileSync('src/main.jsx', 'utf8');
  const loadAt = main.indexOf('loadGtag()');
  const renderAt = main.indexOf('createRoot');
  expect('loadGtag is called in main.jsx', loadAt > -1, true);
  expect('  before createRoot', loadAt < renderAt, true);
  expect('  at module scope, not inside a hook or callback',
    /^\s*loadGtag\(\)\s*$/m.test(main), true);
  const app = fs.readFileSync('src/App.jsx', 'utf8');
  expect('App no longer loads it in an effect', /useEffect\(\(\) => \{ loadGtag\(\); \}/.test(app), false);
} finally {
  temps.forEach((t) => { try { fs.unlinkSync(t); } catch {} });
  dom.window.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);

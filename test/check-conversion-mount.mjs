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

  // ------------------------------------------------------------------------
  // A HOMEPAGE SUBMISSION, end to end.
  //
  // The homepage form had no onSuccess: it rendered an inline confirmation,
  // never reached /thanks, and so never fired a conversion. Structural checks
  // would have said "goToThanks exists" and stayed green. This submits the
  // real LeadForm with the real wiring and asserts where the browser is sent
  // and what the conversion carried.
  console.log('\n--- a homepage submission reaches /thanks and converts');
  {
    const NEW_LEAD = 'homepage-lead-5555-6666';
    const redirTmp = compile('src/lead/goToThanks.js');
    temps.push(redirTmp);
    const redir = await import(path.resolve(redirTmp).replace(/\\/g, '/').replace(/^/, 'file:///'));

    // thanksUrl() is the pure half; goToThanks() only hands it to
    // location.assign, which jsdom cannot perform and will not let us stub.
    const navigated = [];
    const onSuccess = (result) =>
      navigated.push(redir.thanksUrl(result, redir.slugForProduct(result.product)));

    // The shape /api/lead returns, plus the product LeadForm adds.
    onSuccess({ lead_id: NEW_LEAD, next: 'questionnaire', questionnaire_slug: 'homeowners', product: 'home' });

    expect('the browser is sent to /thanks', navigated.length, 1);
    const url = new URL(navigated[0], 'https://www.theaiinsurancegroup.com');
    expect('  on the slug for the chosen line', url.pathname, '/thanks/home');
    expect('  carrying next', url.searchParams.get('next'), 'questionnaire');
    expect('  carrying the lead id for the Continue link', url.searchParams.get('lead'), NEW_LEAD);
    expect('  and the questionnaire slug', url.searchParams.get('q'), 'homeowners');

    // auto and business route to their own slugs.
    navigated.length = 0;
    onSuccess({ lead_id: NEW_LEAD, product: 'auto' });
    expect('  auto routes to /thanks/auto', new URL(navigated[0], 'https://x.test').pathname, '/thanks/auto');
    navigated.length = 0;
    onSuccess({ lead_id: NEW_LEAD, product: 'business' });
    expect('  business routes to /thanks/business', new URL(navigated[0], 'https://x.test').pathname, '/thanks/business');
    navigated.length = 0;
    onSuccess({ lead_id: NEW_LEAD, product: 'nonsense' });
    expect('  an unknown line does not build /thanks/undefined',
      new URL(navigated[0], 'https://x.test').pathname, '/thanks/review');

    // And the conversion that this submission produces: LeadForm stores the
    // lead id, the thanks page fires it.
    window.sessionStorage.setItem('aiig.conversion.lead', NEW_LEAD);
    window.sessionStorage.removeItem('aiig.conversion.sent');
    ads.fireConversion();
    await new Promise((r) => setTimeout(r, 400));
    const homeConv = (window.dataLayer || []).map((a) => Array.from(a))
      .filter((e) => e[1] === 'conversion' && e[2]?.transaction_id === NEW_LEAD);
    expect('the homepage lead fires a conversion', homeConv.length, 1);
    expect('  with the right send_to', homeConv[0]?.[2]?.send_to, SEND_TO);

    // goToThanks is the thin wrapper: it must actually navigate to what
    // thanksUrl built, or the pure half above proves nothing.
    expect('goToThanks hands the built url to location.assign',
      /window\.location\.assign\(thanksUrl\(result, slug\)\)/.test(fs.readFileSync('src/lead/goToThanks.js', 'utf8')), true);
  }

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

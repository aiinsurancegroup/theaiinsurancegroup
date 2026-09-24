// The lead route's pure logic, exercised for real: ZIP -> state, and
// state + product -> where the visitor goes next.
import { stateFromZip, routeFor } from '../api/lead.js';
// Imported rather than grepped: the approved wording is checked as data, so a
// change to the text fails the test rather than a change to its formatting.
import { HOMEOWNERS_CLAIMS, AUTO_CLAIMS } from '../src/lead/claims.js';
import fs from 'node:fs';

let pass = 0, fail = 0;
const expect = (label, actual, want) => {
  const ok = String(actual) === String(want);
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${actual}${ok ? '' : `  (want ${want})`}`);
};

console.log('--- ZIP to state, the three we are licensed in');
for (const [zip, st] of [
  ['07701', 'NJ'],  // Red Bank, Monmouth County
  ['08540', 'NJ'],
  ['07030', 'NJ'],
  ['19103', 'PA'],  // Philadelphia
  ['15213', 'PA'],  // Pittsburgh
  ['33139', 'FL'],  // Miami Beach
  ['32801', 'FL'],  // Orlando
]) expect(`  ${zip}`, stateFromZip(zip), st);

console.log('\n--- and everywhere else, because every lead is tagged');
for (const [zip, st] of [
  ['10001', 'NY'], ['90210', 'CA'], ['60601', 'IL'], ['73301', 'TX'],
  ['99501', 'AK'], ['96801', 'HI'], ['20500', 'DC'], ['02139', 'MA'],
  ['88901', 'NV'], ['00601', 'PR'], ['59001', 'MT'], ['83201', 'ID'],
]) expect(`  ${zip}`, stateFromZip(zip), st);

console.log('\n--- ZIP+4 and formatting people actually type');
expect('ZIP+4 works', stateFromZip('07701-1234'), 'NJ');
expect('whitespace tolerated', stateFromZip('  07701  '), 'NJ');
for (const bad of ['1234', 'abcde', '', null, undefined, '000000', 12345]) {
  expect(`  rejects ${JSON.stringify(bad)}`, stateFromZip(bad), 'null');
}

console.log('\n--- routing: licensed states go to a questionnaire');
expect('NJ home', routeFor('home', 'NJ').questionnaire_slug, 'homeowners');
expect('NJ auto', routeFor('auto', 'NJ').questionnaire_slug, 'auto-nj');
expect('NJ umbrella', routeFor('umbrella', 'NJ').questionnaire_slug, 'personal-umbrella');
expect('NJ business', routeFor('business', 'NJ').questionnaire_slug, 'general-liability');
expect('FL home', routeFor('home', 'FL').questionnaire_slug, 'homeowners');
expect('PA home', routeFor('home', 'PA').questionnaire_slug, 'homeowners');

console.log('\n--- the auto questionnaire is New Jersey-specific');
// Routing a Pennsylvanian into a form full of NJ coverage questions would be
// worse than routing them nowhere, so they are captured and picked up by hand.
expect('PA auto has no slug', routeFor('auto', 'PA').questionnaire_slug, 'null');
expect('  but PA is still licensed', routeFor('auto', 'PA').in_licensed_state, true);
expect('FL auto has no slug', routeFor('auto', 'FL').questionnaire_slug, 'null');

console.log('\n--- out-of-area leads are captured, never refused');
for (const st of ['NY', 'CA', 'TX', 'PR', null]) {
  const r = routeFor('home', st);
  expect(`  ${st}: flagged not licensed`, r.in_licensed_state, false);
  expect(`  ${st}: no questionnaire`, r.questionnaire_slug, 'null');
}
// Nothing in the module rejects, blocks or turns anyone away.
const src = fs.readFileSync('api/lead.js', 'utf8');
expect('no rejection path exists', /not licensed in your state|cannot help|we do not serve/i.test(src), false);
expect('the flag is documented as triage, not a gate', src.includes('flagged for the operator to decide'), true);

console.log('\n--- consent is authoritative, never taken from the request');
expect('TCPA text is a server constant', src.includes('const TCPA_CONSENT_TEXT ='), true);
expect('docs text is a server constant', src.includes('const DOCS_CONSENT_TEXT ='), true);
expect('  the request never supplies wording', /consent_text: body\./.test(src), false);
expect('  stored verbatim from the constant', src.includes('tcpa_consent_text: TCPA_CONSENT_TEXT'), true);
expect('TCPA is required to submit', src.includes('body.tcpa_consent !== true'), true);
expect('  documents consent is separate and optional', src.includes('if (body.docs_consent === true)'), true);
expect('IP comes from the request, not the body', src.includes('tcpa_consent_ip: ip'), true);
expect('  and the user agent too', src.includes('req.headers["user-agent"]'), true);

console.log('\n--- the lead is written before anything else can fail');
expect('event write is non-blocking', /try \{[\s\S]{0,400}lead_events[\s\S]{0,400}\} catch/.test(src), true);
expect('  and a failure is logged', src.includes('[lead] event write failed'), true);
// An earlier version of this searched the file for the word "anon" and matched
// the comments explaining why anon holds no grant -- it was testing prose, not
// behaviour. What matters is which credential the route actually uses.
expect('authenticates with the service key', src.includes('process.env.SUPABASE_SERVICE_ROLE_KEY'), true);
expect('  no key literal is embedded', /eyJ[A-Za-z0-9_-]{20,}/.test(src), false);
expect('  and it never builds a browser client', /createClient\(/.test(src), false);


// --- Path A: the upload actually lands -------------------------------------
console.log('\n--- Path A creates a real audit, not a recorded intention');
expect('an audit row is created', src.includes('async function createAuditForLead'), true);
expect('  with a signed upload URL', src.includes('/storage/v1/object/upload/sign/'), true);
expect('  into the policies bucket', src.includes('const BUCKET = "policies"'), true);
expect('  and the server owns the path', src.includes('`${audit.id}/${randomSegment()}_${safeFileName(fileName)}`'), true);
expect('the lead is linked to its audit', /leads\?id=eq\.\$\{lead\.id\}[\s\S]{0,200}audit_id: created\.audit_id/.test(src), true);
// Anchored on the REST call, not the first mention: "audit_policies" appears in
// a comment 6000 characters earlier, and matching that proved nothing.
expect('attach writes an audit_policies row', /rest\/v1\/audit_policies[\s\S]{0,400}storage_path: path/.test(src), true);
expect('  PENDING, ready for the dashboard', src.includes('ai_status: "PENDING"'), true);
expect('  and logs POLICY_UPLOADED', src.includes('"POLICY_UPLOADED"'), true);
expect('client_industry is set explicitly', src.includes('client_industry:'), true);

console.log('\n--- an upload cannot be attached to someone else"s audit');
// The path is server-minted, but the browser hands it back, so attach must
// confirm it sits inside the audit already linked to that lead.
expect('the path is checked against the lead"s own audit', src.includes('!path.startsWith(prefix)'), true);
expect('  prefix comes from the looked-up lead', src.includes('const prefix = `${lead.audit_id}/`'), true);
expect('  traversal is rejected', src.includes('path.includes("..")'), true);
expect('  and the shape is pinned', src.includes(String.raw`/^[0-9a-f-]{36}\/[A-Za-z0-9._-]{1,200}$/`), true);
expect('a rejected path is logged', src.includes('attach rejected a path outside its own audit'), true);
expect('lead_id must be a uuid', src.includes('UUID_RE.test(String(body.lead_id'), true);

console.log('\n--- an upload problem never costs the lead');
// Ordering INSIDE the handler. Comparing whole-file positions matched the
// function's own definition near the top of the file, not the call site.
const handler = src.slice(src.indexOf('export default async function handler'));
expect('the lead is written before the audit',
  handler.indexOf('rest/v1/leads`') < handler.indexOf('await createAuditForLead('), true);
expect('  and the audit only after a saved lead', handler.includes('const created = await createAuditForLead(lead'), true);
expect('an oversized file returns a message, not a failure', src.includes("We'll email you about it instead"), true);
expect('a failed sign returns a message too', src.includes("We couldn't prepare the upload"), true);
expect('upload requires the documents consent', src.includes('body.will_upload === true && body.docs_consent === true'), true);

console.log('\n--- Path A ends at Step 1');
expect('an upload short-circuits the questionnaire', src.includes('next: upload?.path ? "uploaded"'), true);
expect('  the reason is written down', src.includes('the declarations page carries what the questionnaire'), true);

// --- the Step 1 form --------------------------------------------------------
const form = fs.readFileSync('src/lead/LeadForm.jsx', 'utf8');
const attrib = fs.readFileSync('src/lead/attribution.js', 'utf8');

console.log('\n--- the consent shown matches the consent stored');
// The server stores its own copy verbatim. If the two texts drift, a person
// agreed to one thing and we recorded another.
// Index-based rather than a regex. The first version built the pattern from a
// template literal, where \s is not an escape -- it compiled as "=s*", matched
// nothing, and the comparison silently had nothing to compare. A test that
// cannot fail is worse than no test.
const grabConst = (s, name) => {
  const at = s.indexOf(`const ${name} =`);
  if (at < 0) return null;
  const open = s.indexOf('"', at);
  const close = s.indexOf('"', open + 1);
  return open < 0 || close < 0 ? null : s.slice(open + 1, close);
};
const shownTcpa = grabConst(form, 'TCPA_TEXT');
const storedTcpa = grabConst(src, 'TCPA_CONSENT_TEXT');
expect('TCPA text found in the form', typeof shownTcpa, 'string');
expect('  and in the server', typeof storedTcpa, 'string');
expect('  neither is empty', (shownTcpa || '').length > 200, true);
expect('TCPA shown === TCPA stored', shownTcpa === storedTcpa, true);
const shownDocs = grabConst(form, 'DOCS_TEXT');
const storedDocs = grabConst(src, 'DOCS_CONSENT_TEXT');
expect('docs shown === docs stored', shownDocs === storedDocs, true);

console.log('\n--- consent gates the right things');
expect('TCPA blocks submit', form.includes('if (!tcpa) {'), true);
expect('docs consent only required with a file', form.includes('if (file && !docsOk)'), true);
expect('  and the box only appears with one', form.includes('{file && ('), true);
expect('docs consent clears when the file is removed', form.includes('if (!f) setDocsOk(false)'), true);

console.log('\n--- mobile is the constraint, not a consideration');
expect('16px inputs so iOS does not zoom', form.includes('fontSize: 16, // 16px: anything smaller'), true);
for (const [label, needle] of [
  ['numeric keypad for ZIP', 'inputMode="numeric"'],
  ['tel keypad for mobile', 'type="tel"'],
  ['email keyboard', 'inputMode="email"'],
  ['autocomplete on names', 'autoComplete="given-name"'],
  ['autocomplete on postcode', 'autoComplete="postal-code"'],
  ['camera-friendly accept', 'image/*'],
  ['a photo is offered explicitly', 'A clear photo of your declarations page works'],
]) expect(`  ${label}`, form.includes(needle), true);

console.log('\n--- an upload failure never looks like a lost enquiry');
expect('the PUT is wrapped', /try \{[\s\S]{0,700}signed_url[\s\S]{0,700}\} catch/.test(form), true);
expect('  and says what happens next', form.includes("didn't finish uploading"), true);
expect('oversize is caught before submit', form.includes('That file is ${(f.size / 1048576).toFixed(1)} MB'), true);

console.log('\n--- Path A ends here, Path B continues');
expect('an upload ends the flow', form.includes("There's nothing else you need to do"), true);
expect('  no questionnaire link when uploaded', /done\.uploaded \?/.test(form), true);
expect('Path B links to the questionnaire', form.includes('`/quote/${done.questionnaire_slug}?lead=${done.lead_id}`'), true);
expect('out-of-area still gets a human', form.includes('A licensed agent will be in touch shortly'), true);

console.log('\n--- attribution is first touch, and survives browsing');
expect('captured on mount, not at submit', form.includes('useEffect(() => { captureAttribution(); }, [])'), true);
expect('existing attribution is never overwritten', attrib.includes('if (existing) {'), true);
expect('  with a 90-day window', attrib.includes('TTL_DAYS = 90'), true);
// Two guards, one per storage call. captureAttribution needs none of its own
// because it only reaches storage through them.
expect('every storage call is guarded', (attrib.match(/catch/g) || []).length, 2);
expect('  the read is guarded', /function read\(\)[\s\S]{0,400}catch/.test(attrib), true);
expect('  the write is guarded', /function write\(value\)[\s\S]{0,300}catch/.test(attrib), true);
expect('  and fall back to memory', attrib.includes('let memo = null'), true);
expect('gclid is carried', attrib.includes('"gclid"'), true);
expect('direct traffic is recorded too', attrib.includes('is still worth recording'), true);

// --- every non-uploader gets a secure link ---------------------------------
console.log('\n--- a lead without a file is emailed a link, unasked');
expect('the link path exists', src.includes('async function emailUploadLink'), true);
expect('  fires when nothing was uploaded', src.includes('if (!upload?.path) {'), true);
expect('  including when the upload failed', src.includes('covers the visitor who never picked one'), true);
expect('  and logs UPLOAD_LINK_SENT', src.includes('"UPLOAD_LINK_SENT"'), true);
// The form is now upload-first, so there IS a second button -- "No policy
// handy? Answer a few questions", which Sal asked for. What must not come back
// is a second SUBMIT: the emailed link still fires server-side for any lead
// with no file (asserted just above), and the skip path only collapses the
// button and swaps a helper line.
expect('the skip path still promises the emailed link',
  /we.ll email you a secure link to send it later/.test(form), true);
expect('  and skipping changes nothing about what is submitted',
  form.includes('It does not change what gets submitted'), true);
expect('  there is still exactly one submit button',
  (form.match(/type="submit"/g) || []).length, 1);

console.log('\n--- the emailed token is a real portal credential');
expect('32 crypto bytes', src.includes('crypto.randomBytes(32).toString("hex")'), true);
expect('  never Math.random', /Math\.random\(\)[\s\S]{0,80}token/i.test(src), false);
expect('  with a 90-day expiry', src.includes('TOKEN_TTL_DAYS = 90'), true);
expect('  written to the audit row', src.includes('client_token_expires_at: expires.toISOString()'), true);
expect('points at the portal, not this site', src.includes('const PORTAL_ORIGIN = "https://audit.theaiinsurancegroup.com"'), true);
expect('the name is escaped into the email', src.includes('escapeHtml(lead.first_name'), true);

console.log('\n--- the link step cannot cost a lead');
expect('wrapped and swallowed', /if \(!upload\?\.path\) \{\s*try \{/.test(src), true);
expect('  a missing RESEND key is logged loudly', src.includes('RESEND_API_KEY not set -- upload link'), true);
expect('  and says the link still works', src.includes('The link exists and works; only the delivery is missing'), true);
expect('no signed URL is minted without a file', src.includes('if (!fileName) return { audit_id: audit.id, upload: null };'), true);

console.log('\n--- the confirmation says what happened');
expect('scrolls itself into view', form.includes('scrollIntoView({ behavior: "smooth", block: "center" })'), true);
expect('  because blank space reads as failure', form.includes('That reads as a failed submission'), true);
expect('tells them a link was emailed', form.includes("We've emailed you a secure link so you can send your policy whenever it's handy."), true);
expect('  only when nothing was uploaded', form.includes('const emailedLink = !done.uploaded'), true);
expect('an upload still ends the flow', form.includes("There's nothing else you need to do"), true);

console.log('\n--- the upload prompt names real places a policy lives');
expect('phone, email or paper', form.includes('Have it on your phone, in your email, or on paper?'), true);
expect('  upload is the primary control, in gold with navy text',
  /Upload my policy \(PDF\)/.test(form) && /background: GOLD, color: NAVY/.test(form), true);
expect('  and the questions path is the outlined secondary',
  /No policy handy\? Answer a few questions/.test(form), true);
expect('  a photo is the suggested route', form.includes('A clear photo of your declarations page works'), true);


// --- Path B: the short questionnaire ---------------------------------------
const qapi = fs.readFileSync('api/questionnaire.js', 'utf8');
const qui = fs.readFileSync('src/lead/Questionnaire.jsx', 'utf8');
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const app = fs.readFileSync('src/App.jsx', 'utf8');

console.log('\n--- only declarations-stage questions are served');
expect('the query filters on stage', qapi.includes('stage=eq.declarations'), true);
expect('  underwriting is never sent', /stage=eq\.underwriting/.test(qapi), false);
expect('  nor step1, already collected', /stage=eq\.step1/.test(qapi), false);
expect('ordered as the document is', qapi.includes('order=sort_order.asc'), true);
expect('inactive questionnaires are refused', qapi.includes('active=is.true'), true);

console.log('\n--- answers survive an abandonment');
expect('saved on every advance', qui.includes('await save(last)'), true);
expect('  partial until finished', qapi.includes('complete ? "submitted" : "partial"'), true);
expect('the submission is linked to the lead', qapi.includes('submission_id: id'), true);
expect('  and STEP2_STARTED logged', qapi.includes('"STEP2_STARTED"'), true);
expect('  QUESTIONNAIRE_COMPLETED on finish', qapi.includes('"QUESTIONNAIRE_COMPLETED"'), true);
expect('a failed autosave does not block', /catch \{[\s\S]{0,300}Swallowed/.test(qui), true);

console.log('\n--- progress is counted in sections, not questions');
expect('sections shown', qui.includes('Section {sectionIndex + 1} of {sections.length}'), true);
expect('  never a question count', /Question \{/.test(qui), false);
expect('  and the reason is written down', qui.includes('"Question 12 of 46" tells them to stop'), true);

console.log('\n--- a stranger"s answers are bounded before storage');
expect('answer count capped', qapi.includes('MAX_ANSWERS = 60'), true);
expect('value length capped', qapi.includes('MAX_VALUE_LEN = 2000'), true);
expect('field keys are validated', qapi.includes('/^[A-Za-z0-9_]{1,60}$/'), true);
expect('slug shape is pinned', qapi.includes('SLUG_RE = /^[a-z0-9-]{2,40}$/'), true);
expect('origin checked like every other route', qapi.includes('if (!originOk) return res.status(403)'), true);
expect('service key, never an anon client', qapi.includes('SUPABASE_SERVICE_ROLE_KEY') && !/createClient\(/.test(qapi), true);

console.log('\n--- the route actually resolves');
// Without the rewrite the CDN 404s /quote/homeowners before React loads.
const rw = vercel.rewrites?.[0];
expect('an SPA fallback exists', !!rw, true);
expect('  it excludes /api', rw?.source?.includes('(?!api/'), true);
expect('  and serves index.html', rw?.destination, '/index.html');
// Asserted on backslash-free fragments deliberately. Three attempts to pin the
// whole regex lost their escapes -- once to the shell, twice to the string
// literal -- and each time produced a pattern matching nothing, which is a test
// that can only fail. The slug group is distinctive enough on its own.
expect('App routes /quote/:slug', app.includes('([a-z0-9-]{2,40})'), true);
expect('  read from the pathname, not a hash', app.includes('const path = window.location.pathname'), true);
expect('  and carries the lead id through', app.includes('leadId: q.get("lead")'), true);
expect('the form links there with the lead', form.includes('`/quote/${done.questionnaire_slug}?lead=${done.lead_id}`'), true);


// vercel.json is schema-validated at deploy time and unknown keys fail the
// build outright. A "comment" key inside the rewrite did exactly that, and the
// failure only showed up as a deployment in ERROR state.
console.log('\n--- vercel.json cannot carry keys Vercel rejects');
{
  const allowedRw = ['source', 'destination', 'has', 'missing', 'statusCode'];
  const bad = (vercel.rewrites || []).flatMap((r) => Object.keys(r).filter((k) => !allowedRw.includes(k)));
  expect('no unknown keys in any rewrite', bad.join(',') || 'none', 'none');
}


// --- paid landing pages ----------------------------------------------------
const landing = fs.readFileSync('src/lead/LandingPage.jsx', 'utf8');
const thanks = fs.readFileSync('src/lead/ThanksPage.jsx', 'utf8');
const claims = fs.readFileSync('src/lead/claims.js', 'utf8');

console.log('\n--- a paid page has no way out except the legal footer');
// Every link is a way to leave a page we paid to put someone on.
const anchors = [...landing.matchAll(/<a\s[^>]*href=\{?["'`]([^"'`}]+)/g)].map((m) => m[1]);
expect('no outbound anchors at all', anchors.length, 0);
expect('  the wordmark is not a link', /<a[^>]*>\s*\{?\s*The AI Insurance Group/.test(landing), false);
expect('legal opens in place, not away', landing.includes('onClick={() => onLegal?.(k)}'), true);
expect('  and they are buttons, not anchors', landing.includes('<button key={k} type="button"'), true);
expect('no site navigation is rendered', /<Nav\b|navLinks|nav-links/.test(landing), false);

console.log('\n--- the form is above the fold on a phone');
// The ordering IS the mechanism: headline, form, then everything else.
expect('the copy block dissolves so children can reorder', landing.includes('.lp-copy { display: contents; }'), true);
// The eyebrow is hidden on a phone: it repeated what the headline says, and on
// a screen where every pixel above the form pushes the submit button lower,
// saying the same thing twice is not worth a line of height.
expect('  eyebrow hidden on mobile', landing.includes('.lp-copy > div:first-child { display: none !important; }'), true);
expect('  but still shown on desktop', landing.includes('{cfg.eyebrow}'), true);
expect('  headline second', /\.lp-h1 \{ order: 2;/.test(landing), true);
expect('  FORM THIRD, before the explanation', /\.lp-form \{ order: 3; \}/.test(landing), true);
expect('  subhead after the form', /\.lp-sub \{ order: 4;/.test(landing), true);
expect('  proofs last', /\.lp-proofs \{ order: 5; \}/.test(landing), true);

console.log('\n--- every insurance claim comes from the approval file');
expect('headline is not written inline', landing.includes('{claims.headline}'), true);
expect('subhead is not written inline', landing.includes('{claims.subhead}'), true);
expect('proofs are not written inline', landing.includes('claims.proofs.map'), true);
expect('licence line is not written inline', landing.includes('{claims.licence}'), true);
// The page must not contain a hardcoded insurance assertion that bypassed review.
expect('no stray licence number in the component', landing.includes('3004245927'), false);
// The review reasoning must be comments, never exported data: an exported
// object ships whole, and our own note that a claim was "WEAK" has no business
// in a public bundle. Plain-string claims are the mechanism that guarantees it.
expect('reasoning lives in comments', claims.includes('// HEADLINE'), true);
expect('  every claim is a plain string', typeof HOMEOWNERS_CLAIMS.headline, 'string');
expect('  proofs too', typeof HOMEOWNERS_CLAIMS.proofs[0], 'string');
expect('no basis field is exported', claims.includes('basis:'), false);
expect('no risk field is exported', claims.includes('risk:'), false);
// Built output is where it actually matters -- this is the file a visitor gets.
{
  const dir = 'dist/assets';
  const built = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(`${dir}/${f}`, 'utf8')).join('')
    : '';
  if (built) {
    expect('the built bundle leaks no rejected wording', built.includes("Most policies haven't"), false);
    expect('  nor our assessment of it', built.includes('no source for') || built.includes('WEAK'), false);
    expect('  but does carry the approved copy', built.includes(HOMEOWNERS_CLAIMS.headline), true);
  } else {
    console.log('SKIP  built-bundle checks: run npm run build first');
  }
}
expect('claims are marked approved', claims.includes('APPROVED 2026-09-24'), true);
// The two sentences rewritten in review must not creep back into LIVE text.
// Both still appear in the basis and status fields, which is deliberate -- the
// record of what was rejected is worth keeping -- so the check reads only the
// rendered strings rather than the whole file.
const liveClaimText = [
  HOMEOWNERS_CLAIMS.headline, HOMEOWNERS_CLAIMS.subhead,
  HOMEOWNERS_CLAIMS.licence, ...HOMEOWNERS_CLAIMS.proofs,
  AUTO_CLAIMS.headline, AUTO_CLAIMS.subhead,
  AUTO_CLAIMS.licence, ...AUTO_CLAIMS.proofs,
].join(' | ');

expect('no unsourced market claim', liveClaimText.includes("Most policies haven't"), false);
expect('no state-specific claim on a three-state page', liveClaimText.includes('New Jersey lets you buy'), false);
expect('  the NJ variant is recorded as deferred', claims.includes('/review/auto-nj'), true);
expect('homeowners headline is the approved question', HOMEOWNERS_CLAIMS.headline, 'Is your home insured for what it would cost to rebuild today?');
expect('homeowners subhead has no dangling antecedent', liveClaimText.includes('since then'), false);
expect('auto subhead is state-neutral', AUTO_CLAIMS.subhead.startsWith('A basic auto policy can cover far less'), true);
// The licence line is still exact, and is the one place the number may appear.
expect('licence line unchanged', HOMEOWNERS_CLAIMS.licence.includes('NJ Producer License No. 3004245927'), true);

console.log('\n--- no timeframe is promised anywhere on a paid page');
for (const t of ['about a day', 'within a day', '24 hours', '48 hours', 'two business days', 'same day']) {
  expect(`  no "${t}"`, landing.includes(t) || claims.includes(`text:\n      "${t}`) , false);
}

console.log('\n--- the conversion fires on a page load');
expect('the form hands off instead of confirming inline', landing.includes('onSuccess={goToThanks}'), true);
expect('  by navigating to a real URL', landing.includes('window.location.assign(`/thanks/${variant}'), true);
expect('  carrying what the page must report', landing.includes('params.set("next"'), true);
expect('LeadForm supports the handoff', form.includes('onSuccess = null'), true);
expect('  and stays busy so it cannot double-submit', form.includes('if (onSuccess) { onSuccess(result); return; }'), true);
expect('the thanks page writes nothing', /fetch\(/.test(thanks), false);
expect('  so a refresh cannot duplicate a lead', thanks.includes('a visitor who reloads'), true);

console.log('\n--- the thanks page says what actually happened');
expect('upload path ends there', thanks.includes("There's nothing else you need to do"), true);
expect('non-upload path mentions the emailed link', thanks.includes("We've emailed you a secure link"), true);
expect('  and offers the questionnaire when there is one', thanks.includes('Continue →'), true);
expect('out-of-area still gets a human', thanks.includes('A licensed agent will be in touch shortly'), true);
expect('no dead end: a phone number is always shown', thanks.includes('AGENCY_PHONE'), true);

console.log('\n--- one contact number, and it is the agency line');
// It used to be typed by hand in five places here and three more in the audit
// tool, and the number typed was a personal mobile. These check the constant is
// the only source and that the old number is gone for good.
const contact = fs.readFileSync('src/contact.js', 'utf8');
expect('the agency number is the one in the module', contact.includes('732-314-1093'), true);
expect('  the tel: href is E.164', contact.includes('tel:+17323141093'), true);

const everySource = ['src/App.jsx', 'src/contact.js', 'src/lead/LandingPage.jsx',
  'src/lead/ThanksPage.jsx', 'src/lead/Questionnaire.jsx', 'src/lead/LeadForm.jsx']
  .map((f) => fs.readFileSync(f, 'utf8')).join('\n');
expect('the personal mobile appears nowhere', everySource.includes('917-981-0245'), false);
expect('  nor unformatted in an href', everySource.includes('9179810245'), false);
expect('no page hardcodes the number instead of importing it',
  everySource.split('732-314-1093').length - 1, 1);

console.log('\n--- every page a lead can land on offers a tappable number');
for (const [name, body] of [['landing', landing], ['thanks', thanks], ['questionnaire', qui]]) {
  expect(`${name} imports the shared contact details`, body.includes('from "../contact"'), true);
  expect(`  ${name} renders it as a tel: link`, body.includes('AGENCY_PHONE_HREF'), true);
}
expect('the site nav carries it too', app.includes('AGENCY_PHONE_HREF'), true);

console.log('\n--- the disclosures describe what the site actually shows');
// The panel used to disclose a list of FINRA Series licences "as referenced on
// our Sites" that were displayed nowhere on it.
expect('no securities licences are listed', /Series 7, 24, 55, 63/.test(app), false);
expect('  a background disclosure stands in its place', app.includes('Financial Services Background'), true);
expect('  and it disclaims securities services', app.includes('is not a broker-dealer or an investment adviser'), true);

console.log('\n--- the About copy is the approved text, unedited');
expect('paragraph 1 verbatim',
  app.includes('insurance should be reviewed, not simply renewed year after year'), true);
expect('paragraph 2 verbatim',
  app.includes('more than 30 years of experience in financial services, technology, and business leadership'), true);
expect('paragraph 3 verbatim',
  app.includes("combines modern technology with a licensed professional's judgment"), true);
expect('  the homepage teaser reuses it rather than restating it',
  app.includes('{ABOUT_BIO[0]}'), true);

console.log('\n--- page metadata matches the current positioning');
// One index.html serves every route, so the shell's title was being shown for
// /about and both paid landing pages too. It described AI liability coverage
// for lawyers and physicians -- two positionings ago.
const shell = fs.readFileSync('index.html', 'utf8');
const meta = fs.readFileSync('src/meta.js', 'utf8');
// The apex redirects to www, so www is the only host that should appear in a
// canonical, an og:url or the sitemap.
const HOST = 'https://www.theaiinsurancegroup.com';

// Read the actual tag values, not the file. Both of these first matched the
// HTML comment that explains what the old wording was, so they were green on
// the comment and would have stayed green if the tags themselves were wrong.
const shellTitle = (shell.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
const shellDesc = (shell.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';

expect('the old positioning is gone from the title', /AI Liability Coverage/i.test(shellTitle), false);
expect('  and from the description', /lawyers|physicians|wealth managers/i.test(shellDesc), false);
expect('the homepage title leads with the offer', shellTitle.includes('Free Insurance Policy Review'), true);
expect('  the description names the licensed states',
  /NJ, PA and FL|New Jersey, Pennsylvania and Florida/.test(shellDesc), true);
expect('  and says who checks the findings', /a licensed agent checks it/i.test(shellDesc), true);
expect('  and is a sensible length for a snippet', shellDesc.length > 80 && shellDesc.length < 200, true);

expect('a canonical is declared', shell.includes('rel="canonical"'), true);
expect('open graph tags exist at all', shell.includes('property="og:title"'), true);
expect('  with an image for the unfurl', shell.includes('og-card.png'), true);
expect('  sized, so the card renders large', shell.includes('og:image:width'), true);
expect('a favicon is linked', shell.includes('favicon.svg'), true);

expect('every route gets its own metadata', app.includes('applyMeta(route)'), true);
for (const k of ['about', 'review:homeowners', 'review:auto', 'quote', 'thanks']) {
  expect(`  ${k} has an entry`, meta.includes(`"${k}"`) || meta.includes(`${k}:`), true);
}
// The paid pages must not carry a second, unreviewed wording of an approved claim.
expect('paid descriptions come from the approved claims, not a retype',
  meta.includes('HOMEOWNERS_CLAIMS.subhead') && meta.includes('AUTO_CLAIMS.subhead'), true);
expect('the conversion page is noindex', /thanks:[\s\S]{0,260}noindex/.test(meta), true);
expect('  so is the questionnaire', /quote:[\s\S]{0,260}noindex/.test(meta), true);

const robots = fs.readFileSync('public/robots.txt', 'utf8');
expect('robots.txt keeps /thanks out of search', robots.includes('Disallow: /thanks/'), true);
expect('  and /quote', robots.includes('Disallow: /quote/'), true);
expect('  and points at the sitemap', robots.includes('sitemap.xml'), true);

const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
// The <loc> values, not the file -- the comment in it names the excluded paths.
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
expect('sitemap lists the indexable pages', locs.length, 4);
expect('  and excludes the funnel pages',
  locs.some((l) => l.includes('/thanks') || l.includes('/quote')), false);
expect('  every listed page is a route the app serves',
  locs.every((l) => ['/', '/about', '/review/homeowners', '/review/auto']
    .includes(l.replace(HOST, '') || '/')), true);

console.log('\n--- one host, spelled the way the site answers');
// The apex 307-redirects to www and Search Console is verified on the www
// property, so a sitemap of apex URLs returned "Couldn't fetch". Canonical,
// og:url and the sitemap have to agree on the host or they argue.
expect('sitemap uses www on every entry', locs.every((l) => l.startsWith(HOST)), true);
expect('  and none of them is a bare apex URL',
  locs.some((l) => /^https:\/\/theaiinsurancegroup\.com/.test(l)), false);
expect('the canonical in the shell is www', shell.includes(`rel="canonical" href="${HOST}/"`), true);
expect('  og:url agrees with it', shell.includes(`property="og:url" content="${HOST}/"`), true);
expect('  og:image too, so an unfurler is not redirected',
  shell.includes(`${HOST}/og-card.png`), true);
expect('runtime canonicals use the same host', meta.includes(`"${HOST}"`), true);
expect('robots.txt points at the www sitemap', robots.includes(`Sitemap: ${HOST}/sitemap.xml`), true);

console.log('\n--- an unknown ad destination does not render an empty shell');
expect('only real variants match', app.includes('(homeowners|auto)'), true);
expect('  the reason is written down', app.includes('a broken ad destination is a paid click that buys nothing'), true);

console.log(`\n${pass} passed, ${fail} failed`);

process.exit(fail ? 1 : 0);
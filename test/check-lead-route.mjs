// The lead route's pure logic, exercised for real: ZIP -> state, and
// state + product -> where the visitor goes next.
import { stateFromZip, routeFor } from '../api/lead.js';
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

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

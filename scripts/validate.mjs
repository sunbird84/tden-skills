#!/usr/bin/env node
/**
 * scripts/validate.mjs — JSON Schema validator for tden-skills/manifests/*.json
 *
 * Run: `node scripts/validate.mjs` (or via CI). Exits non-zero on any violation.
 *
 * Phase A2.7+:用 ajv 校验 manifests/ 下每个 JSON 是否符合 schema/skill-v1.schema.json。
 * 任何字段超长 / pattern 不合 / required 缺失 → 立刻 fail,贴出错信息。
 *
 * Phase A2.7+: validates each manifests/*.json against schema/skill-v1.schema.json.
 * Any violation fails the run with a precise pointer to the offending field.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const schemaPath = join(root, 'schema', 'skill-v1.schema.json');
const manifestsDir = join(root, 'manifests');

const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const files = readdirSync(manifestsDir).filter(f => f.endsWith('.json'));
if (files.length === 0) {
  console.error('❌ No manifest JSON files found in manifests/');
  process.exit(2);
}

let failures = 0;
let successes = 0;
for (const file of files) {
  const path = join(manifestsDir, file);
  const data = JSON.parse(readFileSync(path, 'utf8'));
  if (validate(data)) {
    console.log(`✅ ${file}  (id=${data.id}, ${data.fields?.length || 0} fields)`);
    successes++;
  } else {
    console.error(`\n❌ ${file}`);
    for (const err of validate.errors || []) {
      console.error(`   • ${err.instancePath || '(root)'}: ${err.message}`);
      if (err.params) console.error(`     params: ${JSON.stringify(err.params)}`);
    }
    failures++;
  }
}

console.log(`\n── Summary: ${successes} passed, ${failures} failed (${files.length} total)`);
if (failures > 0) {
  console.error(`\n❌ ${failures} manifest(s) violate the schema. Fix them before merging.`);
  process.exit(1);
}
console.log('✓ All manifests valid.');

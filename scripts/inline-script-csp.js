import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BUILD_DIR = 'build';
const HEADERS_FILE = join(BUILD_DIR, '_headers');
const HASHES_PLACEHOLDER = '__INLINE_SCRIPT_HASHES__';
const INLINE_SCRIPT = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/g;
const NON_EXECUTABLE_TYPE = /type\s*=\s*["']application\/(ld\+)?json["']/;

function htmlFilesIn(directory) {
	return readdirSync(directory, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
		.map((entry) => join(entry.parentPath, entry.name));
}

function isExecutableInline(attributes = '') {
	return !attributes.includes('src=') && !NON_EXECUTABLE_TYPE.test(attributes);
}

function inlineScriptBodies(html) {
	return [...html.matchAll(INLINE_SCRIPT)]
		.filter(([, attributes]) => isExecutableInline(attributes))
		.map(([, , body]) => body);
}

function cspHash(body) {
	return `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
}

const hashes = new Set(
	htmlFilesIn(BUILD_DIR).flatMap((file) => inlineScriptBodies(readFileSync(file, 'utf8')).map(cspHash))
);

const headers = readFileSync(HEADERS_FILE, 'utf8');
if (!headers.includes(HASHES_PLACEHOLDER)) {
	throw new Error(`${HEADERS_FILE} has no ${HASHES_PLACEHOLDER} placeholder`);
}
writeFileSync(HEADERS_FILE, headers.replace(HASHES_PLACEHOLDER, [...hashes].join(' ')));
console.log(`CSP: hashed ${hashes.size} inline script(s) into ${HEADERS_FILE}`);
